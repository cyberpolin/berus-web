import UseAuth from "@/lib/UseAuth"
import { useRouter } from "next/router"
import React from "react"
import styled from "styled-components"

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
    <Layout>
      {childAry.map((child, i) => React.cloneElement(child, { ...props }))}
    </Layout>
  )
}

const Layout = styled.div`
  margin: 100px 0;
  background-color: red;
`