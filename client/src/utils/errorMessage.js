export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  const data = error?.response?.data;

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (!error?.response) {
    return "Unable to reach EventHive. Please check your connection and try again.";
  }

  return fallback;
};
