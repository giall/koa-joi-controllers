import { Route, Param } from "../types/route";


function getRoutes(prototype: Function): Route[] {
  return Object.getOwnPropertyNames(prototype)
    .map(name => prototype[name])
    .filter(fn => fn.type === 'route');
}

function getParams(prototype: Function): Param[] {
  return Object.getOwnPropertyNames(prototype)
    .map(name => prototype[name])
    .filter(fn => fn.type === 'param');
}

/**
 * Decorator to be used on KoaController classes.
 * 
 * @param prefix The prefix of all the routes of the controller. 
 */
export function Controller(prefix?: string): Function {
  return function<T extends {new(...args: any[]): {}}>(constructor: T): Function {
    return class extends constructor {
      prefix = prefix || '';
      routes = getRoutes(constructor.prototype);
      params = getParams(constructor.prototype);
    }
  }
}