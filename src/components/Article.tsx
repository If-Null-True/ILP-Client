import { claims } from "../oauth";
import GoogleIcon from "./Icons";

console.log(process.env.REACT_APP_ADMINS as string)
const ADMINS = JSON.parse(process.env.REACT_APP_ADMINS as string)

interface ArticlePreviewProps {
    id: string,
    title: string,
    authors: string[],
    students: string[],
    description: string,
    url: string,
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
    let editLink = null;
    console.log(props, claims.scope, claims.sub)
    if ((claims.scope && claims.scope.includes('nbscmanlys-h:teacher') ||
        (claims.sub && ADMINS.includes(claims.sub))) ||
        (claims.sub && props.students.includes(claims.sub))) {
        editLink = (
            <a className='edit' href={`/article/modify/${props.id}`}>
                <GoogleIcon name='edit' />
            </a>
        )
    }

    return (
        <div className="article-preview">
            <div className="information">
                {editLink}
                <h2>{props.title}</h2>
                <div className="authors">
                    by {getAuthorString(props.authors)}
                </div>
                <p className="description">
                    {props.description}
                </p>
                <a href={props.url}>See More</a>
            </div>
        </div>
    )
};

export default ArticlePreview;