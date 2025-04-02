import { useState, useEffect } from 'react'
import {
  ChevronBack,
  ChevronForward,
  HomeOutline,
  MenuOutline,
  OpenOutline,
  ReaderOutline,
  Person,
} from 'react-ionicons'
import Link from 'next/link'
import UseAuth from '@/lib/UseAuth'
import { useRouter } from 'next/router'
import path from 'path'

type MenuProps = {
  menuOpen: boolean
  toggleMenu: () => void
  userName?: string
  email?: string
}

const Header = ({ menuOpen, toggleMenu }: MenuProps) => {
  return (
    <div
      className="
        fixed
        top-0
        flex
        h-16
        w-full
        items-center
        justify-between
        bg-white
        shadow-sm
        "
    >
      <div
        className="ml-4 text-left xs:hidden"
        onClick={() => {
          toggleMenu()
        }}
      >
        <MenuOutline />
      </div>
      {/* <div className="h-12 w-full bg-[url('')] bg-contain bg-center bg-no-repeat" /> */}
    </div>
  )
}

const Sidebar = ({
  menuOpen,
  toggleMenu,
  userName = 'nombre',
  email = 'correo',
}: MenuProps) => {
  const OPTIONS = [
    {
      title: 'Home',
      icon: (
        <HomeOutline
          style={{
            width: '18px',
            height: '18px',
          }}
          cssClasses={
            '!text-green-500 mr-2 group-hover:translate-x-2 transition-all delay-100 duration-300 '
          }
        />
      ),
      link: '/subdivisions',
    },
    {
      title: 'Encusta',
      icon: (
        <ReaderOutline
          style={{
            width: '18px',
            height: '18px',
          }}
          cssClasses={
            '!text-green-500 mr-2 group-hover:translate-x-2 transition-all delay-100 duration-300 '
          }
        />
      ),
      link: '/subdivisions/survey/new',
    },
    {
      title: 'Encusta Admin',
      icon: (
        <ReaderOutline
          style={{
            width: '18px',
            height: '18px',
          }}
          cssClasses={
            '!text-green-500 mr-2 group-hover:translate-x-2 transition-all delay-100 duration-300 '
          }
        />
      ),
      link: '/subdivisions/admin/surveys/',
    },
    {
      title: 'Log out',
      icon: (
        <OpenOutline
          style={{
            width: '18px',
            height: '18px',
          }}
          cssClasses={
            '!text-green-500 mr-2 group-hover:translate-x-2 transition-all delay-100 duration-300 '
          }
        />
      ),
      link: '/subdivisions/logout',
    },
  ]

  return (
    <div
      className={`
        ${menuOpen ? '  w-52 ' : 'w-16'}
        fixed
        left-0
        top-16
        flex
        h-screen
        flex-col
        border-r
        bg-white
        transition-all
        xs:py-4
      `}
    >
      <div className=" flex  w-full items-center border-b bg-white p-4">
        <div
          onClick={() => {
            toggleMenu()
          }}
          className={`
          z-100  
          absolute
          -right-5
          hidden
          aspect-square
          h-6
          cursor-pointer 
          rounded-md
          border
          bg-white
          transition-all
          xs:block
        `}
        >
          {menuOpen ? <ChevronBack /> : <ChevronForward />}
        </div>
        <div
          className={`mr-2 flex aspect-square h-8 flex-col items-center justify-center rounded-full bg-green-200`}
        >
          <Person cssClasses={`text-green-500 !h-4`} />
        </div>
        <div className={`w-full ${!menuOpen && 'hidden'} `}>
          <p className="text-sm text-slate-800 ">{userName}</p>
          <p className="text-[10px] text-slate-300">{email}</p>
        </div>
      </div>
      <div className=" flex flex-col">
        {OPTIONS.map((option) => (
          <Link
            href={option.link}
            key={option.title}
            className="
              group
              flex
              cursor-pointer
              items-center
              justify-start
              border-green-300
              py-6
              pl-4
              text-slate-500
              transition-all
              hover:border-l-8
              hover:bg-green-50
              xs:py-4
              xs:text-sm
            "
          >
            {option.icon}
            <p
              className={`
              ${!menuOpen ? 'opacity-0' : 'opacity-100'}
              transition-all
              delay-100
              duration-300
              group-hover:translate-x-2
            `}
            >
              {option.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

type MainLayoutProps = {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const router = useRouter()
  const { user, loading } = UseAuth()

  useEffect(() => {
    if (loading) {
      if (
        !user.id &&
        router.pathname !== '/subdivisions/survey/form' &&
        router.pathname !== '/subdivisions/recovery'
      ) {
        router?.push('/subdivisions/login')
      }
    }
  }, [loading, user])

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100">
      <Header menuOpen={menuOpen} toggleMenu={toggleMenu} />
      <div
        className={`mt-16 flex ${menuOpen ? 'ml-52' : 'ml-20'} transition-all`}
      >
        <Sidebar
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          userName={user.name}
          email={user.email}
        />
        <div className=" w-full flex-grow ">{children}</div>
      </div>
    </div>
  )
}

export default MainLayout
