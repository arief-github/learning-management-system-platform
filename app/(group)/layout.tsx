import React from 'react'

export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full bg-sky-700'>{children}</div>
  )
}
