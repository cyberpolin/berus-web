import Link from 'next/link';

const DataTable = ({ headers, data }) => {
  return (
    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {headers.map((title, i) => (
            <th key={i} scope="col" className="px-6 py-3">
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, name, description, needsAproval, reserve }, i) => {
          const bg = i % 2 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800';
          return (
            <tr
              key={i}
              className={`${bg} border-b transition-opacity hover:opacity-95 dark:border-gray-700`}
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                {name}
              </th>
              <td className="px-6 py-4">{description}</td>
              <td className="px-6 py-4">{needsAproval}</td>
              <td className="px-6 py-4">{reserve}</td>
              <td className="px-6 py-4">
                <Link
                  href={`./comon-areas?edit=${id}`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Edit
                </Link>
                /
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Delete
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
