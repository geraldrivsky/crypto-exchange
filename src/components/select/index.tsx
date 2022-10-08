import { ChangeEvent, FC, useEffect, useState } from 'react';
import cl from './Select.module.scss';
import { ExchangeRole } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { CryptoSlice } from '../../store/reducers/CryptoSlice';
import classNames from 'classnames';

interface SelectProps {
  currencies: {
    image: string;
    name: string;
    ticker: string;
  }[];
  onSelect: (ticker: string) => void;
  exchangeRole: ExchangeRole;
}

// eslint-disable-next-line react/display-name
const Select: FC<SelectProps> = ({ currencies, onSelect, exchangeRole }) => {
  const dispatch = useAppDispatch();
  const { searchFrom, searchTo, currencyFrom, currencyTo } = useAppSelector(
    state => state.crypto
  );
  const { setSearchFrom, setSearchTo } = CryptoSlice.actions;

  const isFrom = exchangeRole === 'from';
  const searchLC = isFrom ? searchFrom.toLowerCase() : searchTo.toLowerCase();
  const firstCurrency = currencies[0].ticker;

  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    isFrom ? dispatch(setSearchFrom(value)) : dispatch(setSearchTo(value));
  };

  useEffect(() => {
    onSelect(firstCurrency);
    // eslint-disable-next-line
  }, []);

  const getCurrentCurrency = () => {
    if (currencyFrom && currencyTo) {
      currencies.find(({ ticker }) =>
        isFrom ? ticker === currencyFrom.ticker : ticker === currencyTo.ticker
      );
    } else {
      return firstCurrency;
    }
  };

  return (
    <div className={cl.container}>
      <input
        placeholder='Search'
        type='text'
        className={cl.input}
        onChange={handleSearch}
        value={isFrom ? searchFrom : searchTo}
      />
      <div className={classNames(cl.select, { [cl.selectOpen]: isOpen })}>
        {currencies
          .filter(
            ({ ticker, name }) =>
              ticker.toLowerCase().includes(searchLC) ||
              name.toLowerCase().includes(searchLC)
          )
          .map(({ ticker, image, name }) => (
            <div
              key={ticker}
              onClick={() => {
                onSelect(ticker);
              }}
              className={classNames(cl.option, { [cl.optionActive]: false })}
            >
              {ticker.toUpperCase()}
              <img src={image} alt='currency icon' />
              <span>{ticker.toUpperCase()}</span>
              <span>{name}</span>
            </div>
          ))}
      </div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className={cl.button}
      ></button>
    </div>
  );
};

export default Select;
