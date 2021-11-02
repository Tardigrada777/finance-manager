import { UseCase } from './use-case';

export class SaveTransactionUseCase2 extends UseCase {
  use() {
    this._in.on('save-transaction', (payload) => {
      console.dir({ type: 'SaveTransaction2', payload });
    });
  }
}
