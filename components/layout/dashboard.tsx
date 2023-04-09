import Logout from "@/components/Logout"
import UseAuth from "@/lib/UseAuth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

export default function Layout(props: any) {
  const router = useRouter()
  const { user } = UseAuth()

  const [hidden, setHidden] = useState("")

  const toggleHidden = () => {
    const nextState = hidden === "" ? "hidden" : ""
    setHidden(nextState)
  }

  const childAry = Array.isArray(props.children)
    ? [...props.children]
    : [props.children]

  useEffect(() => {
    if (!user) {
      router?.push("/login")
    }
  }, [])

  if (router.isFallback) {
    ;<h1>Data is loading</h1>
  }

  return (
    <div>
      <nav className="-mx-10  flex flex-wrap items-center justify-between bg-amber-50 p-6">
        <div className="mr-6 flex flex-shrink-0 items-center text-white">
          <Image
            src="/c7logo.png"
            width={240}
            height={50}
            alt="Altozano Tabasco"
          />
        </div>
        <div className="block md:hidden">
          <button
            onClick={toggleHidden}
            className="flex items-center rounded border border-gray-600 px-3 py-2 text-gray-600"
          >
            <svg
              className="h-3 w-3 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          className={`block w-full flex-grow transition md:flex md:w-auto md:items-center ${hidden}`}
        >
          <div className="text-sm ">
            <Link
              className="mr-4 mt-4 block hover:text-gray-800 md:mt-0 md:inline-block"
              href="/dashboard/cuotas"
            >
              Cuotas
            </Link>
          </div>
          <Logout />
        </div>
      </nav>

      <div className="mb-4 flex">
        <div className="w-full">
          {/* {childAry.map((child) => React.cloneElement(child, { user }))} */}
          {props.children}
        </div>
      </div>
    </div>
  )
}

