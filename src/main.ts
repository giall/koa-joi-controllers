import * as Koa from 'koa';
import * as JoiRouter from 'koa-joi-router';
import { KoaController } from './controller/koa.controller';
import { Controller } from './decorators/controller.decorator';
import { Get, Post, Put, Delete, Head, Options, Patch } from './decorators/method.decorators';
import { Validate, Json, Form, Multipart } from './decorators/validation.decorators';
import { Pre, Chain, Param, Meta } from './decorators/route.decorators';
import { ValidationError } from 'joi';

/**
 * Applies the routes defined in given KoaControllers to the Koa app.
 * 
 * @param app The Koa app the routes should be applied to.
 * @param controllers An array of KoaControllers with routes defined.
 * @param prefix Optional base prefix for all configured routes.
 */
export function configureRoutes(app: Koa, controllers: KoaController[], prefix?: string) {
  controllers.forEach(controller => {
    controller.base = prefix;
    app.use(controller.router().middleware());
  });
}

export { Controller, KoaController };

export { Get, Post, Put, Delete, Head, Options, Patch };

export { Validate, Json, Form, Multipart };

export { Pre, Chain, Param, Meta };

const Validator = {
  Joi: JoiRouter.Joi
};
export { Validator, ValidationError };
