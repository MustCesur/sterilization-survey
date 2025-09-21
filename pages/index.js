import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home(){
  const { data: session } = useSession()
  return (
    <main style={{padding: 20}}>
      <h1>Sterilization Department — Surveys</h1>
      {session ? (
        <>
          <p>Signed in as {session.user.email} ({session.user.role || 'staff'})</p>
          <p><Link href="/survey">Take survey</Link></p>
          <p><Link href="/admin">Admin dashboard</Link></p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <p>You are not signed in.</p>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </main>
  )
}
