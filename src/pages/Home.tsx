import { useState, useEffect } from "react";
import ArticlePreview from "../components/Article";
import { Error, Notice } from "../components/Alerts";
import { claims } from "../oauth";

const ILP_API_URL = process.env.REACT_APP_ILP_API as string
const ADMINS = JSON.parse(process.env.REACT_APP_ADMINS as string)

const Home = () => {
    const [loading, setLoading] = useState<string | null>("Loading Articles")
    const [articles, setArticles] = useState<any[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(ILP_API_URL + "articles/favoured", {
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
    if (articles === null) return <h1>Loading Articles...</h1>

    let articleDisplay = []

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i]
        const id = article._id["$oid"]
        articleDisplay.push(
            <ArticlePreview key={id}
                article={article}
                showFavouredScores
            />
        )
    }

    const isAdmin = (claims.scope && claims.scope.includes('nbscmanlys-h:teacher')) ||
        (claims.sub && ADMINS.includes(claims.sub))

    return (
        <main id="main">
            <h1 className={'title txt-gr txt-gr-start-' + (Math.ceil(Math.random() * 5)) + ' txt-gr-end-' + (Math.ceil(Math.random() * 5))}>Independent Learning Project</h1>
            <h2 className='subtitle'>NBSC Manly Selective Campus</h2>
            {(isAdmin) ? <Notice>You are a teacher / admin and can see the 'favoured' score for each article</Notice> : null}
            {articleDisplay}
        </main>
    )
}

export default Home;