import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import cl from './Select.module.scss';
import { ExchangeRole } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { CryptoSlice } from '../../store/reducers/CryptoSlice';
import classNames from 'classnames';

interface SelectCurrency {
  image: string;
  name: string;
  ticker: string;
}

interface SelectProps {
  currencies: SelectCurrency[];
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

  const [isOpen, setIsOpen] = useState(false);

  const isFrom = exchangeRole === 'from';
  const searchLC = isFrom ? searchFrom.toLowerCase() : searchTo.toLowerCase();

  let currentCurrency = currencies[0];
  let currentTicker = currentCurrency.ticker;

  if (currencyFrom && currencyTo) {
    const findedCurrency = currencies.find(({ ticker }) =>
      isFrom ? ticker === currencyFrom.ticker : ticker === currencyTo.ticker
    );

    if (findedCurrency) {
      currentCurrency = findedCurrency;
      currentTicker = findedCurrency.ticker;
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderedCurrencies = isOpen ? currencies : [currentCurrency];

  useEffect(() => {
    onSelect(currentTicker);
    // eslint-disable-next-line
  }, []);

  const handleSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    isFrom ? dispatch(setSearchFrom(value)) : dispatch(setSearchTo(value));
  };

  const filteredCurrencies = useMemo(() => {
    return renderedCurrencies.filter(
      ({ ticker, name }: SelectCurrency) =>
        ticker.toLowerCase().includes(searchLC) ||
        name.toLowerCase().includes(searchLC)
    );
  }, [renderedCurrencies, searchLC]);

  const clearSearch = () => {
    isFrom ? dispatch(setSearchFrom('')) : dispatch(setSearchTo(''));
  };

  const containerClassName = classNames(cl.container, {
    [cl.containerOpen]: isOpen,
  });

  const buttonClassName = classNames(cl.button, { [cl.buttonOpen]: isOpen });

  return (
    <div
      onClick={() => {
        !isOpen && setIsOpen(true);
      }}
      className={containerClassName}
    >
      <input
        placeholder='Search'
        type='text'
        className={cl.input}
        onChange={handleSearch}
        value={isFrom ? searchFrom : searchTo}
      />
      <div className={cl.select}>
        {filteredCurrencies.map(({ ticker, image, name }) => {
          return (
            <div
              key={ticker}
              onClick={() => {
                if (isOpen) {
                  onSelect(ticker);
                  setIsOpen(false);
                  clearSearch();
                }
              }}
              className={cl.option}
            >
              <img className={cl.img} src={image} alt='currency icon' />
              <span>{ticker.toUpperCase()}</span>
              {isOpen && <span className={cl.name}>{name}</span>}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          clearSearch();
        }}
        className={buttonClassName}
      ></button>
    </div>
  );
};

export default Select;
