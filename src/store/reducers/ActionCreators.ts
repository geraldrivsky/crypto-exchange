import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IMinExchangeAmount } from '../../models/IMinExchangeAmount';
import { key } from '../../api/key';
import { ICurrency } from '../../models/ICurrency';
import { IEstimatedExchangeAmount } from '../../models/IEstimatedExchangeAmount';

const getFromTo = (from: ICurrency, to: ICurrency) => {
  return `${from.ticker}_${to.ticker}`;
};

export const fetchMinExchangeAmount = createAsyncThunk(
  'crypto/fetchMinExchangeAmount',
  async (
    {
      currencyFrom,
      currencyTo,
    }: { currencyFrom: ICurrency; currencyTo: ICurrency },
    { rejectWithValue }
  ) => {
    try {
      const fromTo = getFromTo(currencyFrom, currencyTo);

      const minExchangeAmount = await axios.get<IMinExchangeAmount>(
        `https://api.changenow.io/v1/min-amount/${fromTo}?api_key=${key}`
      );
      return minExchangeAmount.data;
    } catch {
      return rejectWithValue('This pair is disabled now');
    }
  }
);

export const fetchEstimatedExchangeAmount = createAsyncThunk(
  'crypto/fetchEstimatedExchangeAmount',
  async (
    {
      currencyFrom,
      currencyTo,
      amountFrom,
    }: {
      currencyFrom: ICurrency;
      currencyTo: ICurrency;
      amountFrom: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const fromTo = getFromTo(currencyFrom, currencyTo);

      const estimatedExchange = await axios.get<IEstimatedExchangeAmount>(
        `https://api.changenow.io/v1/exchange-amount/${amountFrom}/${fromTo}?api_key=${key}`
      );
      return estimatedExchange.data;
    } catch {
      return rejectWithValue('This pair is disabled now');
    }
  }
);
