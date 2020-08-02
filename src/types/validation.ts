import * as Joi from 'joi';
import * as CoBody from 'co-body';
import { OutputValidation } from 'koa-joi-router';

export type ValidationType = 'form' | 'json' | 'multipart';

export interface ValidationOptions {
  header?: Joi.SchemaLike;
  query?: Joi.SchemaLike;
  params?: Joi.SchemaLike;
  body?: Joi.SchemaLike;
  maxBody?: number;
  failure?: number;
  type?: ValidationType;
  formOptions?: CoBody.Options;
  jsonOptions?: CoBody.Options;
  multipartOptions?: CoBody.Options;
  output?: { [status: string]: OutputValidation };
  continueOnError?: boolean;
}