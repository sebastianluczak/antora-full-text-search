import { useState } from "react";

type MeilisearchHit = {
  id: number;
  mainTitle: string;
  mainVersion: string;
  content: string;
  path: string;
  _formatted: MeilisearchHit;
}

const useApiClient = () => {
  const [queryResults, setQueryResults] = useState<MeilisearchHit[]>([]);

  const fetchResults = async (query: string) => {
    const result = await fetch("http://localhost:3000?query=" + query);
    if (!result.ok) {
      throw new Error("Whoopsie");
    }

    const data = await result.json();

    console.log(data.hits);

    setQueryResults(data.hits);
  }

  return { fetchResults, queryResults };
}

export default useApiClient;