import { claims } from "../oauth";
import { Notice } from "./Alerts";
import GoogleIcon from "./Icons";

console.log(process.env.REACT_APP_ADMINS as string)
const ADMINS = JSON.parse(process.env.REACT_APP_ADMINS as string)

type Categories = "art" | "entrepreneurial" | "research" | "design" | "subjectSpecific"
type ArticleTypes = "websiteFiles" | "websiteLink" | "textEditor"

interface ArticleType {
    _id: { "$oid": string },
    title: string,
    authors: string[],
    students: string[],
    tags: string[],
    category: Categories,
    favoured: number,
    description: string,
    type: ArticleTypes,
    created: Date,
    link?: string,
}

interface ArticlePreviewProps {
    article: ArticleType,
    showFavouredScores?: Boolean
}

function getAuthorString(authors: string[]) {
    if (authors.length === 1) {
        return authors[0]
    } else if (authors.length === 2) {
        return authors[0] + ' and ' + authors[1];
    }
    const last = authors.pop();
    return authors.join(', ') + ' and ' + last;
}

const ArticlePreview = (props: ArticlePreviewProps) => {
    const id = props.article._id["$oid"]
    const isAdminOrTeacher = (claims.scope && claims.scope.includes('nbscmanlys-h:teacher')) ||
        (claims.sub && ADMINS.includes(claims.sub))
    const canEdit = isAdminOrTeacher ||
        (claims.sub && props.article.students.includes(claims.sub))
    let editLink, favoured = null;
    console.log(props, claims.scope, claims.sub)
    if (canEdit) {
        editLink = (
            <a className='edit btn' href={`/article/modify/${id}`}>
                <GoogleIcon name='edit' />
            </a>
        )
        if (props.article.favoured !== 0 && props.showFavouredScores)
            favoured = (
                <Notice>This article has a Non-Default Favoured Score of {props.article.favoured}</Notice>
            )
    }

    return (
        <div className="article-preview">
            <div className="information">
                {editLink}
                <h2>{props.article.title}</h2>
                <div className="authors">
                    by {getAuthorString(props.article.authors)}
                </div>
                <p className="description">
                    {props.article.description}
                </p>
                <a href={props.article.link || `https://ilp.ints.dev/${id}`}>See More</a>
                {favoured}
            </div>
        </div>
    )
};

export default ArticlePreview;