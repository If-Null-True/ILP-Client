import { claims } from './oauth';

const ReadClaimsExample = (props: {}) => {
    return <div>
        <p>{claims.sub}</p>
        <p>{claims.scope}</p>
    </div>
}

export default ReadClaimsExample