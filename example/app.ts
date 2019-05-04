import { KoalaController } from './controllers/koala.controller';
import { KoalaRepository } from './repositories/koala.repository';
import { RootController } from './controllers/root.controller';

import * as Koa from 'koa';
import { configureRoutes } from '../src/main';

const app = new Koa();

const koalaRepository = new KoalaRepository();
configureRoutes(app, [
  new KoalaController(koalaRepository),
  new RootController()
]);

app.listen(3000);
console.log("Server running on port 3000...");