import { ID } from '../../types/common';
import { TransactionType } from '../../types/transaction';

export type SaveTransactionPayload = {
  walletId: ID;
  amount: number;
  type: TransactionType;
};

export type Events = {
  'save-transaction': SaveTransactionPayload;
};
