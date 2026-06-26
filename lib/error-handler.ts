/**
 * Parses an Axios error into a user-friendly string message.
 * Used by the API client interceptor to populate toast notifications.
 */
export function getUserFriendlyMessage(error: any): string {
  // Network / no response
  if (!error.response) {
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      return "Network error. Please check your connection and try again.";
    }
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    return error.message || "An unexpected error occurred. Please try again.";
  }

  const status = error.response?.status;
  const data = error.response?.data;

  // Extract field-level validation errors (400)
  if (status === 400 && data && typeof data === "object") {
    const messages: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        value.forEach((msg) => {
          if (typeof msg === "string") messages.push(msg);
        });
      } else if (typeof value === "string") {
        messages.push(value);
      }
    }

    if (messages.length > 0) {
      return messages.join(" ");
    }
    return "The submitted data is invalid. Please check your inputs.";
  }

  // Top-level message field from API
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }
  if (data?.detail && typeof data.detail === "string") {
    return data.detail;
  }
  if (data?.error && typeof data.error === "string") {
    return data.error;
  }

  // Status-based fallbacks
  switch (status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "A conflict occurred. This item may already exist.";
    case 422:
      return "The submitted data could not be processed. Please review your inputs.";
    case 429:
      return "Too many requests. Please slow down and try again.";
    case 500:
    case 502:
    case 503:
      return "A server error occurred. Please try again later.";
    default:
      return `An unexpected error occurred (${status}). Please try again.`;
  }
}
