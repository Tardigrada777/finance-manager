import mitt from 'mitt';
import TelegramBot from 'node-telegram-bot-api';
import { EventsProvider } from '../domain/ports/in/events-provider';
import { Events } from '../domain/ports/in/events';
import { ARCHIVATE_QUERY, SAVE_TRANSACTION_QUERY } from './queries';

type SubscribedEvents = 'save-outcome' | 'archivate-week-data';

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
      if (sign === '-') {
        this._emitter.emit('save-outcome', {
          amount: Number(amount),
          type: 'outcome',
          wallet,
        });
        this._tg.sendMessage(chatId, '- 🪙');
        return;
      }
      this._tg.sendMessage(chatId, 'This operation is not supported!');
    });

    this._tg.onText(ARCHIVATE_QUERY, (msg) => {
      const chatId = msg.chat.id;
      this._emitter.emit('archivate-week-data', {});
      this._tg.sendMessage(chatId, 'Week sucessfully saved!');
    });
  }

  on(event: SubscribedEvents, cb: any) {
    this._emitter.on(event, (data) => {
      cb(data);
    });
  }
}
