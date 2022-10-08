import { FC, useEffect } from 'react';
import { ICurrency } from '../../models/ICurrency';
import { CurrencyContainer } from '../index';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { CryptoSlice } from '../../store/reducers/CryptoSlice';
import {
  fetchEstimatedExchangeAmount,
  fetchMinExchangeAmount,
} from '../../store/reducers/ActionCreators';
import { HandleSelect } from '../../types';

interface ExchangeContainerProps {
  currencies: ICurrency[];
}

const ExchangeContainer: FC<ExchangeContainerProps> = ({ currencies }) => {
  const {
    setCurrencyFrom,
    setCurrencyTo,
    setAppError,
    setSearchFrom,
    setSearchTo,
  } = CryptoSlice.actions;

  const dispatch = useAppDispatch();
  const { currencyFrom, currencyTo, amountFrom, minExchangeAmount, appError } =
    useAppSelector(state => state.crypto);
  const amountFromNR = Number(amountFrom);

  useEffect(() => {
    if (currencyFrom && currencyTo) {
      dispatch(fetchMinExchangeAmount({ currencyFrom, currencyTo }));
    }
  }, [currencyFrom, currencyTo, dispatch]);

  useEffect(() => {
    if (
      currencyFrom &&
      currencyTo &&
      minExchangeAmount.amount &&
      !minExchangeAmount.isLoading
    ) {
      if (amountFromNR >= minExchangeAmount.amount) {
        dispatch(
          fetchEstimatedExchangeAmount({
            currencyFrom,
            currencyTo,
            amountFrom: amountFromNR,
          })
        );
      } else {
        dispatch(
          setAppError({
            type: 'UserAction',
            message:
              'The amount of currency on the left should not be less than the minimum possible.',
          })
        );
      }
    }
    // eslint-disable-next-line
  }, [minExchangeAmount.isLoading, amountFrom, dispatch]);

  const handleSelect: HandleSelect = (currency, exchangeRole) => {
    if (exchangeRole === 'from') {
      dispatch(setCurrencyFrom(currency));
    } else {
      dispatch(setCurrencyTo(currency));
    }
  };

  const handleSwap = () => {
    if (currencyTo && currencyFrom) {
      dispatch(setSearchFrom(''));
      dispatch(setSearchTo(''));

      dispatch(setCurrencyFrom(currencyTo));
      dispatch(setCurrencyTo(currencyFrom));
    }
  };

  return (
    <div>
      <CurrencyContainer
        currencies={currencies}
        exchangeRole='from'
        onSelect={handleSelect}
      />
      <button onClick={handleSwap}>Swap</button>
      <CurrencyContainer
        currencies={currencies}
        exchangeRole='to'
        onSelect={handleSelect}
      />
      {appError.type && <h2 className='error'>{appError.message}</h2>}
    </div>
  );
};

export default ExchangeContainer;
