const MonthSelect = ({
  months,
  selectedMonth,
  setSelectedMonth,
}: {
  months: any;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
}) => {
  return (
    <select
      onChange={(e) => {
        const value = e.target.value;
        setSelectedMonth(value);
      }}
      id="countries"
      className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
    >
      {months.map((m: any, i: number) => {
        const dateString = m.format('MMMM YY');
        const isoDate = m.toISOString();
        return (
          <option key={isoDate} value={isoDate} selected={isoDate === selectedMonth}>
            {dateString}
          </option>
        );
      })}
    </select>
  );
};

export default MonthSelect;
