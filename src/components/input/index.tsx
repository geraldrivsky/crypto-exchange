import { ChangeEvent, forwardRef } from 'react';
import cl from './Input.module.scss';

interface InputProps {
  onChange: (amount: string) => void;
  value: string;
  disabled: boolean;
}

// eslint-disable-next-line react/display-name
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, value, disabled }, ref) => {
    const handleChange = ({
      target: { value },
    }: ChangeEvent<HTMLInputElement>) => {
      if (isNaN(Number(value))) return;

      onChange(value);
    };

    return (
      <input
        disabled={disabled}
        type='text'
        onChange={handleChange}
        value={value}
        className={cl.container}
        ref={ref}
      />
    );
  }
);

export default Input;
