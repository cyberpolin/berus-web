import Logout from "@/components/Logout"
import UseAuth from "@/lib/UseAuth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

export default function Layout(props) {
  const router = useRouter()
  const { user } = UseAuth()

  const childAry = Array.isArray(props.children)
    ? [...props.children]
    : [props.children]

  if (!user) {
    router.push("/login")
  }

  return (
    <div>
      <div className="menu">
        <div className="container">
          <div className="row">
            <div className="two columns">
              <Image
                src="/logo.png"
                width={200}
                height={80}
                alt="Altozano Tabasco"
              />
            </div>
            <div className="seven columns">
              <ul className="menu">
                <li>
                  <Link href="/dashboard/cuotas">Cuotas</Link>
                </li>
                <li>
                  <Logout />
                </li>
              </ul>
            </div>
            <div className="three columns">
              <div className="profile">
                <Image
                  alt="Usuario"
                  className="profileImage"
                  src="/profile-placeholder.jpeg"
                  width={50}
                  height={50}
                />
                <span>Ramón Gomez</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="twelve columns">
          {childAry.map((child) => React.cloneElement(child, { user }))}
        </div>
      </div>
    </div>
  )
}
