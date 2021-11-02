import { TransactionType } from '../../types/transaction';

export type SaveTransactionPayload = {
  wallet: string;
  amount: number;
  type: TransactionType;
};

export type Events = {
  'save-transaction': SaveTransactionPayload;
};
