import { writeFile, readFile } from 'fs/promises';
import { Storage, StoredWallet } from '../domain/ports/out/storage';

const DB_NAME = './test.txt';

export class FileStorageAdapter implements Storage {
  async saveByWalletId(
    id: string,
    payload: {
      amount: number;
      type: 1 | 0;
      datetime: Date;
    }
  ) {
    const db = await readFile(DB_NAME, { encoding: 'utf-8' });
    await writeFile(
      DB_NAME,
      `${db}
[saveByWalletId]:
WalletID: ${id}, ${payload.datetime.toISOString()}: ${
        payload.type ? '+' : '-'
      }, ${payload.amount}\n`
    );
    return true;
  }

  async findWalletByName(walletName: string): Promise<StoredWallet> {
    return {
      id: '1',
      name: 'WalletName',
    };
  }
}
