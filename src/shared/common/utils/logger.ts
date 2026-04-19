/**
 * logger.ts
 * --------------------------------------------------
 * Structured logging utility for the application.
 * Supports different levels and context for logging.
 * Integrated with Result pattern and API interceptors.
 *
 * Levels: debug, info, warn, error
 * Specialized functions for API logging, user actions, and component lifecycle.
 *
 * Usage:
 *
 * import { info, error, apiRequest } from '@/shared/common/utils/logger'
 *
 * info('Informational message', { context: 'optional' })
 * error('Error message', { context: 'optional' }, new Error('Details'))
 * apiRequest('GET', '/api/anime', { params: { id: 1 } })
 *
 * Or use logger object for compatibility:
 * import { logger } from '@/shared/common/utils/logger'
 * logger.info('Message')
 */

/**
 * Log levels available
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Structured log entry
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

/**
 * API log specific structure
 */
export interface ApiLogEntry {
  method?: string;
  url?: string;
  status?: number;
  duration?: number;
  requestData?: any;
  responseData?: any;
  error?: any;
}

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Enable detailed logging in development
const enableDetailedLogs = isDevelopment;

// Enable performance tracking
const enablePerformanceTracking = isDevelopment;

/**
 * Formats log message with timestamp, level, and context
 */
const formatMessage = (
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
): string => {
  const timestamp = new Date().toISOString();
  const contextStr =
    context && Object.keys(context).length > 0
      ? ` | ${JSON.stringify(context, null, enableDetailedLogs ? 2 : 0)}`
      : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
};

/**
 * Determines if log should be shown based on environment and level
 */
const shouldLog = (level: LogLevel): boolean => {
  // Always show errors and warnings
  if (level === LogLevel.ERROR || level === LogLevel.WARN) {
    return true;
  }

  // Show info in all environments
  if (level === LogLevel.INFO) {
    return true;
  }

  // Debug only in development
  if (level === LogLevel.DEBUG) {
    return isDevelopment;
  }

  return true;
};

/**
 * Prints message to console based on level
 */
const logToConsole = (
  level: LogLevel,
  formattedMessage: string,
  error?: Error,
  additionalData?: any,
): void => {
  switch (level) {
    case LogLevel.DEBUG:
      if (additionalData && enableDetailedLogs) {
        console.debug(formattedMessage, additionalData);
      } else {
        console.debug(formattedMessage);
      }
      break;
    case LogLevel.INFO:
      if (additionalData && enableDetailedLogs) {
        console.info(formattedMessage, additionalData);
      } else {
        console.info(formattedMessage);
      }
      break;
    case LogLevel.WARN:
      if (additionalData) {
        console.warn(formattedMessage, additionalData);
      } else {
        console.warn(formattedMessage);
      }
      break;
    case LogLevel.ERROR:
      if (error) {
        console.error(formattedMessage, error, additionalData || "");
      } else if (additionalData) {
        console.error(formattedMessage, additionalData);
      } else {
        console.error(formattedMessage);
      }
      break;
  }
};

/**
 * Main logging function
 */
const log = (
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
  error?: Error,
  additionalData?: any,
): void => {
  if (!shouldLog(level)) {
    return;
  }
  const formattedMessage = formatMessage(level, message, context);
  logToConsole(level, formattedMessage, error, additionalData);
};

/**
 * Debug level log (development only)
 */
export const debug = (
  message: string,
  context?: Record<string, any>,
  additionalData?: any,
): void => {
  log(LogLevel.DEBUG, message, context, undefined, additionalData);
};

/**
 * Info level log (all environments)
 */
export const info = (
  message: string,
  context?: Record<string, any>,
  additionalData?: any,
): void => {
  log(LogLevel.INFO, message, context, undefined, additionalData);
};

/**
 * Warning level log (all environments)
 */
export const warn = (
  message: string,
  context?: Record<string, any>,
  additionalData?: any,
): void => {
  log(LogLevel.WARN, message, context, undefined, additionalData);
};

/**
 * Error level log (all environments)
 */
export const error = (
  message: string,
  context?: Record<string, any>,
  error?: Error,
  additionalData?: any,
): void => {
  log(LogLevel.ERROR, message, context, error, additionalData);
};

/**
 * Logs API request (used in interceptors.request.ts)
 */
export const apiRequest = (
  method: string,
  url: string,
  data?: any,
  config?: Record<string, any>,
): void => {
  if (!enableDetailedLogs) return;

  const context: ApiLogEntry = {
    method: method.toUpperCase(),
    url,
    requestData: data,
    ...config,
  };

  debug(`📤 API Request: ${method.toUpperCase()} ${url}`, context);
};

/**
 * Logs successful API response (used in interceptors.response.ts)
 */
export const apiResponse = (
  status: number,
  url: string,
  data?: any,
  duration?: number,
): void => {
  if (!enableDetailedLogs) return;

  const context: ApiLogEntry = {
    status,
    url,
    duration,
    responseData: data,
  };

  const emoji = status >= 200 && status < 300 ? "✅" : "⚠️";
  info(`${emoji} API Response: ${status} ${url}`, {
    duration: duration ? `${duration}ms` : undefined,
  });

  if (enableDetailedLogs && data) {
    debug(`Response data for ${url}`, data);
  }
};

/**
 * Logs API error (used in interceptors.response.ts and result/utils.ts)
 */
export const apiError = (
  status: number,
  url: string,
  error?: any,
  context?: Record<string, any>,
): void => {
  const errorContext: ApiLogEntry & Record<string, any> = {
    status,
    url,
    error: error?.message || error,
    ...context,
  };

  // Add specific error details if available
  if (error?.response?.data) {
    errorContext.responseData = error.response.data;
  }

  if (error?.config) {
    errorContext.requestConfig = {
      method: error.config.method,
      data: error.config.data,
      params: error.config.params,
    };
  }

  error(
    `❌ API Error: ${status} ${url}`,
    errorContext,
    error instanceof Error ? error : undefined,
  );
};

/**
 * Logs business error from Result pattern (when API returns business error)
 */
export const businessError = (
  code: string,
  reason: string,
  status: number,
  message: string,
  context?: Record<string, any>,
): void => {
  warn(`🏢 Business Error: ${code} - ${reason}`, {
    code,
    reason,
    status,
    message,
    ...context,
  });
};

/**
 * Logs generic error from Result pattern
 */
export const genericError = (
  code: string,
  status: number,
  message: string,
  context?: Record<string, any>,
): void => {
  error(`⚠️ Generic Error: ${code}`, {
    code,
    status,
    message,
    ...context,
  });
};

/**
 * Logs success result from Result pattern
 */
export const resultSuccess = <T>(
  operation: string,
  data: T,
  context?: Record<string, any>,
): void => {
  debug(`✓ Result Success: ${operation}`, {
    data: enableDetailedLogs ? data : undefined,
    ...context,
  });
};

/**
 * Logs failure result from Result pattern
 */
export const resultFailure = (
  operation: string,
  error: any,
  context?: Record<string, any>,
): void => {
  warn(`✗ Result Failure: ${operation}`, {
    error: error?.message || error,
    code: error?.code,
    reason: error?.reason,
    status: error?.status,
    ...context,
  });
};

/**
 * Logs user action for analytics
 */
export const userAction = (
  action: string,
  context?: Record<string, any>,
): void => {
  info(`👤 User Action: ${action}`, context);
};

/**
 * Logs component lifecycle (development only)
 */
export const componentLifecycle = (
  component: string,
  lifecycle: string,
  context?: Record<string, any>,
): void => {
  if (!isDevelopment) return;
  debug(`⚡ Component ${component}: ${lifecycle}`, context);
};

/**
 * Logs performance metrics
 */
export const performance = (
  label: string,
  duration: number,
  context?: Record<string, any>,
): void => {
  if (!enablePerformanceTracking) return;

  const formattedDuration = duration.toFixed(2);
  if (duration > 100) {
    warn(
      `🐌 Performance Warning: ${label} took ${formattedDuration}ms`,
      context,
    );
  } else {
    debug(`⚡ Performance: ${label} took ${formattedDuration}ms`, context);
  }
};

/**
 * Logs store action
 */
export const storeAction = (
  store: string,
  action: string,
  context?: Record<string, any>,
): void => {
  debug(`📦 Store ${store}: ${action}`, context);
};

/**
 * Logs route change
 */
export const routeChange = (
  from: string,
  to: string,
  context?: Record<string, any>,
): void => {
  info(`🔄 Route Change: ${from} -> ${to}`, context);
};

/**
 * Group logs for better organization (development only)
 */
export const group = (label: string, fn: () => void): void => {
  if (!isDevelopment) {
    fn();
    return;
  }

  console.group(label);
  fn();
  console.groupEnd();
};

/**
 * Collapsed group for development
 */
export const groupCollapsed = (label: string, fn: () => void): void => {
  if (!isDevelopment) {
    fn();
    return;
  }

  console.groupCollapsed(label);
  fn();
  console.groupEnd();
};

/**
 * Clear all logs (useful for testing)
 */
export const clear = (): void => {
  if (isDevelopment) {
    console.clear();
  }
};

/**
 * Logger object for compatibility
 */
export const logger = {
  // Basic logging
  debug,
  info,
  warn,
  error,

  // API logging
  apiRequest,
  apiResponse,
  apiError,

  // Result pattern logging
  businessError,
  genericError,
  resultSuccess,
  resultFailure,

  // User and component logging
  userAction,
  componentLifecycle,

  // Performance logging
  performance,

  // Store and route logging
  storeAction,
  routeChange,

  // Utility functions
  group,
  groupCollapsed,
  clear,

  // Levels enum
  LogLevel,
};

// Default export for convenience
export default logger;
