import UseAuth from "@/lib/UseAuth"
import { useRouter } from "next/router"
import React from "react"
import styled from "styled-components"

//@ts-ignore
const Layout = (props) => {
  const router = useRouter()
  const { user } = UseAuth()

  if (user.id) {
    router.push("/dashboard")
    return
  }

  const childAry = Array.isArray(props.children)
    ? [...props.children]
    : [props.children]

  if (router.isFallback) {
    return <h1>Data is loading</h1>
  }

  return (
    <LayoutComponent>
      {childAry.map((child, i) => React.cloneElement(child, { ...props }))}
      {/* {props.children} */}
    </LayoutComponent>
  )
}

export default Layout

const LayoutComponent = styled.div`
  margin: 100px 0;
  background-color: red;
`