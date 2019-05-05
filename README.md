# koa-joi-controllers

Controller decorators for [Koa](https://koajs.com/) using [koa-joi-router](https://github.com/koajs/joi-router).

[![Build Status](https://travis-ci.com/christos-giallouros/koa-joi-controllers.svg?branch=master)](https://travis-ci.com/christos-giallouros/koa-joi-controllers)
[![codecov](https://codecov.io/gh/christos-giallouros/koa-joi-controllers/branch/master/graph/badge.svg)](https://codecov.io/gh/christos-giallouros/koa-joi-controllers)

## Installation
```sh
npm install koa-joi-controllers
```
If you're using TypeScript, you should also install the type definitions for koa-joi-router:
```sh
npm install @types/koa-joi-router --save-dev
```

## Usage
Create a controller class:

```js
import { Get, Controller, KoaController } from 'koa-joi-controllers';

@Controller('/api')
export class MyController extends KoaController {
  @Get('/hello')
  async hello(ctx) {
    ctx.body = 'Hello World';
  }
}
```

Create a Koa app and configure the routes before running the server:
```js
import * as Koa from 'koa';
import { configureRoutes } from 'koa-joi-controllers';

const app = new Koa();
configureRoutes(app, [
  new MyController();
]);
app.listen(3000);

// GET /api/hello -> 'Hello World'
```