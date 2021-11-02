import mitt from 'mitt';
import TelegramBot from 'node-telegram-bot-api';
import { EventsProvider } from '../domain/ports/in/events-provider';
import { Events } from '../domain/ports/in/events';
import { SAVE_TRANSACTION_QUERY } from './queries';

export class TelegramEventsProvider implements EventsProvider {
  private readonly _emitter = mitt<Events>();
  private _tg: TelegramBot;

  constructor(token: string) {
    this._tg = new TelegramBot(token, { polling: true });
    this.start();
  }

  start() {
    this._tg.onText(SAVE_TRANSACTION_QUERY, (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match ? match[0] : '';
      const [sign, amount, wallet] = resp.split(' ');
      console.dir({ sign, amount, wallet });
      this._emitter.emit('save-transaction', {
        amount: Number(amount),
        type: sign === '+' ? 'income' : 'outcome',
        wallet,
      });
      this._tg.sendMessage(chatId, 'Ok');
    });
  }

  on(event: 'save-transaction', cb: any) {
    this._emitter.on(event, (data) => {
      cb(data);
    });
  }
}
