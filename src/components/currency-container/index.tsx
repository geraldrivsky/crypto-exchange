import { FC, useEffect, useRef } from 'react';
import cl from './CurrencyContainer.module.scss';
import { ICurrency } from '../../models/ICurrency';
import { Input, Select } from '..';
import { ExchangeRole, HandleSelect } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { CryptoSlice } from '../../store/reducers/CryptoSlice';

interface CurrencyContainerProps {
  exchangeRole: ExchangeRole;
  currencies: ICurrency[];
  onSelect: HandleSelect;
}

const CurrencyContainer: FC<CurrencyContainerProps> = ({
  currencies,
  exchangeRole,
  onSelect,
}) => {
  const { setAmountFrom, setAmountTo } = CryptoSlice.actions;

  const dispatch = useAppDispatch();
  const { minExchangeAmount, amountFrom, amountTo, appError } = useAppSelector(
    state => state.crypto
  );

  let value: string;
  if (exchangeRole === 'from') {
    value = amountFrom;
  } else {
    value = appError.type === 'UserAction' ? '---' : amountTo;
  }

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      exchangeRole === 'from' &&
      inputRef.current &&
      minExchangeAmount.amount
    ) {
      inputRef.current.value = String(minExchangeAmount.amount);
    }
  }, [exchangeRole, minExchangeAmount.amount]);

  const handleSelect = (ticker: string) => {
    const currency = currencies.find(cur => cur.ticker === ticker);
    if (!currency) {
      return;
    }

    onSelect(currency, exchangeRole);
  };

  const handleChange = (amount: string) => {
    if (exchangeRole === 'from') {
      dispatch(setAmountFrom(amount));
    } else {
      dispatch(setAmountTo(amount));
    }
  };

  return (
    <div className={cl.container}>
      <Input
        disabled={exchangeRole === 'to'}
        value={value}
        ref={inputRef}
        onChange={handleChange}
      />
      <Select
        currencies={currencies.map(({ image, name, ticker }) => ({
          ticker,
          name,
          image,
        }))}
        onSelect={handleSelect}
        exchangeRole={exchangeRole}
      />
    </div>
  );
};
export default CurrencyContainer;
