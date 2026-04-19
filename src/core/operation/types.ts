/**
 * Types for API Result Pattern
 * Functional error handling for API calls
 */

export interface ApiSuccess<T> {
  data: T;
  status: number;
}

/**
 * Business error with reason mapping
 * Based on actual API error structure
 */

export interface BusinessError {
  code: string;
  reason: string;
  status: number;
  message: string;
}

/**
 * Generic error for unmapped cases
 */
export interface GenericError {
  code: string;
  reason: string;
  status: number;
  message: string;
}

export type ApiFailure = BusinessError | GenericError;

// Main result type
export type ApiResult<T> = Result<ApiFailure, ApiSuccess<T>>;

/**
 * API Error with standard backend structure
 */
export interface ApiError {
  response?: {
    data?: {
      code?: string;
      reason?: string;
      source?: string;
      hideModalError?: boolean;
      message?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
  config?: {
    url?: string;
  };
}

/**
 * Result type (Success or Failure)
 */
export interface Success<T> {
  _tag: "Success";
  value: T;
  isSuccess(): this is Success<T>;
  isFailure(): this is Failure<never>;
  map<U>(fn: (value: T) => U): Result<never, U>;
  flatMap<U>(fn: (value: T) => Result<never, U>): Result<never, U>;
  fold<R>(onFailure: (error: never) => R, onSuccess: (value: T) => R): R;
}

export interface Failure<E> {
  _tag: "Failure";
  value: E;
  isSuccess(): this is Success<never>;
  isFailure(): this is Failure<E>;
  map<U>(fn: (value: never) => U): Result<E, never>;
  flatMap<U>(fn: (value: never) => Result<E, never>): Result<E, never>;
  fold<R>(onFailure: (error: E) => R, onSuccess: (value: never) => R): R;
}

export type Result<E, T> = Success<T> | Failure<E>;
