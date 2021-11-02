import { SaveTransactionCommand } from '../ports/out/commands/save-transaction';
import { Storage } from '../ports/out/storage';
import { TransactionType } from '../types/transaction';

export class TransactionService {
  constructor(private readonly _storage: Storage) {}

  async saveTransaction(command: SaveTransactionCommand) {
    const type = command.info.transactionType === 'income' ? 1 : 0;
    await this._storage.saveByWalletId(command.info.walletId, {
      amount: command.info.amount,
      datetime: new Date(),
      type,
    });
  }
}
