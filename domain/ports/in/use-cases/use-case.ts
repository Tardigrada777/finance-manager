import { EventsProvider } from '../events-provider';
import { Storage } from '../../out/storage';

export class UseCase {
  constructor(
    protected readonly _in: EventsProvider,
    protected readonly _out: Storage
  ) {}

  use() {
    throw new Error('Not implemented');
  }
}
