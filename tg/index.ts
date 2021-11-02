import mitt from 'mitt';
import TelegramBot from 'node-telegram-bot-api';
import { EventsProvider } from '../domain/ports/in/events-provider';
import { Events } from '../domain/ports/in/events';

export class TelegramEventsProvider implements EventsProvider {
  private readonly _emitter = mitt<Events>();
  private _tg: TelegramBot;

  constructor(token: string) {
    this._tg = new TelegramBot(token, { polling: true });
    this.start();
  }

  start() {
    this._tg.onText(/\/echo (.+)/, (msg, match) => {
      this._emitter.emit('save-transaction', {
        amount: 1,
        type: 'income',
        walletId: '1',
      });
      const chatId = msg.chat.id;
      const resp = match ? match[1] : '';
      this._tg.sendMessage(chatId, resp);
      console.log('[tg]: ', match);
    });
  }

  on(event: 'save-transaction', cb: any) {
    this._emitter.on(event, (data) => {
      cb(data);
    });
  }
}
