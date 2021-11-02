import mitt from 'mitt';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import { EventsProvider } from '../domain/ports/in/events-provider';

export class ConsoleEventsProvider implements EventsProvider {
  emitter = mitt();

  constructor() {
    setTimeout(() => {
      const rl = readline.createInterface({ input, output });
      rl.question('Enter amount', (data) => {
        this.emitter.emit('save-transaction', {
          amount: +data,
          type: 'income',
        });
        rl.close();
      });
    });
  }

  on(event: 'save-transaction', cb: any) {
    this.emitter.on(event, (data) => {
      cb(data);
    });
  }
}
