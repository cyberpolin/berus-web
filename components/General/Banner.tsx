import router from 'next/router'
import { CloseOutline } from 'react-ionicons'
import { useState } from 'react'
import { set } from 'lodash'
const Banner = ({
  condition,
  redirect,
  children,
}: {
  condition: boolean
  redirect: string
  children: React.ReactNode
}) => {
  const [closeBanner, setCloseBanner] = useState(false)
  if (condition && !closeBanner) {
    return (
      <div
        className="z-10 m-4 mb-4 flex h-8 cursor-pointer  items-center justify-between rounded-lg bg-blue-300 p-4 text-sm text-blue-800 transition-all hover:shadow-lg"
        role="alert"
      >
        {children}
        <CloseOutline
          onClick={(e: any) => {
            e.stopPropagation()
            setCloseBanner(true)
          }}
        />
      </div>
    )
  }
  return <></>
}

export default Banner
