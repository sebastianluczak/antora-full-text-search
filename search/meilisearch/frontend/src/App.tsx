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
      <div className="query-results">
        {queryResults && queryResults.map((hitObject) => (
          <div
            className='query-result'
            key={hitObject.id}
            dangerouslySetInnerHTML={{
              __html: `
              <h2>${hitObject.mainTitle} ${hitObject.mainVersion}</h2>
              <small>${hitObject.path}</small>
              <hr />
              ${hitObject._formatted.content}
              `,
            }}
          />
        ))}
      </div >
    </>
  )
}

export default App
