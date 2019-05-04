import { Koala } from '../models/koala';

export class KoalaRepository {

  koalas = [
    new Koala('Alice', 'alice@koala.com', 2013, 'Queensland'),
    new Koala('Bob', 'bob@koala.com', 2017, 'Victorian'),
    new Koala('Chase', 'chase@koala.com', 2009, 'New South Wales')
  ];

  findById(id: number): Koala {
    return this.koalas.find(k => k.id == id);
  }

  create(koala: Koala): void {
    this.koalas.push(koala);
  }

  update(koala: Koala): boolean {
    const index = this.getIndex(koala);
    const found = index >= 0;
    if (found) this.koalas[index] = koala;
    return found;
  }

  delete(koala: Koala): boolean {
    const index = this.getIndex(koala);
    const found = index >= 0;
    if (found) this.koalas.splice(index, 1);
    return found;
  }

  all(): Koala[] {
    return this.koalas;
  }

  private getIndex(koala: Koala): number {
    return this.koalas.findIndex(k => k.id == koala.id);
  }

}