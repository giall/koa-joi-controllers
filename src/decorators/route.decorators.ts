import { Handler } from 'koa-joi-router';
import { Middleware } from 'koa';
import { Route, Param } from '../types/route';

/**
 * Stores metadata for a route.
 * 
 * @param metadata Metadata to be stored along with other route data.
 * 
 * Example:
 * @Get('/hello')
 * @Meta({
 *  info: 'Information about this route.',
 *  other: {
 *    data: 42
 *  }
 * })
 * async hello(ctx) {
 *  ctx.body = 'Hello World';
 * }
 */
export function Meta(metadata: Record<string, unknown>): Function {
  return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn: Route = descriptor.value;
    fn.meta = {
      ...fn.meta,
      ...metadata 
    };
  }
}

/**
 * Adds a handler to be called before parser and validators.
 * 
 * @param pre Handler method.
 * 
 * Example:
 * @Get('/:id')
 * @Pre(async (ctx, next) => {
 *  console.log(`Route was called with ID: ${ctx.params.id}`);
 *  await next();
 * })
 * async find(ctx) {
 *  ctx.body = User.findById(id);
 * }
 */
export function Pre(pre: Handler): Function {
  return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;
    fn.pre = pre;
  }
}

/**
 * Adds additional middleware to the route's middleware chain.
 * 
 * @param middleware Middleware to be called before route handler.
 * 
 * Example:
 * @Get('/:id')
 * @Chain(async (ctx, next) => {
 *  console.log(`Route was called with ID: ${ctx.params.id}`);
 *  await next();
 * })
 * async find(ctx) {
 *  ctx.body = User.findById(id);
 * }
 */
export function Chain(...middleware: Middleware[]): Function {
  return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn: Route = descriptor.value;
    fn.middleware = fn.middleware || [];
    fn.middleware = middleware.concat(fn.middleware);
  }
}

/**
 * Defines middleware for named route parameters. Useful for auto-loading and validation.
 * @param param The route parameter name the middleware should be applied to.
 * 
 * Example:
 * @Param('id')
 * async param(id: any, ctx, next) {
 *   ctx.user = User.findById(id); // adds found user to context
 *   await next();
 * }
 * 
 * @Get('/users/:id)
 * async find(ctx) {
 *   ctx.body = ctx.user; // found user is available in the context
 * }
 */
export function Param(param: string): Function {
  return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn: Param = descriptor.value;
    fn.type = 'param';
    fn.value = param;
  }
}