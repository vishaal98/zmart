const Joi = require("joi");
const { objectId } = require("./custom_validation");

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    name: Joi.string(),
  }),
};

const setAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.number().required().max(999999),
  }),
};

module.exports = {
  getUser,
  updateUser,
  setAddress,
};
