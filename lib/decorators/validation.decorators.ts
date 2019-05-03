import { ValidationType, ValidationOptions } from "../types/validation";
import { Route } from "../types/route";

/**
 * Validates input based on given options. If validation fails, the middleware
 * stack stops being processed unless options.continueOnError is set to true.
 * 
 * @param options Validation options.
 * 
 * Example:
 * @Post('/user')
 * @Validate({
 *  body: {
 *    name: Joi.string().max(40),
 *    email: Joi.string().lowercase().email(),
 *    password: Joi.string().max(40),
*     _csrf: Joi.string().token()
 *  },
 *  type: 'json', // if request body is JSON, this is parsed and passed to ctx.request.body
 *  continueOnError: true // ctx.invalid is set to true if validation fails
 * })
 * async createUser(ctx) {
 *  if (!ctx.invalid) {
 *    User.create(ctx.request.body);
 *  } else {
 *    console.log('Validation failed!'); 
 *  }
 * }
 */
export function Validate(options: ValidationOptions): Function {
  return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn: Route = descriptor.value;
    fn.validate = {
      ...fn.validate,
      ...options 
    };
  }
}

function typeValidation(type: ValidationType) {
  return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn: Route = descriptor.value;
    fn.validate = {
      ...fn.validate,
      type
    };
  }
}

/**
 * Sets the ctx.request.body property if the incoming data is JSON.
 * If not, validation will fail.
 */
export function Json(): Function {
  return typeValidation('json');
}

/**
 * Sets the ctx.request.body property if the incoming data is form data
 * (x-www-form-urlencoded).
 * If not, validation will fail.
 */
export function Form(): Function {
  return typeValidation('form');
}

/**
 * Sets the ctx.request.parts property if the incoming data is multipart data.
 * If not, validation will fail.
 */
export function Multipart(): Function {
  return typeValidation('multipart');
}