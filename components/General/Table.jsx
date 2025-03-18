const Table = ({ headers, children }) => {
  return (
    <div className="mt-4 overflow-x-scroll rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(({ title, style }, i) => (
              <th
                key={i}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${style}`}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
          {children}
        </tbody>
      </table>
    </div>
  )
}

export default Table
