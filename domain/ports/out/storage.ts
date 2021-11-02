import { ID } from '../../types/common';

export interface StoredWallet {
  id: ID;
  name: string;
}

export interface Storage {
  saveByWalletId(
    id: string,
    payload: {
      amount: number;
      type: 1 | 0;
      datetime: Date;
    }
  ): Promise<boolean>;

  findWalletByName(walletName: string): Promise<StoredWallet | null>;
}
