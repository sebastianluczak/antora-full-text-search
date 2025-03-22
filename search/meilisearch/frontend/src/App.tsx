import { useState } from 'react'
import './App.css'
import useApiClient from './hooks/useApiClient'

function App() {
  const { fetchResults, queryResults } = useApiClient();
  const [query, setQuery] = useState("")

  return (
    <>
      <div className="card">
        <input
          type="text"
          value={query}
          onChange={(val) => setQuery(val.target.value)}
        />
        <p>
          <button type="button" title='click me' onClick={() => fetchResults(query)} >
            Click Me
          </button>
        </p>
      </div>
      <p className="read-the-docs">
        {queryResults && queryResults.map((hitObject) => (
          <li key={hitObject.id}>{hitObject.content}</li>
        ))}
      </p>
    </>
  )
}

export default App
