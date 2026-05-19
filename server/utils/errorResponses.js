const getValidationDetails = (error) => {
  const firstField = Object.keys(error.errors || {})[0];
  const fieldError = firstField ? error.errors[firstField] : null;

  return {
    field: firstField || "unknown",
    message: fieldError?.message || "Invalid value",
  };
};

const sendValidationError = (res, error) => {
  const details = getValidationDetails(error);

  return res.status(400).json({
    message: `${details.field}: ${details.message}`,
    field: details.field,
  });
};

const sendDuplicateKeyError = (res, field = "value") => {
  return res.status(409).json({
    message: `An account with that ${field} already exists.`,
    field,
  });
};

const sendServerError = (res) => {
  return res.status(500).json({
    message: "Something went wrong on our side. Please try again shortly.",
  });
};

const handleControllerError = (res, error) => {
  if (error.name === "ValidationError") {
    return sendValidationError(res, error);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "value";
    return sendDuplicateKeyError(res, field);
  }

  if (error.name === "CastError") {
    return res.status(404).json({
      message: "We could not find that resource. Please check the link and try again.",
    });
  }

  return sendServerError(res);
};

module.exports = {
  handleControllerError,
  sendValidationError,
  sendServerError,
};
