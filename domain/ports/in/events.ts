import { ID } from '../../types/common';
import { TransactionType } from '../../types/transaction';

export type FrontEvents = 'save-transaction';

export type SaveTransactionPayload = {
  walletId: ID;
  amount: number;
  type: TransactionType;
};
