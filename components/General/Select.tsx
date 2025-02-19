const Select = ({
  name,
  label,
  id,
  value,
  onChange,
  children,
}: {
  name: string
  label?: string
  id: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  children: React.ReactNode
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
        {label ? label : name}
      </label>
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        {children}
      </select>
    </div>
  )
}

export default Select
