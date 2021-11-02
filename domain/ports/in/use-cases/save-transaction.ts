import { UseCase } from './use-case';

export class SaveTransactionUseCase extends UseCase {
  use() {
    this._in.on('save-transaction', (payload) => {
      this._out.saveByWalletId(payload.walletId, {
        amount: payload.amount,
        type: 1,
        datetime: new Date(),
      });
    });
  }
}
