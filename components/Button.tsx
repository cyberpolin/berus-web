const Button = ({
  title,
  onClick,
}: {
  title: string
  onClick?: () => void
}) => {
  return (
    <button
      className={`m-auto mb-2 mt-2 w-2/3 rounded bg-lime-800 px-4 py-2 font-bold text-white hover:bg-lime-700 `}
      type="submit"
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default Button
