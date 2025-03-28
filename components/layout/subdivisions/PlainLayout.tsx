import React from 'react'

const PlainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      {children}
    </div>
  )
}

export default PlainLayout
