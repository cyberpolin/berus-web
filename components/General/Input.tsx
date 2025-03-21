const Input = ({
  extraStyles,
  extraStylesContainer,
  typeInput,
  placeholder,
  name,
  label,
  id,
  value,
  onChange,
  error,
}: {
  extraStyles?: string
  extraStylesContainer?: string
  typeInput?: string
  placeholder?: string
  name?: string
  label?: string
  id?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  error?: any
}) => (
  <div className={`${extraStylesContainer} w-full`}>
    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
      {label ? label : name}
    </label>
    <input
      className={`${extraStyles} border-1 h-10 w-full rounded-md border border-gray-700`}
      title={placeholder}
      name={name}
      id={id}
      type={typeInput || 'text'}
      value={value}
      onChange={onChange}
    />
    {error && <span className="text-sm text-red-400">{error}</span>}
  </div>
)

export default Input
