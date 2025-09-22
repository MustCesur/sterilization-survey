import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Admin() {
  const [surveys, setSurveys] = useState([])
  const [report, setReport] = useState(null)

  // new survey form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([''])

  useEffect(() => { axios.get('/api/surveys').then(r => setSurveys(r.data)) }, [])

  async function genReport(surveyId) {
    const res = await axios.post('/api/reports/generate', { surveyId })
    setReport(res.data)
  }

  async function createSurvey(e) {
    e.preventDefault()
    try {
      const res = await axios.post('/api/surveys/create', {
        title,
        description,
        questions: questions.filter(q => q.trim() !== '')
      })
      setSurveys([res.data, ...surveys])
      setTitle('')
      setDescription('')
      setQuestions([''])
    } catch (err) {
      console.error(err)
    }
  }

  function updateQuestion(idx, value) {
    const updated = [...questions]
    updated[idx] = value
    setQuestions(updated)
  }

  function addQuestionField() {
    setQuestions([...questions, ''])
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {/* New survey form */}
      <section style={{ marginBottom: 40 }}>
        <h2>Create New Survey</h2>
        <form onSubmit={createSurvey}>
          <div>
            <label>Title:</label><br />
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Description:</label><br />
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <h3>Questions</h3>
          {questions.map((q, i) => (
            <div key={i}>
              <input
                placeholder={`Question ${i + 1}`}
                value={q}
                onChange={e => updateQuestion(i, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addQuestionField}>+ Add Question</button>

          <div style={{ marginTop: 20 }}>
            <button type="submit">Create Survey</button>
          </div>
        </form>
      </section>

      {/* Existing surveys */}
      {surveys.map(s => (
        <div key={s.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10 }}>
          <h3>{s.title}</h3>
          <button onClick={() => genReport(s.id)}>Generate report</button>
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
