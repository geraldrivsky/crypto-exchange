import { FC } from 'react';
import { cryptoApi, fetchCurrenciesParams } from './services/CryptoService';
import ExchangeContainer from './components/exchange-container';
import cl from './App.module.scss';

const App: FC = () => {
  const {
    data: currencies,
    isLoading,
    error,
  } = cryptoApi.useFetchCurrenciesQuery({} as fetchCurrenciesParams);

  return (
    <div className={cl.container}>
      <h1 className={cl.header}>Crypto Exchange</h1>
      <h2 className={cl.subheader}>Exchange fast and easy</h2>
      {isLoading && <h2 className={cl.loading}>Currencies loading...</h2>}
      {error && <h2 className='error'>Currencies fetching error.</h2>}
      {currencies && <ExchangeContainer currencies={currencies} />}
      <label className={cl.label} htmlFor='ethereum-address'>
        Your Ethereum address:
      </label>
      <input id='ethereum-address' required className={cl.input} type='text' />
      <button className={cl.button}>EXCHANGE</button>
    </div>
  );
};

export default App;
