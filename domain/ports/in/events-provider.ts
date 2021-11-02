import { SaveTransactionPayload } from './events';

export interface EventsProvider {
  on(
    event: 'save-transaction',
    cb: (payload: SaveTransactionPayload) => void
  ): void;
}
