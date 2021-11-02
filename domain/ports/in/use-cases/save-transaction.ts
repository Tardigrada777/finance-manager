import { UseCase } from './use-case';

export class SaveTransactionUseCase extends UseCase {
  use() {
    this._in.on('save-transaction', (payload) => {
      const walletId = payload.wallet; // TODO: find correct walletId
      const type = payload.type === 'income' ? 1 : 0;
      this._out.saveByWalletId(walletId, {
        amount: payload.amount,
        datetime: new Date(),
        type,
      });
    });
  }
}
