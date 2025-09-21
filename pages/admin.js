import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Admin(){
  const { data: session } = useSession()
  const [surveys, setSurveys] = useState([])
  const [report, setReport] = useState(null)

  useEffect(()=>{ axios.get('/api/surveys').then(r=> setSurveys(r.data)) },[])

  async function genReport(surveyId){
    const res = await axios.post('/api/reports/generate', { surveyId })
    setReport(res.data)
  }

  if(!session) return <div>Please sign in.</div>
  if(session.user.role !== 'admin') return <div>Access denied — admin only.</div>

  return (
    <main style={{padding:20}}>
      <h1>Admin Dashboard</h1>
      <h2>Surveys</h2>
      {surveys.map(s=> (
        <div key={s.id} style={{border:'1px solid #ddd', padding:10, marginBottom:10}}>
          <h3>{s.title}</h3>
          <p>{s.description}</p>
          <button onClick={()=> genReport(s.id)}>Generate report</button>
        </div>
      ))}

      {report && (
        <section>
          <h2>Generated Report</h2>
          <pre>{report.content}</pre>
        </section>
      )}
    </main>
  )
}
