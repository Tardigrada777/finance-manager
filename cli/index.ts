import mitt from 'mitt';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import { EventsProvider } from '../domain/ports/in/events-provider';
import { Events } from '../domain/ports/in/events';

export class ConsoleEventsProvider implements EventsProvider {
  emitter = mitt<Events>();

  run() {
    // TODO: cli
  }

  on(event: 'save-outcome', cb: any) {
    this.emitter.on(event, (data) => {
      cb(data);
    });
  }
}
