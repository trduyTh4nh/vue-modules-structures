/**
 * Result Pattern - Core exports
 * Functional pattern for API error handling
 */

// Types
export type {
  Result,
  Success,
  Failure,
  ApiSuccess,
  ApiFailure,
  BusinessError,
  GenericError,
  ApiResult,
  ApiError,
} from "./types";

// Result constructors
export { success, failure } from "./utils";

// Utilities
export {
  handleSuccessResponse,
  handleErrorResponse,
  executeRequest,
  sequenceResults,
  mapResult,
  isSuccess,
  isFailure,
  unwrap,
  getError,
  getData,
} from "./utils";
