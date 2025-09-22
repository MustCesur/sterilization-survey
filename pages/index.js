import Link from 'next/link'

export default function Home(){
  return (
    <main style={{padding: 20}}>
      <h1>Sterilization Department — Surveys</h1>
      <p><Link href="/survey">Take survey</Link></p>
      <p><Link href="/admin">Admin dashboard</Link></p>
    </main>
  )
}
