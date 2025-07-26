import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import ToastProvider from '@/components/providers/toaster-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body>
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}