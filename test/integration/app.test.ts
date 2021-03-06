import * as request from 'supertest';
import { KoalaController } from '../../example/controllers/koala.controller';
import { RootController } from '../../example/controllers/root.controller';
import * as Koa from 'koa';
import { KoalaRepository } from '../../example/repositories/koala.repository';
import { Server } from 'http';
import { configureRoutes } from '../../src/main';

let server: Server;
const repository = new KoalaRepository();

beforeAll(() => {
  const app = new Koa();

  configureRoutes(app, [
    new KoalaController(repository)
  ]);

  configureRoutes(app, [
    new RootController()
  ], '/api');

  server = app.listen(3000);
});

afterAll(() => {
  server.close();
});

describe('Test RootController routes', () => {

  test('should return Hello World', async () => {
    const response = await request(server).get('/api/hello');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('Hello World');
  });

  test('should return request body', async () => {
    const req = {some: 'json'};
    const response = await request(server).post('/api/echo').send(req);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(req);
  });

  test('should return request body', async () => {
    const req = {some: 'json'};
    const response = await request(server).put('/api/echo').send(req);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(req);
  });

  test('should return error status', async () => {
    const response = await request(server).put('/api/echo').send('string request');
    expect(response.status).toEqual(400);
  });

  test('should return 403', async () => {
    const response = await request(server).post('/api/echo/form').send({some: 'json'});
    expect(response.status).toEqual(403);
    expect(response.text).toEqual('Request content type must be application/x-www-form-urlencoded');
  });

  test('should return array of numbers', async () => {
    const response = await request(server).get('/api/chain');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([0,1,2,3,4]);
  });

});

describe('Test KoalaController routes', () => {

  test('should return all Koalas', async () => {
    const response = await request(server).get('/koalas/all');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(repository.koalas);
  });

  test('should return Koala with given ID', async () => {
    const response = await request(server).get('/koalas/1');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(repository.findById(1));
  });

  test('should update Koala if it exists', async () => {
    const response = await request(server).put('/koalas').send({
      id: 1,
      name: 'Alicia'
    });
    expect(response.body.name).toEqual('Alicia');
  });

  test('should return 404 if Koala does not exist', async () => {
    const response = await request(server).put('/koalas').send({
      id: 9,
      name: 'Daniel'
    });
    expect(response.status).toEqual(404);
  });

  test('should delete Koala with given ID', async () => {
    let response = await request(server).delete('/koalas/1');
    expect(response.status).toEqual(200);

    response = await request(server).get('/koalas/1');
    expect(response.status).toEqual(404);
  });

  test('should return 404 if no Koala with given ID exists', async () => {
    const response = await request(server).delete('/koalas/9');
    expect(response.status).toEqual(404);
  });

});

describe('Test Joi validation', () => {

  test('should add new Koala', async () => {
    const response = await request(server).post('/koalas').send({
      name: 'Chase Jr.',
      email: 'chase.jr@koala.com',
      birthYear: 2019,
      variation: 'New South Wales'
    });
    expect(response.status).toEqual(200);
  });

  test('should fail if invalid variation', async () => {
    const response = await request(server).post('/koalas').send({
      name: 'Chase Jr.',
      email: 'chase.jr@koala.com',
      birthYear: 2019,
      variation: 'South Australia'
    });
    expect(response.status).toEqual(400);
  });

  test('should fail if no name in request body', async () => {
    const response = await request(server).post('/koalas').send({
      email: 'chase.jr@koala.com',
      birthYear: 2019
    });
    expect(response.status).toEqual(400);
  });

  test('should fail if name contains invalid characters', async () => {
    const response = await request(server).post('/koalas').send({
      name: '!£$%^&*()',
      email: 'chase.jr@koala.com',
      birthYear: 2019
    });
    expect(response.status).toEqual(400);
  });

  test('should fail if unexpected fields in request body', async () => {
    const response = await request(server).post('/koalas').send({
      id: '9',
      name: 'Chase Jr.',
      email: 'chase.jr@koala.com',
      birthYear: 2019
    });
    expect(response.status).toEqual(400);
  });

  test('should fail if birth year not in required range', async () => {
    const response = await request(server).post('/koalas').send({
      name: 'Chase Jr.',
      email: 'chase.jr@koala.com',
      birthYear: 2029
    });
    expect(response.status).toEqual(400);
  });
});