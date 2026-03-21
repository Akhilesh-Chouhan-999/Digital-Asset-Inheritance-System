import { configDotenv } from "dotenv";
configDotenv();


export const PORT                    = process.env.PORT || 5000;
export const MONGO_URI               = process.env.MONGO_URI;
export const JWT_SECRET_KEY          = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRES_IN          = process.env.JWT_EXPIRES_IN;
export const ACCESS_TOKEN_SECRET     = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES    = process.env.ACCESS_TOKEN_EXPIRES;
export const REFRESH_TOKEN_SECRET    = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRES   = process.env.REFRESH_TOKEN_EXPIRES;
export const BASE_URL                = process.env.BASE_URL;
export const EMAIL                   = process.env.EMAIL;
export const EMAIL_PASSWORD          = process.env.EMAIL_PASSWORD;
export const REDIS_HOST              = process.env.REDIS_HOST;
export const REDIS_PORT              = process.env.REDIS_PORT;
export const NODE_ENV                = process.env.NODE_ENV;
export const EMAIL_USER              = process.env.EMAIL_USER;
export const FRONTEND_URL            = process.env.FRONTEND_URL;