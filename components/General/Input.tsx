import { error } from 'console';

const Input = ({
  extraStyles,
  typeInput,
  placeholder,
  name,
  id,
  value,
  onChange,
  error,
}: {
  extraStyles?: string;
  typeInput?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: any;
}) => (
  <div className="w-full">
    <input
      className={`${extraStyles} h-10 w-full`}
      title={placeholder}
      name={name}
      id={id}
      type={typeInput || 'text'}
      value={value}
      onChange={onChange}
    />
    {error && <span>{error}</span>}
  </div>
);

export default Input;
