export type Variation = 'Queensland' | 'New South Wales' | 'Victorian';

export class Koala {
  static count = 0;

  id: number;
  name: string;
  email: string;
  variation: Variation;
  birthYear: number;

  constructor(name: string, email: string, birthYear: number, variation?: Variation) {
    this.id = ++Koala.count;
    this.name = name;
    this.email = email;
    this.birthYear = birthYear;
    this.variation = variation;
  }
}