import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Oauth, { claims } from "../../oauth";
import { Error, Notice, Warning } from '../../components/Alerts';
import TextInput from '../../components/Input';
import GoogleIcon from "../../components/Icons";
import TextEditor from '../../components/TextEditor';
import UploadFile from "../../components/UploadFiles";
import '../../scss/pages/modify-article.scss';

const ADMINS = JSON.parse(process.env.REACT_APP_ADMINS as string)
const ILP_API_URL = process.env.REACT_APP_ILP_API as string

function now() {
    let milli = (new Date()).getTime()
    return milli / 1000
}

const ShowSharedUsers = (props: { article: any, onDelete: any }) => {
    let student_arr = []
    for (let i = 0; i < props.article.students.length; i++) {
        const student = {
            id: props.article.students[i],
            name: props.article.authors[i]
        }
        let button = (i) ? <button onClick={() => { props.onDelete(student.id) }}><GoogleIcon name="delete" /></button> : null
        student_arr.push(
            <li key={student.id}>{button}  {student.name} ({student.id})</li>
        )
    }

    return <ul>{student_arr}</ul>
}

const ModifyArticle = () => {
    return <Oauth>
        <ArticleModificationPanel />
    </Oauth>
}

const TextEditorWrapper = (props: { setHtml: any, defaultValue?: string }) => {
    // const [html, setHtml] = useState<string>();
    // L ok then
    return (
        <div>
            {/* <br />
            <br />
            <textarea id='text-editor-content-holder' name='content' value={html} style={{display: 'hidden'}} /> */}

            {/* @ts-ignore */}
            <TextEditor htmlGetter={(htmlOutput: string) => props.setHtml(htmlOutput)} defaultValue={props.defaultValue} />
        </div>
    )
}

const ArticleModificationPanel = () => {
    const [loading, setLoading] = useState<string | null>("Loading Article Info")
    const [error, setError] = useState<string | null>(null)
    const [article, setArticle] = useState<any | null>(null)
    const [unchangedArticle, setUnchangedArticle] = useState<any | null>(null)
    const [shareUser, setShareUser] = useState<string>("")
    const [originalHtml, originalSetHtml] = useState<string | undefined>(undefined)
    const [html, setHtml] = useState<string | null>(null)
    const [warning, setWarning] = useState<string | null>(null)
    const { id } = useParams()

    function getArticleHtml() {
        if (claims.exp < now()) {
            window.location.reload()
            return
        }

        const request_headers: Record<string, string> = {
            'Authorization': "Bearer " + localStorage.getItem("accessToken") as string
        }

        fetch(`${ILP_API_URL}articles/upload/retrieve/${id}/index`, {
            method: 'GET',
            headers: request_headers
        })
            .then((response) => {
                if (response.status === 200)
                    response.text().then((html) => {
                        originalSetHtml(html)
                        setHtml(html)
                    })
                else if (response.status === 404) {
                    setLoading(null)
                    originalSetHtml("<p><br></p>")
                    setHtml("<p><br></p>")
                }
                else {
                    response.text().then((text) => { setLoading(null); setError(text) })
                }
            })
    }

    function handleUnfinishedReq(reqInfo: any) {
        console.log(reqInfo)
        if (reqInfo.type === 'share') {
            shareArticle(reqInfo.user, true)
        } else if (reqInfo.type === 'unshare') {
            unshareArticle(reqInfo.user, true)
        } else if (reqInfo.type === 'updateTextEditor') {
            updateTextEditorArticle(reqInfo.html, true)
        }
    }

    useEffect(() => {

        console.log(id)

        if (claims.exp < now()) {
            window.location.reload()
            return
        }

        const unfinishedReq = localStorage.getItem("api_req")
        if (unfinishedReq) {
            handleUnfinishedReq(JSON.parse(unfinishedReq))
            localStorage.removeItem("api_req")
            return
        }

        const request_headers: Record<string, string> = {
            'Authorization': "Bearer " + localStorage.getItem("accessToken") as string
        }

        fetch(ILP_API_URL + "articles/" + id, {
            method: 'GET',
            headers: request_headers
        })
            .then((response) => {
                if (response.status === 200)
                    response.json().then((article) => {
                        setLoading(null)
                        setArticle(article)
                        setUnchangedArticle(article)
                        if (!article.students.includes(claims.sub)) {
                            if ((claims.scope && claims.scope.includes('nbscmanlys-h:teacher')) ||
                                (claims.sub && ADMINS.includes(claims.sub))) {
                                setWarning("You do not own this article! Please do not edit this article unless strictly necessary.")
                                getArticleHtml()
                            }
                            else
                                setError("You do not have edit access to this article")
                        } else {
                            getArticleHtml()
                        }
                    })
                else {
                    response.text().then((text) => { setLoading(null); setError(text) })
                }
            })
    }, [id])

    function handleInputChange(event: any) {
        const name: 'title' | 'category' | 'tags' | 'description' = event.target.name;
        const value: string = event.target.value
        let newArticleInfo = { ...article }
        if (name === 'tags') {
            let tags = value.trim().split(",")
            for (let i = 0; i < tags.length; i++) {
                tags[i] = tags[i].trim()
            }
            newArticleInfo.tags = tags
            setArticle(newArticleInfo);
        } else {
            newArticleInfo[name] = value
            setArticle(newArticleInfo);
        }
    }

    function handleShareArticleInput(event: any) {
        const value: string = event.target.value
        setShareUser(value)
        if (error) setError(null)
    }

    function shareArticle(userId: string, reloadPage = false) {
        if (claims.exp < now()) {
            localStorage.setItem("api_req", JSON.stringify({ type: "share", user: userId }))
            window.location.reload()
            return
        }

        const request_headers: Record<string, string> = {
            'Authorization': "Bearer " + localStorage.getItem("accessToken") as string
        }

        setLoading("Sharing Article...")

        fetch(`${ILP_API_URL}articles/modify/${id}/share/${userId}`, {
            method: 'GET',
            headers: request_headers
        })
            .then((response) => {
                if (response.status === 200)
                    response.json().then((info) => {
                        if (reloadPage) {
                            window.location.reload()
                            return
                        }
                        let newArticle = article
                        newArticle.students = info.students
                        newArticle.authors = info.authors
                        setArticle(newArticle)
                        setLoading(null)
                    })
                else {
                    response.text().then((text) => { setLoading(null); setError(text) })
                }
            })
    }

    function unshareArticle(userId: string, reloadPage = false) {
        if (claims.exp < now()) {
            localStorage.setItem("api_req", JSON.stringify({ type: "unshare", user: userId }))
            window.location.reload()
            return
        }

        const request_headers: Record<string, string> = {
            'Authorization': "Bearer " + localStorage.getItem("accessToken") as string
        }

        setLoading("Sharing Article...")

        fetch(`${ILP_API_URL}articles/modify/${id}/unshare/${userId}`, {
            method: 'GET',
            headers: request_headers
        })
            .then((response) => {
                if (response.status === 200)
                    response.json().then((info) => {
                        if (reloadPage) {
                            window.location.reload()
                            return
                        }
                        let newArticle = article
                        newArticle.students = info.students
                        newArticle.authors = info.authors
                        setArticle(newArticle)
                        setLoading(null)
                    })
                else {
                    response.text().then((text) => { setLoading(null); setError(text) })
                }
            })
    }

    function saveArticleMetaChanges(article: any) {
        if (claims.exp < now()) {
            localStorage.setItem("api_req", JSON.stringify({ type: "updateArticle", article: article }))
            window.location.reload()
            return
        }

        const request_headers: Record<string, string> = {
            'Authorization': "Bearer " + localStorage.getItem("accessToken") as string,
            'Content-Type': 'application/json'
        }

        setLoading("Updating Article...")

        fetch(`${ILP_API_URL}articles/modify/${id}`, {
            method: 'POST',
            headers: request_headers,
            body: JSON.stringify(article)
        })
            .then((response) => {
                if (response.status === 200)
                    response.json().then((info) => {
                        setArticle(info)
                        setUnchangedArticle(info)
                        setLoading(null)
                        setError(null)
                    })
                else {
                    response.text().then((text) => { setLoading(null); setError(text) })
                }
            })
    }

    if (loading)
        return <main><h1>{loading}</h1></main>

    if (!article)
        return <main><h1>Loading Article</h1></main>

    function updateTextEditorArticle(html: string | null, reloadPage = false) {
        if (!html) return

        if (claims.exp < now()) {
            localStorage.setItem("api_req", JSON.stringify({ type: "updateTextEditor", html: html }))
            window.location.reload()
            return
        }

        const request_headers: Record<string, string> = {
            'Authorization': "Bearer " + localStorage.getItem("accessToken") as string
        }

        setLoading("Updating Article...")

        fetch(`${ILP_API_URL}articles/upload/${id}/index`, {
            method: 'POST',
            headers: request_headers,
            body: html
        })
            .then((response) => {
                if (response.status === 200) {
                    if (reloadPage) {
                        window.location.reload()
                        return
                    }
                    originalSetHtml(html)
                    setLoading(null)
                }
                else {
                    response.text().then((text) => { setLoading(null); setError(text) })
                }
            })
    }

    const linkTextArea = (article.link) ? <TextInput id='link' label='Article Link' onChange={handleInputChange} required defaultValue={article.link} /> : null

    console.log(html, originalHtml)

    const modify = (article.type === 'textEditor' && originalHtml) ? <div>
        <TextEditorWrapper setHtml={(html: string) => { setHtml(html) }} defaultValue={originalHtml} />
        {(html !== originalHtml) ? <button onClick={(value: any) => updateTextEditorArticle(html)}>Save</button> : null}
    </div>
        : null

    return (
        <main id='main'>
            <h1 className="title">Modify Article</h1>
            {(error) ? <Error>(Server) {error}</Error> : null}
            {(warning) ? <Warning>{warning}</Warning> : null}

            <div className="article-modify">
                <div className="meta-info">
                    <div>
                        <h2>Meta Information</h2>
                        <h3>Article Type: {article.type}</h3>
                        <TextInput id="title" label="Title" defaultValue={article.title} onChange={handleInputChange} />
                        <br />
                        <br />

                        {((claims.scope && claims.scope.includes('nbscmanlys-h:teacher')) ||
                                (claims.sub && ADMINS.includes(claims.sub))) ?
                            <div>
                                <Notice>You can modify this becuase you are an admin. The higher the value the higher it shows up on the home page.</Notice>
                                <TextInput id="favoured" label="Favoured Article Score" defaultValue={article.title} onChange={handleInputChange} />
                                <br />
                                <br />
                            </div> : null
                            }

                        <label htmlFor='category'>Category</label>
                        <br />
                        <div className='select-wrapper'>
                            <select name='category' id='category' defaultValue={article.category} onChange={handleInputChange} required>
                                <option value='art'>Art</option>
                                <option value='design'>Design</option>
                                <option value='entrepreneurial'>Entrepreneurial</option>
                                <option value='research'>Research</option>
                                <option value='subjectSpecific'>Subject-Specific</option>
                            </select>
                        </div>
                        <br />
                        <br />

                        <TextInput id='tags' label='Tags' onChange={handleInputChange} defaultValue={article.tags.join(', ')} />

                        <br />
                        <br />

                        <label htmlFor="description" className='required'>Description (50-150 words)</label>

                        <br />
                        <textarea name="description" id="description" onChange={handleInputChange} defaultValue={article.description} required></textarea>
                        <br />
                        <br />
                        <TextInput id='question' label='Driving/Inquiry Question' onChange={handleInputChange} required defaultValue={article.question} />

                        <br />
                        <br />

                        {linkTextArea}
                        <br />
                        <br />

                        {(JSON.stringify(unchangedArticle) !== JSON.stringify(article)) ? <button onClick={() => saveArticleMetaChanges(article)}>Save Meta Data Changes</button> : null}
                    </div>

                    <div>
                        <h2>Article Ownership</h2>
                        <ShowSharedUsers article={article} onDelete={unshareArticle} />
                        <br />
                        <br />
                        <TextInput
                            id='adduser'
                            onChange={handleShareArticleInput}
                            label='Share Article with edit access:'
                            placeholder="Username e.g. oscar.pritchard2"
                        />
                        <br />
                        {(shareUser) ? <button onClick={() => shareArticle(shareUser)}>Share</button> : null}
                    </div>
                </div>



                <div className="edit-wizard">
                    {modify}
                </div>
            </div>
        </main>
    )
}

export default ModifyArticle;