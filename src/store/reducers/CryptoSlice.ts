import { ICurrency } from '../../models/ICurrency';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { IMinExchangeAmount } from '../../models/IMinExchangeAmount';
import {
  fetchEstimatedExchangeAmount,
  fetchMinExchangeAmount,
} from './ActionCreators';
import { IEstimatedExchangeAmount } from '../../models/IEstimatedExchangeAmount';
import { AppError } from '../../types';

interface CryptoState {
  currencyFrom: ICurrency | null;
  currencyTo: ICurrency | null;
  amountFrom: string;
  amountTo: string;
  searchFrom: string;
  searchTo: string;
  minExchangeAmount: {
    amount: number | null;
    isLoading: boolean;
  };
  estimatedExchangeAmount: {
    amount: number | null;
  };
  appError: AppError;
}

const initialState: CryptoState = {
  currencyFrom: null,
  currencyTo: null,
  amountFrom: '',
  amountTo: '',
  searchFrom: '',
  searchTo: '',
  minExchangeAmount: { amount: null, isLoading: false },
  estimatedExchangeAmount: {
    amount: null,
  },
  appError: {
    type: null,
    message: '',
  },
};

export const CryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCurrencyFrom(state, { payload }: PayloadAction<ICurrency>) {
      state.currencyFrom = payload;
    },
    setCurrencyTo(state, { payload }: PayloadAction<ICurrency>) {
      state.currencyTo = payload;
    },
    setAmountFrom(state, { payload }: PayloadAction<string>) {
      state.amountFrom = payload;

      if (state.appError.type === 'FetchingPair') {
        return;
      }

      state.appError = {
        type: null,
        message: '',
      };
    },
    setSearchFrom(state, { payload }: PayloadAction<string>) {
      state.searchFrom = payload;
    },
    setSearchTo(state, { payload }: PayloadAction<string>) {
      state.searchTo = payload;
    },
    setAppError(state, { payload }: PayloadAction<AppError>) {
      state.appError = payload;
    },
  },
  extraReducers: {
    [fetchMinExchangeAmount.pending.type]: state => {
      state.minExchangeAmount.isLoading = true;
    },

    [fetchMinExchangeAmount.fulfilled.type]: (
      state,
      { payload: { minAmount } }: PayloadAction<IMinExchangeAmount>
    ) => {
      state.minExchangeAmount = {
        amount: minAmount,
        isLoading: false,
      };
      state.amountFrom = String(minAmount);
      state.appError = {
        type: null,
        message: '',
      };
    },

    [fetchMinExchangeAmount.rejected.type]: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      state.appError = {
        type: 'FetchingPair',
        message: payload,
      };
    },

    [fetchEstimatedExchangeAmount.fulfilled.type]: (
      state,
      { payload: { estimatedAmount } }: PayloadAction<IEstimatedExchangeAmount>
    ) => {
      state.estimatedExchangeAmount.amount = estimatedAmount;
      state.amountTo = String(estimatedAmount);
    },

    [fetchEstimatedExchangeAmount.rejected.type]: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      state.appError = {
        type: 'FetchingPair',
        message: payload,
      };
    },
  },
});

export default CryptoSlice.reducer;
