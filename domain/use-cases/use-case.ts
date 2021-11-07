import { EventsProvider } from '../ports/in/events-provider';
import { Storage } from '../ports/out/storage';

export class UseCase {
  constructor(
    protected readonly _in: EventsProvider,
    protected readonly _out: Storage
  ) {}

  use() {
    throw new Error('Not implemented');
  }
}
