import { useEffect, useState } from "react";
import { Error } from "../../components/Alerts";
import GoogleIcon from "../../components/Icons";
import OAuth, { claims } from "../../oauth";

import '../../scss/pages/owned-articles.scss';
import ArticlePreview from "../../components/Article";

const ILP_API_URL = process.env.REACT_APP_ILP_API as string

function now() {
    let milli = (new Date()).getTime()
    return milli / 1000
}

const OwnedArticlesDisplay = () => {
    const [loading, setLoading] = useState<string | null>("Loading Owned Articles")
    const [articles, setArticles] = useState<any[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        if (claims.exp < now()) {
            window.location.reload()
            return
        }

        const request_headers: Record<string, string> = {
            'Authorization': "Bearer " + localStorage.getItem("accessToken") as string
        }

        fetch(ILP_API_URL + "articles/owned", {
            method: 'GET',
            headers: request_headers
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
    if (articles === null) return <h1>Loading Articles...</h1>

    let articleDisplay = []

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i]
        const id = article._id["$oid"]
        articleDisplay.push(
            <ArticlePreview key={id}
                title={article.title}
                students={article.students}
                authors={article.authors}
                description={article.description}
                url={article.link || `https://ilp.ints.dev/${id}`}
                id={id}
            />
        )
    }



    return <main id="main">
        <h1 className='title'>Owned Articles</h1>
        {articleDisplay}
    </main>
}

const OwnedArticles = () => {
    return (
        <OAuth>
            <OwnedArticlesDisplay />
        </OAuth>
    )
}

export default OwnedArticles;