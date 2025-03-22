import { useState } from 'react'
import './App.css'
import useApiClient from './hooks/useApiClient'

function App() {
  const apiClient = useApiClient();
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
          <button type="button" title='click me' onClick={() => apiClient.fetchResults(query)} >
            Click Me
          </button>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
