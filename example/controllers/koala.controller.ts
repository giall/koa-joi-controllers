import { KoalaRepository } from '../repositories/koala.repository';
import { Controller, KoaController, Get, Param, Post, Json, Put, Delete, Meta, Validate, Validator } from '../../src/main';
import { Koala } from '../models/koala';
import { Context, Next } from 'koa';

@Controller('/koalas')
export class KoalaController extends KoaController {
  repository: KoalaRepository;

  constructor(repository: KoalaRepository) {
    super();
    this.repository = repository;
  }

  @Param('id')
  async param(id: number, ctx: Context, next: Next): Promise<void> {
    ctx.koala = this.repository.findById(id);
    await next();
  }

  @Get('/all')
  @Meta({ description: 'Returns all Koalas.' })
  async readAll(ctx: Context): Promise<void> {
    ctx.body = this.repository.all();
  }

  @Get('/:id')
  async read(ctx: Context): Promise<void> {
    ctx.body = ctx.koala;
    ctx.status = ctx.koala ? 200 : 404;
  }

  @Post()
  @Validate({
    type: 'json',
    body: {
      name: Validator.Joi.string().max(40).regex(new RegExp('^[a-z A-Z.]+$')).required(),
      email: Validator.Joi.string().email().max(100),
      birthYear: Validator.Joi.number().min(1999).max(2019),
      variation: Validator.Joi.string().valid('Queensland', 'Victorian', 'New South Wales')
    }
  })
  async create(ctx: Context): Promise<void> {
    const request = ctx.request.body;
    const koala = new Koala(request.name, request.email, request.birthYear, request.variation);
    this.repository.create(koala);
    ctx.body = 'Success';
  }

  @Put()
  @Json()
  @Validate({
    body: {
      id: Validator.Joi.number().required(),
      name: Validator.Joi.string().max(40).regex(new RegExp('^[a-z A-Z.]+$')),
      email: Validator.Joi.string().email().max(100)
    }
  })
  async update(ctx: Context): Promise<void> {
    const koala = this.repository.update(ctx.request.body);
    ctx.status = koala ? 200 : 404;
    ctx.body = koala || 'Not Found';
  }

  @Delete('/:id')
  async delete(ctx: Context): Promise<void> {
    const success = (ctx.koala) ? this.repository.delete(ctx.koala) : false;
    ctx.status = success ? 200 : 404;
  }

}