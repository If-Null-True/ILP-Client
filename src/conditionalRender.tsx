import NeedUserInfo, { userInfo } from './userinfo';
import OAuth, { claims } from './oauth';
import { ReactElement } from 'react';

function now() {
    let milli = (new Date()).getTime()
    return milli / 1000
}

interface ConditionalRenderingProps {
    ifLoggedIn: ReactElement<any, any>,
    notLoggedIn: ReactElement<any, any>,
}

const ConditionalRender = (props: ConditionalRenderingProps) => {
    if (claims.exp && claims.exp > now()) {
        return <NeedUserInfo>
            <>{props.ifLoggedIn}</>
        </NeedUserInfo>
    } else {
        return props.notLoggedIn
    }
}

export default ConditionalRender