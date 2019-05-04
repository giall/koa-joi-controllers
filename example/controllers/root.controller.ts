import { Controller, KoaController, Get, Pre, Chain, Post, Put, Json, Form, Validate } from '../../src/main';

@Controller()
export class RootController extends KoaController {

  @Get('/hello')
  async hello(ctx) {
    ctx.body = 'Hello World';
  }

  @Post('/echo') @Put('/echo')
  @Json()
  async echo(ctx) {
    ctx.body = ctx.request.body;
  }

  @Post('/echo/form')
  @Validate({
    type: 'form',
    continueOnError: true // default is false
  })
  async echoForm(ctx) {
    if (ctx.invalid) {
      ctx.status = 403;
      ctx.body = 'Request content type must be application/x-www-form-urlencoded';
    }
  }

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
    ctx.body.push(4);
  }

}