import joi from "@hapi/joi";

const resendVerificationMailValidation = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().min(5).required().email(),
});

const changePasswordValidation = joi.object({
  oldPassword: joi.string().min(8).max(15).required(),
  newPassword: joi.string().min(8).max(15).required(),
});

const changeDetailsValidation = joi.object({
  name: joi.string().max(30),
  defaultProjectId: joi.number().integer(),
});

const activeInactiveValidation = joi.object({
  userId: joi.number().integer().required(),
  active: joi.boolean().required(),
});

const userIdValidation = joi.object({
  userId: joi.number().integer().required(),
});

export {
  changePasswordValidation,
  changeDetailsValidation,
  activeInactiveValidation,
  resendVerificationMailValidation,
  userIdValidation,
};
