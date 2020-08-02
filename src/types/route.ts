import { Handler } from 'koa-joi-router';
import { Middleware } from 'koa';
import { ValidationOptions } from './validation';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'head' | 'options' | 'patch';

export interface Route extends Function {
  type: 'route';
  methods: HttpMethod[];
  path: string;
  validate?: ValidationOptions;
  pre?: Handler;
  meta?: Record<string, unknown>;
  middleware? : Middleware[];
}

export interface Param extends Function {
  type: 'param';
  value: string;
}