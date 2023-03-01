import UseAuth from "@/lib/UseAuth"
import { useRouter } from "next/router"
import React from "react"

export default (props) => {
  const router = useRouter()
  const { user } = UseAuth()

  if (user.id) {
    router.push("/dashboard")
    return
  }

  const childAry = Array.isArray(props.children)
    ? [...props.children]
    : [props.children]

  return (
    <div>
      {childAry.map((child, i) => React.cloneElement(child, { ...props }))}
    </div>
  )
}
