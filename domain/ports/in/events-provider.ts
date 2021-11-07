import { SaveOutcomePayload } from './events';

export interface EventsProvider {
  on(event: 'save-outcome', cb: (payload: SaveOutcomePayload) => void): void;
  on(event: 'archivate-week-data', cb: () => void): void;
}
