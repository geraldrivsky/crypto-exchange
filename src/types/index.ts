import { ICurrency } from '../models/ICurrency';

export type ExchangeRole = 'from' | 'to';

export type HandleSelect = (
  currency: ICurrency,
  exchangeRole: ExchangeRole
) => void;

export interface AppError {
  type: 'FetchingPair' | 'UserAction' | null;
  message: string;
}
