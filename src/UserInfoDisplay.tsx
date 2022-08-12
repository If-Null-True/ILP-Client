import React from "react";
import { claims } from "./oauth";
const API_URL = "https://intranet.nbscmanlys-h.schools.nsw.edu.au/oauth/api"

interface UserInfo {
    userId: string,
    displayName: string,
    emailAddress: string,
    scope: string,
}

class UserInfoDisplay extends React.Component<{}, { userInfo: UserInfo | null }> {

    constructor(props: {}) {
        super(props)

        this.state = {
            userInfo: null,
        };
    }

    componentDidMount() {
        let accessToken = localStorage.getItem("accessToken");
        let options: RequestInit = {
            "mode": "cors",
            "headers": { "Authorization": "Bearer " + accessToken }
        };
        fetch(API_URL + "/user/" + claims.sub, options)
            .then((response) => response.json())
            .then((payload) => {
                return {
                    userId: payload["user_id"],
                    displayName: payload["display_name"],
                    emailAddress: payload["email_address"],
                    scope: payload["scope"]
                };
            })
            .then((result) => {
                this.setState({
                    userInfo: result
                });
            });
    }

    render() {
        if (this.state.userInfo) {
            return <div>
                <p>{this.state.userInfo.displayName}</p>
                <p>{this.state.userInfo.emailAddress}</p>
                <p>{this.state.userInfo.scope}</p>
                <p>{this.state.userInfo.userId}</p>
            </div>
        }
    }

}

export default UserInfoDisplay;