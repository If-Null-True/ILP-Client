import { userInfo } from './userinfo';

const ReadUserInfoExample = (props: {}) => {
    return <div>
        <p>{userInfo.userId}</p>
        <p>{userInfo.displayName}</p>
        <p>{userInfo.emailAddress}</p>
        <p>{userInfo.scope}</p>
    </div>
}

export default ReadUserInfoExample