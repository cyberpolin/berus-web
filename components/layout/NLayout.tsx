import UseAuth from "@/lib/UseAuth";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import useUI from "@/lib/hooks/useUI";
import ProfileMenu from "./ProfileMenu";
import { useRouter } from "next/router";

const NLayout = (props: any) => {
  const { user } = UseAuth();
  const router = useRouter();
  const ui = useUI();

  useEffect(() => {
    if (!user) {
      router?.push("/login");
    }
  }, []);

  const showSettings = ui.settings ? "" : "hidden -z-10";
  const showProfile = ui.profile ? "" : "hidden -z-10";
  const showMobile = ui.mobile ? "sm:inline-block" : "hidden sm:inline-block";

  return (
    <div>
      <ProfileMenu user={user} show={ui.profile} />
      <div
        id="setting"
        className={`${showSettings} absolute right-2 top-20 block w-40  overflow-hidden rounded-md border-2 bg-white transition-opacity  dark:border-gray-600 dark:bg-gray-800`}
      >
        <Link href="#" className="block p-2 text-xs hover:bg-slate-200">
          ...
        </Link>
        <Link
          href="/admin/comon-areas"
          className="block p-2 text-xs hover:bg-slate-200"
        >
          Areas Comunes
        </Link>
        <Link
          href="/admin/tags"
          className="block p-2 text-xs hover:bg-slate-200"
        >
          Add Tags
        </Link>
        <Link
          href="/admin/facturacion"
          className="block p-2 text-xs hover:bg-slate-200"
        >
          Facturación
        </Link>
        <Link href="#" className="block p-2 text-xs hover:bg-slate-200">
          ...
        </Link>
      </div>
      <div>
        <nav className="m-0 mb-3 flex max-w-full flex-col border-gray-200 bg-white py-1 dark:border-gray-600 dark:bg-gray-800 sm:flex-row">
          <div id="logo" className="w-full py-2 sm:w-2/6">
            <button
              className={`m-2 inline-block rounded-md border p-1 sm:hidden`}
              onClick={ui.toggleMobile}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Image
              className="w-max"
              src="/c7logo.png"
              width={200}
              height={30}
              alt="Altozano Tabasco"
            />
          </div>
          <div
            id="menu"
            className={`${showMobile} w-full border-red-100 text-end sm:mx-2 sm:w-4/6 sm:w-max sm:py-2 `}
          >
            {user.isAdmin && (
              <Link
                className="block p-5 text-center text-sm hover:text-gray-800 hover:underline dark:text-amber-50 md:mt-0 md:inline-block"
                href="/admin"
              >
                Admin
              </Link>
            )}
            <Link
              className="block p-5 text-center text-sm hover:text-gray-800 hover:underline dark:text-amber-50 md:mt-0 md:inline-block"
              href="/dashboard/cuotas"
            >
              Cuotas
            </Link>
            <Link
              className="block p-5 text-center text-sm hover:text-gray-800 hover:underline dark:text-amber-50 md:mt-0 md:inline-block"
              href="/dashboard/descargables"
            >
              Descargables
            </Link>
            {/* <Link
              className="block p-5 text-center text-sm hover:text-gray-800 hover:underline dark:text-amber-50 md:mt-0 md:inline-block"
              href="/dashboard/areas"
            >
              Reservar Areas
            </Link>
            <Link
              className="block p-5 text-center text-sm hover:text-gray-800 hover:underline dark:text-amber-50 md:mt-0 md:inline-block"
              href="/dashboard/card"
            >
              Card
            </Link> */}
            <Link
              className="block p-5 text-center text-sm hover:text-gray-800 hover:underline dark:text-amber-50 md:mt-0 md:inline-block"
              href="/logout"
            >
              Salir
            </Link>

            <img
              onClick={ui.toggleProfile}
              data-popover-target="popover-user-profile"
              className="mx-auto block rounded-full p-1 text-center ring-2 ring-gray-300 dark:ring-gray-500"
              src="/avatar.png"
              alt="Bordered avatar"
              width="30"
            />

            <button
              className="m-4 hidden transition-all hover:rotate-45 sm:inline-block"
              onClick={ui.toggleSettings}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </nav>
        <div className="mx-auto max-w-full overflow-hidden">
          <div className="md:flex">{props.children}</div>
        </div>
      </div>
    </div>
  )
};

export default NLayout;
