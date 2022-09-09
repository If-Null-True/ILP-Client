import { useState, useEffect } from "react";
import { Error } from "../components/Alerts";
import ArticlePreview from "../components/Article";

const ILP_API_URL = process.env.REACT_APP_ILP_API as string

const Cohort = () => {
    let cohort = Number(window.location.pathname.split('/')[2].slice(1))
    console.log(cohort);

    const [loading, setLoading] = useState<string | null>("Loading G" + cohort + " Articles")
    const [articles, setArticles] = useState<any[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(ILP_API_URL + `articles/all?date_start=20${cohort - 2}-01-01&date_end=20${cohort - 1}-01-01`, {
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
    }, [])

    if (error) return <Error>{error}</Error>
    if (loading) return <h1>{loading}</h1>
    if (articles === null) return <h1>Loadin Articles...</h1>

    let articleDisplay = []

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
        <h1 className="title">G{cohort} Projects</h1>
        {articleDisplay}
      </main>
    )
}

export default Cohort;