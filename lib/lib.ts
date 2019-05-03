import * as Koa from 'koa';
import { KoaController } from './controller/koa.controller';
import { Controller } from './decorators/controller.decorator';
import { Get, Post, Put, Delete, Head, Options, Patch } from './decorators/method.decorators';
import { Validate, Json, Form, Multipart } from './decorators/validation.decorators';
import { Pre, Middleware, Param, Meta } from './decorators/route.decorators';

/**
 * Applies the routes defined in given KoaControllers to the Koa app.
 * 
 * @param app The Koa app the routes should be applied to.
 * @param controllers An array of KoaControllers with routes defined.
 */
export function configureRoutes(app: Koa, controllers: KoaController[]) {
  controllers.forEach(controller => app.use(controller.router().middleware()));
}

export { Controller, KoaController };

export { Get, Post, Put, Delete, Head, Options, Patch };

export { Validate, Json, Form, Multipart };

export { Pre, Middleware, Param, Meta };
