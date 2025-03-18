import Button from '@/components/Button'

const Form = ({
  handleSubmit,
  title,
  errors,
  children,
}: {
  handleSubmit: () => void
  title: string
  errors: Array<string>
  children: React.ReactNode
}) => {
  return (
    <div className=" mx-auto w-full max-w-[1000px] rounded-md bg-gray-50 px-10 py-4  ">
      <form onSubmit={handleSubmit} className="flex flex-col  gap-y-8 ">
        <h2 className="font-semi-bold text-2xl">{title}</h2>
        {children}
        <Button
          title={title}
          type="submit"
          disabled={Object.keys(errors).length > 0}
        />
      </form>
    </div>
  )
}

export default Form
