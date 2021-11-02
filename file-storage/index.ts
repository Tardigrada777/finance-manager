import { writeFile, readFile } from 'fs/promises';
import { Storage, StoredWallet } from '../domain/ports/out/storage';

const DB_NAME = './test.txt';

const STORE: Record<string, string> = {
  ['Продукты']: 'dsfh8sdf',
  Taxi: 'jhfsdh80908ds9f',
};

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

  async findWalletByName(walletName: string): Promise<StoredWallet | null> {
    if (!(walletName in STORE)) return null;
    return {
      id: STORE[walletName],
      name: 'WalletName',
    };
  }
}
