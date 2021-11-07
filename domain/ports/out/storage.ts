import { ID } from '../../types/common';

export interface StoredWallet {
  id: ID;
  name: string;
}

export interface Storage {
  saveOutcomeByWallet(
    wallet: string,
    payload: { amount: number }
  ): Promise<boolean>;

  getOutcomeOfDay(wallet: string, date: Date): Promise<number | null>;

  makeArchive(): Promise<boolean>;

  clearWalletsData(): Promise<boolean>;
}
