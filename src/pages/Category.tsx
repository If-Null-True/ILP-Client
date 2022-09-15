import { useState, useEffect } from "react";
import { Error } from "../components/Alerts";
import ArticlePreview from "../components/Article";

const ILP_API_URL = process.env.REACT_APP_ILP_API as string

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const Category = () => {
    let category = window.location.pathname.split('/')[2]
    console.log(category);

    const [loading, setLoading] = useState<string | null>("Loading" + category + "Articles")
    const [articles, setArticles] = useState<any[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(ILP_API_URL + "articles/category/" + category, {
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
    }, [category])

    if (error) return <Error>{error}</Error>
    if (loading) return <h1>{loading}</h1>
    if (articles === null) return <h1>Loadin Articles...</h1>

    let articleDisplay = []

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i]
        const id = article._id["$oid"]
        articleDisplay.push(
          <ArticlePreview key={id}
            article={article}
          />
      )
    }



    return (
      <main id='main'>
        <h1 className="title">{toTitleCase(category)} Projects</h1>
        {articleDisplay}
      </main>
    )
}

export default Category;