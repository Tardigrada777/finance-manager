import { UseCase } from './use-case';

export class SaveTransactionUseCase extends UseCase {
  use() {
    this._in.on('save-transaction', async (payload) => {
      const wallet = await this._out.findWalletByName(payload.wallet);
      if (!wallet) return;
      const { id } = wallet;
      const type = payload.type === 'income' ? 1 : 0;
      this._out.saveByWalletId(id, {
        amount: payload.amount,
        datetime: new Date(),
        type,
      });
    });
  }
}
