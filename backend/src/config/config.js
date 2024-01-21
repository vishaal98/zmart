const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

const DEFAULT_WALLET_MONEY = 5000;
const DEFAULT_PAYMENT_OPTION = "PAYMENT_OPTION_DEFAULT";
const DEFAULT_ADDRESSS = "ADDRESS_NOT_SET";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGO_DB: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    CLIENT_URL: Joi.string().required().description("base URL"),
    CLIENT_ID: Joi.string().required().description("Google client ID"),
    CLIENT_SECRETE: Joi.string()
      .required()
      .description("Google client secrete"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  // Set mongoose configuration
  mongoose: {
    url: envVars.MONGO_DB + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  default_wallet_money: DEFAULT_WALLET_MONEY,
  default_payment_option: DEFAULT_PAYMENT_OPTION,
  default_address: DEFAULT_ADDRESSS,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },

  google: {
    client_url: envVars.CLIENT_URL,
    client_id: envVars.CLIENT_ID,
    client_secrete: envVars.CLIENT_SECRETE,
  },
};
