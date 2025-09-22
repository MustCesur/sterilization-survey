import { useEffect, useState } from 'react'
import axios from 'axios'

export default function SurveyPage(){
  const [survey, setSurvey] = useState(undefined)
  const [answers, setAnswers] = useState({})
  const [status, setStatus] = useState('')

  useEffect(()=>{
    axios.get('/api/surveys')
      .then(r => {
        if(r.data.length > 0){
          setSurvey(r.data[0])
        } else {
          setSurvey(null)
        }
      })
      .catch(() => setSurvey(null))
  },[])

  if(survey === undefined) return <div>Loading survey…</div>
  if(survey === null) return <div>No surveys available yet.</div>

  function onChange(qid, val){
    setAnswers(prev=> ({...prev, [qid]: Number(val)}))
  }

  async function submit(e){
    e.preventDefault()
    const missing = survey.questions.filter(q => !answers[q.id])
    if(missing.length){ setStatus('Please answer all questions'); return }
    setStatus('Submitting...')
    const payload = { surveyId: survey.id, answers }
    try{
      await axios.post('/api/surveys', payload)
      setStatus('Submitted — thank you!')
    }catch(err){ setStatus('Error saving responses') }
  }

  return (
    <main style={{padding:20}}>
      <h2>{survey.title}</h2>
      <p>{survey.description}</p>
      <form onSubmit={submit}>
        {survey.questions.map(q => (
          <div key={q.id} style={{marginBottom:12}}>
            <label>{q.order}. {q.text}</label>
            <div>
              {[1,2,3,4,5].map(n=> (
                <label key={n} style={{marginRight:8}}>
                  <input
                    type="radio"
                    name={q.id}
                    value={n}
                    onChange={(e)=> onChange(q.id, e.target.value)}
                  /> {n}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      <p>{status}</p>
    </main>
  )
}
