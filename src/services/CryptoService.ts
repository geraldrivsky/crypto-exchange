import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICurrency } from '../models/ICurrency';

export interface fetchCurrenciesParams {
  active: boolean;
  fixedRate: boolean;
}

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.changenow.io',
  }),
  endpoints: builder => ({
    fetchCurrencies: builder.query<ICurrency[], fetchCurrenciesParams>({
      query: ({ active = true, fixedRate = true }) => ({
        url: 'v1/currencies',
        params: {
          active,
          fixedRate,
        },
      }),
    }),
  }),
});
