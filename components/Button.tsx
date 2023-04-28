import Link from "next/link"

const Button = ({
  title,
  onClick,
  type,
  href,
}: {
  title: string
  onClick?: () => void
  type?: string
  href?: string
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className="mb-2 mr-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        {title}
      </Link>
    )
  }
  return (
    <button
      //@ts-ignore
      type={type ? type : "submit"}
      onClick={onClick}
      className="mb-2 mr-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      {title}
    </button>
  )
}

export default Button
