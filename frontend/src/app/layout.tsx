import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Almoxarifado',
  description: 'Sistema para gerenciamento e controle do almoxarifado',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" data-bs-theme="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
