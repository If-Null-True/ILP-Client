import React from "react";
import { claims } from "./oauth";
const API_URL = "https://intranet.nbscmanlys-h.schools.nsw.edu.au/oauth/api"

function checkUserInfo(name: string): false | string | undefined {
    let storedUserInfo = localStorage.getItem("userInfo")
    if (storedUserInfo === null) return false
    let claims = JSON.parse(storedUserInfo)
    return !(name in claims) ? undefined : claims[name]
}

export const userInfo: NeedUserInfo = new Proxy<NeedUserInfo | {}>({}, { get: (target, prop: string, receiver) => checkUserInfo(prop) }) as NeedUserInfo

interface NeedUserInfo {
    userId: string,
    displayName: string,
    emailAddress: string,
    scope: string,
}

class NeedUserInfo extends React.Component<{ children: React.ReactNode }> {

    connecting = false

    componentDidMount() {
        if (userInfo.userId) return
        if (this.connecting) return

        this.connecting = true

        let accessToken = localStorage.getItem("accessToken");
        let options: RequestInit = {
            "mode": "cors",
            "headers": { "Authorization": "Bearer " + accessToken }
        };
        fetch(API_URL + "/user/" + claims.sub, options)
            .then((response) => response.json())
            .then((payload) => {
                localStorage.setItem("userInfo", JSON.stringify({
                    userId: payload["user_id"],
                    displayName: payload["display_name"],
                    emailAddress: payload["email_address"],
                    scope: payload["scope"]
                }))
                console.log("UPDATED")
            })
            .then(() => {
                this.connecting = false
                this.forceUpdate()
            });
    }

    render() {
        if (userInfo.userId) {
            return <>{this.props.children}</>
        }
        return <h1>Loading UserInfo...</h1>;
    }

}

export default NeedUserInfo;