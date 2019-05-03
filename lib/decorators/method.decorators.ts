import { strict as assert } from 'assert';
import { Route, HttpMethod } from '../types/route';

function methodDecorator(method: HttpMethod, path: string) {
  return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn: Route = descriptor.value;
    if (fn.type === 'route') {
      assert.equal(path, fn.path, `Route path must be the same for 
      all HTTP methods. Expected '${path}' to equal '${fn.path}'`);
    } else {
      fn.type = 'route';
    }
    fn.path = path || '';
    fn.methods = fn.methods || [];
    fn.methods.push(method);
  }
}

/**
 * Maps the middleware function to the given path.
 * 
 * @param path Optional route path which defaults to empty string.
 * 
 * Example:
 *  @Get('/hello')
 *  async chain(ctx) {
 *    ctx.body = 'Hello World!';
 *  }
 */
export function Get(path?: string): Function {
  return methodDecorator('get', path);
}

export function Post(path?: string): Function {
  return methodDecorator('post', path);
}

export function Put(path?: string): Function {
  return methodDecorator('put', path);
}

export function Delete(path?: string): Function {
  return methodDecorator('delete', path);
}

export function Head(path?: string): Function {
  return methodDecorator('head', path);
}

export function Options(path?: string): Function {
  return methodDecorator('options', path);
}

export function Patch(path?: string): Function {
  return methodDecorator('patch', path);
}