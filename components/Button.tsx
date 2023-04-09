const Button = ({ title }: { title: string }) => {
  return (
    <button
      className={`m-auto mb-2 mt-2 w-2/3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 `}
      type="submit"
    >
      {title}
    </button>
  )
}

export default Button
