import * as createRouter from 'koa-joi-router';
import { Router, Spec } from 'koa-joi-router';
import { Param, Route } from '../types/route';

/**
 * Base controller class. 
 * All controller classes should extend this class.
 */
export abstract class KoaController {
  prefix: string;
  routes: Route[];
  params: Param[];
  base: string;

  router(): Router {
    const router = createRouter();
    const base = (this.base) ? `/${this.base}`.replace('//', '/') : '';
    console.log(base);
    const prefix = `/${this.prefix}`.replace('//', '/');
    router.prefix(base + prefix);
    router.route(this.routes.map(route => this.fromRoute(route)));
    this.params.forEach(param => router.param(param.value, param.bind(this)));
    return router;
  }

  private fromRoute(route: Route): Spec {
    const handler = route.bind(this);
    return {
      method: route.methods,
      path: `/${route.path}`.replace('//', '/'),
      validate: route.validate,
      handler: route.middleware ? [route.middleware, handler] : handler,
      pre: route.pre,
      meta: route.meta
    };
  }
}