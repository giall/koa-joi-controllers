# koa-joi-controllers

Controller decorators for [Koa](https://koajs.com/) using [koa-joi-router](https://github.com/koajs/joi-router).

[![npm version](https://img.shields.io/badge/npm-v1.2.3-blue.svg)](https://www.npmjs.com/package/koa-joi-controllers)
[![Build Status](https://travis-ci.com/giall/koa-joi-controllers.svg?branch=master)](https://travis-ci.com/giall/koa-joi-controllers)
[![codecov](https://codecov.io/gh/giall/koa-joi-controllers/branch/master/graph/badge.svg)](https://codecov.io/gh/giall/koa-joi-controllers)

## Installation
```sh
npm install koa-joi-controllers
```
If you're using TypeScript, you should also install the type definitions for koa-joi-router:
```sh
npm install --save-dev @types/koa-joi-router
```

## Usage
Create a controller class:

```js
import { Get, Controller, KoaController } from 'koa-joi-controllers';

@Controller('/v1')
export class MyController extends KoaController {
  @Get('/hello')
  async hello(ctx) {
    ctx.body = 'Hello World';
  }
}
```

Create a Koa app and configure the routes before running the server:
```js
import Koa from 'koa'; // import * as Koa from 'koa'; for TypeScript projects
import { configureRoutes } from 'koa-joi-controllers';

const app = new Koa();
configureRoutes(app, [
  new MyController();
], '/api'); // optional prefix for all routes
app.listen(3000);

// GET /api/v1/hello -> 'Hello World'
```

# Overview

- [Defining controllers](#controllers)
- [HTTP method decorators](#method-decorators)
- [Request parameters](#request-params)
- [Request body](#request-body)
- [Joi validation](#joi-validation)
- [Named route parameter middleware](#param)
- [Multiple middleware support](#middleware)
- [Adding metadata](#metadata)
- [Adding routes via the router](#router)
- [Using with JavaScript](#javascript)

<a name="controllers"></a>
## Defining controllers

You can create as many controllers as you want. Every controller needs to extend the `KoaController` class and have the `@Controller` decorator. The controller decorators accepts a string parameter, which is the prefix of all the routes in the controller class.

```js
@Controller('/koalas')
export class KoalaController extends KoaController {
  @Get()
  async all(ctx) {
    ctx.body = Koala.all();
  }

  @Get('/:id')
  async findById(ctx) {
    ctx.body = Koala.findById(ctx.params.id);
  }
}
```

<a name="method-decorators"></a>
## HTTP method decorators

You can define a route with a `@Method` decorator, where Method is an Http method. (Get, Post, Put, Delete, Head or Options).

The method decorator accepts a string parameter which is the path of the route, which defaults to an empty string if omitted. The route path supports [RegExp](https://github.com/pillarjs/path-to-regexp) syntax.

You can add multiple method decorators as long as the path is the same, otherwise an exception is thrown when configuring the routes.

```js
@Post() @Put() // allowed
async myFunction(ctx) {
  ctx.body = 'Success';
}

@Get('/options') @Options('/options') // allowed
async myFunction(ctx) {
  ctx.body = 'Success';
}

@Delete() @Head('/head') // throws exception
async myFunction(ctx) {
  ctx.body = 'Failure';
}
```

<a name="request-params"></a>
## Request parameters

Request parameters in the route path can be defined by prefixing them with the ':' symbol, and can be accessed in the params field of the context.

```js
@Get('/users/:userId/koalas/:koalaId')
async findById(ctx) {
  const userId = ctx.params.userId;
  const koalaId = ctx.params.koalaId;
  // do something...
}
```

<a name="request-body"></a>
## Request body

A request's body can be found in `ctx.request.body`, but the request has to be parsed first. In order for the request body to be parsed, you need to specify what type the incoming data is in by using the `@Json`, `@Form` or `@Multipart` decorators.

```js
@Post('/koalas')
@Json()
async createKoala(ctx) {
  const body = ctx.request.body; // incoming JSON data is in ctx.request.body
  ctx.body = Koala.create(body);
}
```

Alternatively, you can use the `@Validate` decorator.

```js
@Post('/koalas')
@Validate({
  type: 'json', // can also be 'form' or 'multipart'
  failure: 403 // status code if validation fails
})
async createKoala(ctx) {
  const body = ctx.request.body; // incoming JSON data is in ctx.request.body
  ctx.body = Koala.create(body);
}
```

If the incoming data does not match the expected type, validation will fail and the response status will be set to 400, or the `failure` value set in the `@Validate` decorator.

<a name="joi-validation"></a>
## Joi validation

The `@Validate` decorator can enforce [Joi](https://github.com/hapijs/joi) validation on request body parameters. If validation fails, response status is set to 400 and the route handler is never called. If you want to handle the error, you can set the `continueOnError` (default: `false`) field to `true`.

```js
import { Post, Validate, Validator } from 'koa-joi-controllers';

@Post('/koalas')
@Validate({
  type: 'json',
  body: {
    name: Validator.Joi.string().max(40),
    email: Validator.Joi.string().lowercase().email(),
    password: Validator.Joi.string().max(40),
    _csrf: Validator.Joi.string().token()
  },
  continueOnError: true // ctx.invalid is set to true if validation fails
})
async createKoala(ctx) {
  if (!ctx.invalid) {
    Koala.create(ctx.request.body);
  } else {
    console.log('Validation failed!');
  }
}
```

<a name="param"></a>
## Named route parameter middleware

You can define middleware for named route parameters. This is useful for auto-loading or validation.

```js
@Param('id')
async param(id, ctx, next) {
  ctx.koala = Koala.findById(id);
  await next();
}

@Get('/:id')
async findById(ctx) {
  ctx.body = ctx.koala; // ctx.koala was set by the @Param('id') middleware
  ctx.status = ctx.koala ? 200 : 404;
}
```

<a name="middleware"></a>
## Multiple middleware support

You can use the `@Pre` and `@Chain` decorators to add additional middleware to a specific route. The `Pre` middleware is called first, followed by the `Chain` middleware (can be multiple).

```js
@Get('/chain')
@Pre(async (ctx, next) => {
  ctx.body = [0];
  await next();
})
@Chain(async (ctx, next) => {
  ctx.body.push(1);
  await next();
})
@Chain(async (ctx, next) => {
  ctx.body.push(2);
  await next();
}, async (ctx, next) => {
  ctx.body.push(3);
  await next();
})
async chain(ctx) {
  ctx.body.push(4);}

  // GET /chain -> [0, 1, 2, 3, 4]
  ```

<a name="metadata"></a>
## Adding metadata

You can store metadata about a route. This isn't used but is stored along with all other route data.

```js
@Get('/hello')
@Meta({
  info: 'Hello World example',
  other: {
    data: 42
  }
})
async hello(ctx) {
  ctx.body = 'Hello World';
}
```

<a name="router"></a>
## Adding routes via the router

If you're looking for functionality that is not available with the current decorators, but is possible with [koa-joi-router](https://github.com/koajs/joi-router), you can achieve this by extending the `router()` method in your controller class.

```js
@Controller()
export class MyController extends KoaController {

  router() {
    let router = super.router(); // returns router with all routes defined with decorators

    // add all your routes here
    router.route({
      path: '/hello',
      method: 'get',
      handler: async function (ctx) {
        ctx.body = 'Hello World';
      }
    });

    return router; // router must be returned
  }

}
```

<a name="javascript"></a>
## Using with JavaScript

In order to use ES6 imports and decorators in a JavaScript project, some additional configurations need to be made. Install the necessary `babel` dependencies:

```sh
npm install --save-dev @babel/core @babel/preset-env @babel/node @babel/plugin-proposal-decorators
```

Create a `.babelrc` file in your project root:
```json
{
  "presets": [["@babel/preset-env", {"targets": {"node": true}}]],
  "plugins": [["@babel/plugin-proposal-decorators", {"legacy": true}]]
}
```
Run with:
```sh
npx babel-node app.js
```

# License

[MIT](https://github.com/giall/koa-joi-controllers/blob/master/LICENSE.md)
