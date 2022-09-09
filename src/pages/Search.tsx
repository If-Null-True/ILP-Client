import { useState, useEffect } from "react";
import { Error } from "../components/Alerts";
import ArticlePreview from "../components/Article";
import TextInput from "../components/Input";

const ILP_API_URL = process.env.REACT_APP_ILP_API as string

const Search = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [query, setQuery] = useState<string | null>(urlParams.get('q'));
  console.log(query);

  const [loading, setLoading] = useState<string | null>("Type to Search")
  const [articles, setArticles] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) return;
    // if (query.length < 3) return;

    setLoading("Searching for Articles...")

    fetch(ILP_API_URL + "articles/search/" + query, {
      method: 'GET'
    })
      .then((response) => {
        if (response.status === 200)
          response.json().then((articles) => {
            setLoading(null)
            setArticles(articles)
          })
        else {
          response.text().then((text) => { setLoading(null); setError(text) })
        }
      })
  }, [query])

  if (error) return <Error>{error}</Error>

  let articleDisplay = []

  if (articles)
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      const id = article._id["$oid"]
      articleDisplay.push(
        <ArticlePreview key={id}
          title={article.title}
          authors={article.authors}
          description={article.description}
          url={article.link || `https://ilp.ints.dev/${id}`}
          id={id}
        />
      )
    }



  return (
    <main id='main'>
      <h1 className="title">Searching for "{query}"</h1>
      <form action="/search" method='get'>
        <TextInput id='q' label='' placeholder="Search projects" onChange={(event: any) => {
          setQuery(event.target.value);
        }} />
      </form>


      {(loading) ? <h1>{loading}</h1> : null}
      {articleDisplay}
    </main>
  )
}

export default Search;