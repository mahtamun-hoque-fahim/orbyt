import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import AppNav from '@/components/nav/AppNav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  return (
    <>
      <AppNav />
      {children}
    </>
  )
}
