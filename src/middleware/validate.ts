import Joi from 'joi';
import pick from '../utils/pick';
import HttpStatusCode from 'http-status-codes';
import {wwsError} from "../utils/wwsError";
import {Request, Response, NextFunction} from 'express';

const validate = (schema:any) => (req:Request, res:Response, next:NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new wwsError(HttpStatusCode.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate