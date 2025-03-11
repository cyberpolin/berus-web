const Input = ({
  extraStyles,
  typeInput,
  placeholder,
  name,
  label,
  id,
  value,
  onChange,
  error,
}: {
  extraStyles?: string;
  typeInput?: string;
  placeholder?: string;
  name?: string;
  label?: string;
  id?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: any;
}) => (
  <div className="w-full">
    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
      {label ? label : name}
    </label>
    <input
      className={`${extraStyles} h-10 w-full`}
      title={placeholder}
      name={name}
      id={id}
      type={typeInput || 'text'}
      value={value}
      onChange={onChange}
    />
    {error && <span className="text-sm text-red-400">{error}</span>}
  </div>
);

export default Input;
