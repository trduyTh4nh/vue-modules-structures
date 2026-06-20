import type {
  Result,
  ApiSuccess,
  ApiFailure,
  BusinessError,
  GenericError,
  ApiError,
  Success,
  Failure,
} from "./types";
import { logger } from "@/shared/common/utils/logger";

/**
 * Creates a Success result
 */
export const success = <T>(value: T): Success<T> => ({
  _tag: "Success",
  value,
  isSuccess: function (this: Success<T>): this is Success<T> {
    return true;
  },
  isFailure: function (this: Success<T>): this is Failure<never> {
    return false;
  },
  map: function <U>(this: Success<T>, fn: (value: T) => U): Result<never, U> {
    return success(fn(this.value));
  },
  flatMap: function <U>(
    this: Success<T>,
    fn: (value: T) => Result<never, U>,
  ): Result<never, U> {
    return fn(this.value);
  },
  fold: function <R>(
    this: Success<T>,
    _onFailure: (error: never) => R,
    onSuccess: (value: T) => R,
  ): R {
    return onSuccess(this.value);
  },
});

/**
 * Creates a Failure result
 */
export const failure = <E>(value: E): Failure<E> => ({
  _tag: "Failure",
  value,
  isSuccess: function (this: Failure<E>): this is Success<never> {
    return false;
  },
  isFailure: function (this: Failure<E>): this is Failure<E> {
    return true;
  },
  map: function <U>(
    this: Failure<E>,
    _fn: (value: never) => U,
  ): Result<E, never> {
    return failure(this.value);
  },
  flatMap: function <U>(
    this: Failure<E>,
    _fn: (value: never) => Result<E, never>,
  ): Result<E, never> {
    return failure(this.value);
  },
  fold: function <R>(
    this: Failure<E>,
    onFailure: (error: E) => R,
    _onSuccess: (value: never) => R,
  ): R {
    return onFailure(this.value);
  },
});

/**
 * Converts successful Axios response to ApiSuccess
 */
export const handleSuccessResponse = <T>(response: any): ApiSuccess<T> => ({
  data: response.data,
  status: response.status,
});

/**
 * Converts Axios error to Result (Failure)
 */
export const handleErrorResponse = (error: any): Result<ApiFailure, never> => {
  const err = error as ApiError;
  const { code, reason, message } = err.response?.data || {};
  const status = err.response?.status || 500;

  // Business error (has reason)
  if (reason) {
    const businessError: BusinessError = {
      code: code || "UNKNOWN",
      reason,
      status,
      message: message || getErrorMessage(error),
    };

    logger.apiError(status, error.config?.url || "", error, {
      message: err.message,
      reason,
      code,
    });

    return failure(businessError);
  }

  // Generic error
  const genericError: GenericError = {
    code: error.code || "UNKNOWN",
    reason: "GENERIC_ERROR",
    status,
    message: getErrorMessage(error),
  };

  logger.apiError(status, error.config?.url || "", error, {
    message: error.message,
  });

  return failure(genericError);
};

/**
 * Gets readable error message based on error type
 */
const getErrorMessage = (error: any): string => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return "Bad request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Access forbidden";
      case 404:
        return "Resource not found";
      case 409:
        return "Data conflict";
      case 422:
        return "Invalid validation data";
      case 429:
        return "Too many requests. Try again later";
      case 500:
        return "Internal server error";
      case 502:
        return "Gateway error";
      case 503:
        return "Service unavailable";
      default:
        return `Server error: ${status}`;
    }
  } else if (error.request) {
    return "Connection error. Check your internet connection";
  } else {
    return "Request configuration error";
  }
};

/**
 * Executes async function and handles errors with Result pattern
 */
export const executeRequest = async <T>(
  requestFn: () => Promise<any>,
): Promise<Result<ApiFailure, ApiSuccess<T>>> => {
  try {
    const response = await requestFn();
    const successData = handleSuccessResponse<T>(response);
    return success(successData);
  } catch (error) {
    if (error && typeof error === "object" && "isAxiosError" in error) {
      return handleErrorResponse(error);
    }

    // Unexpected error
    const unexpectedError: GenericError = {
      code: "UNEXPECTED_ERROR",
      reason: "UNEXPECTED_ERROR",
      status: 500,
      message: "Unexpected error occurred",
    };

    logger.error("Unexpected Error", { error }, error as Error);
    return failure(unexpectedError);
  }
};

/**
 * Helper to sequence multiple Results
 * Returns first failure or array of success data
 */
export const sequenceResults = <T>(
  results: Result<ApiFailure, ApiSuccess<T>>[],
): Result<ApiFailure, ApiSuccess<T[]>> => {
  const dataArray: T[] = [];

  for (const result of results) {
    if (result.isFailure()) {
      return failure(result.value);
    }
    dataArray.push(result.value.data);
  }

  return success({
    data: dataArray,
    status: 200,
  });
};

/**
 * Helper to transform data inside a Result
 */
export const mapResult = <T, U>(
  result: Result<ApiFailure, ApiSuccess<T>>,
  transform: (data: T) => U,
): Result<ApiFailure, ApiSuccess<U>> => {
  return result.map((successResult) => ({
    ...successResult,
    data: transform(successResult.data),
  }));
};

/**
 * Type guard to check if Result is Success
 */
export const isSuccess = <T>(result: Result<any, T>): result is Success<T> => {
  return result._tag === "Success";
};

/**
 * Type guard to check if Result is Failure
 */
export const isFailure = <E>(result: Result<E, any>): result is Failure<E> => {
  return result._tag === "Failure";
};

/**
 * Unwrap Result (throw if failure, return value if success)
 */
export const unwrap = <T>(result: Result<ApiFailure, T>): T => {
  if (result.isFailure()) {
    throw new Error(result.value.message);
  }
  return result.value;
};

/**
 * Get error from Result (returns null if success)
 */
export const getError = <E>(result: Result<E, any>): E | null => {
  return result.isFailure() ? result.value : null;
};

/**
 * Get data from Result (returns null if failure)
 */
export const getData = <T>(result: Result<any, T>): T | null => {
  return result.isSuccess() ? result.value : null;
};
