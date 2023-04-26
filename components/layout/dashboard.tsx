import Logout from "@/components/Logout"
import UseAuth from "@/lib/UseAuth"
import { useMutation } from "@apollo/client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useState } from "react"
import Dropzone, { useDropzone } from "react-dropzone"
import { UPDATE_USER } from "../../pages/admin/adminQueries.gql"
import { IS_LOGGED } from "../../pages/login/queries.gql"

const Drop = ({
  dz: { getInputProps, getRootProps, loading },
}: {
  dz: any
}) => (
  <div className="flex w-full items-center justify-center">
    <label
      {...getRootProps}
      className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <input className="u-full-width " {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pb-6 pt-5">
        {loading ? (
          <>
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </>
        ) : (
          <svg
            aria-hidden="true"
            className="mb-3 h-10 w-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
        )}
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Sube tu archivo aqui</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">PDF o imágen</p>
      </div>
      <input id="dropzone-file" type="file" className="hidden" />
    </label>
  </div>
)

const MenuItem = ({ title, link }: { title: string; link: string }) => (
  <li>
    <div className="text-sm">
      <Link
        className="block p-5 hover:text-gray-800 dark:text-amber-50 md:mt-0 md:inline-block"
        href={link}
      >
        {title}
      </Link>
    </div>
  </li>
)

export default function Layout(props: any) {
  const router = useRouter()
  const { user } = UseAuth()
  const [hidden, setHidden] = useState("")
  const [showInfo, setShowInfo] = useState(false)

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  const [updateUser, { loading, data, error, called }] = useMutation(
    UPDATE_USER,
    { refetchQueries: [IS_LOGGED] }
  )

  //@ts-ignore
  const onDrop = useCallback((acceptedFiles, i) => {
    // Do something with the files
    //@ts-ignore
    const image = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    )[0]

    updateUser({
      variables: {
        id: user.id,
        // @ts-ignore: Unreachable code error
        image,
      },
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png", ".pdf", ".jpeg", ".jpg"],
    },
    onDrop,
  })

  const toggleHidden = () => {
    const nextState = hidden === "" ? "hidden" : ""
    setHidden(nextState)
  }

  const childAry = Array.isArray(props.children)
    ? [...props.children.filter((x: any) => x)]
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
    <div className="relative">
      <div
        className={`absolute right-0 top-20 z-10 inline-block w-64 rounded-lg border border-gray-200 bg-white text-sm text-gray-500  shadow-sm transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 ${
          showInfo ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
              Hola <a href="#">{user.name}</a>
            </p>
          </div>
          {user.rfc?.publicUrl && (
            <>
              <p className="mb-4 text-sm">
                Recibiras tus facturas los dias 15 y 30 de cada mes
              </p>
              <p className="mb-4 text-sm">
                Si deseas cambiar tu documento de situación fiscal, pide al
                administrador ayuda
              </p>
            </>
          )}

          {!user.rfc?.publicUrl && (
            <>
              <p className="mb-4 text-sm">
                Si deseas que te facturemos tus cuotas por favor sube tu
                documento de <b>situación fiscal</b>. .
              </p>
              <Drop dz={{ getInputProps, getRootProps, loading }} />
            </>
          )}
        </div>
      </div>
      <nav className=" border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <Image
            src="/c7logo.png"
            width={240}
            height={50}
            alt="Altozano Tabasco"
          />
          <button
            data-collapse-toggle="mega-menu-full"
            type="button"
            className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="mega-menu-full"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>

            <svg
              className="h-6 w-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            id="mega-menu-full"
            className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
          >
            <ul className="mt-4 flex flex-col font-medium md:mt-0 md:flex-row md:space-x-8">
              {user.isAdmin && <MenuItem title="Admin" link="/admin" />}
              <MenuItem title="Cuotas" link="/dashboard/cuotas" />
              <MenuItem title="Salir" link="/logout" />

              <li className="flex flex-col" onClick={toggleInfo}>
                <img
                  data-popover-target="popover-user-profile"
                  className="m-auto rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500"
                  src="/avatar.png"
                  alt="Bordered avatar"
                  width="30"
                />
                <span className="mx-auto mt-2 text-xs">{user.name}</span>
              </li>
            </ul>
          </div>
        </div>
        <div
          id="mega-menu-full-dropdown"
          className="mt-1 border-y border-gray-200 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800"
        ></div>
      </nav>

      <div className="mb-4 flex">
        <div className="w-full">
          {childAry.map((child) => React.cloneElement(child, { user }))}
        </div>
      </div>
    </div>
  )
}

