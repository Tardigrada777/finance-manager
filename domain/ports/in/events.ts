import { TransactionType } from '../../types/transaction';

export type SaveOutcomePayload = {
  wallet: string;
  amount: number;
  type: TransactionType;
};

export type Events = {
  'save-outcome': SaveOutcomePayload;
};
