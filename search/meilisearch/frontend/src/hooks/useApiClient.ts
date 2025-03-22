const useApiClient = () => {
  const fetchResults = async (query: string) => {
    const result = await fetch("http://localhost:3000?query=" + query);
    if (!result.ok) {
      throw new Error("Whoopsie");
    }

    const data = await result.json();

    console.log(data);
  }

  return { fetchResults };
}

export default useApiClient;