import React from "react";
import jwt_decode from "jwt-decode"
import { sha256 } from "js-sha256"

const CLIENT_ID = "ae7f4206-cf16-4c1c-bd85-eb49f42f1e61"
const AUTHORIZE_URL = "https://intranet.nbscmanlys-h.schools.nsw.edu.au/oauth/v2.0/authorize"
const TOKEN_URL = "https://intranet.nbscmanlys-h.schools.nsw.edu.au/oauth/v2.0/token"
const PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuW8t9XnTRsnKBEL2A6Cq\
3nS1cuuTnU9PO6oTjPIpMfJD34JGFv5wfzJDNe/rkXdW7IH5zK2MoDMpiQNGYCIR\
nSI9rOert4d06n2O/ZmR0y4iXz12g6txHPmxzpokDZx5FJsD8xNGYTQX25ZGooTH\
zlAzlI2mFT7NDDp5Uy48KSdP5eIzvHypJXEX0pTLQsY1upoHgyLX1yQbo3pvVAA+\
UCvVp6RhQ8rucf0tw0S7VJg9zLrxngtJbnMc+KVQMUp5vuQbD91M2hR9hfifDgX6\
f8aw46ZhQnCfi8SZaq8wGayFCTiIYq4h+TjMPTWCMXp/nIyKTZ/QmHAb3lXxRjat\
KwIDAQAB\
-----END PUBLIC KEY-----"

function checkClaim(name: string): false | string | undefined {
    let storedClaims = localStorage.getItem("claims")
    if (storedClaims === null) return false
    let claims = JSON.parse(storedClaims)
    return !(name in claims) ? undefined : claims[name]
}

function checkUserInfo(name: string): false | string | undefined {
    let storedInfo = localStorage.getItem("userInfo")
    if (storedInfo === null) return false
    let userInfo = JSON.parse(storedInfo)
    return !(name in userInfo) ? undefined : userInfo[name]
}

interface ClaimTypes {
    exp: number,
    sub: string,
    scope: string,
}

export const claims: ClaimTypes = new Proxy<ClaimTypes | {}>({}, { get: (target, prop: string, receiver) => checkClaim(prop) }) as ClaimTypes


function now() {
    let milli = (new Date()).getTime()
    return milli / 1000
}

function buf2hex(buffer: Uint8Array) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

function arrayBufferToBase64( buffer: ArrayBuffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function sha256asBase64(str: string) {
    let hash = sha256.create();
    hash.update(str);
    let buf = hash.arrayBuffer();
    return arrayBufferToBase64(buf)
}

class OAuth extends React.Component<{ children: React.ReactNode }> {

    connecting = false

    getCode() {
        if (localStorage.getItem("accessToken") && claims.exp > now()) { return }

        let urlSearchParams = new URLSearchParams(window.location.search);
        let query = Object.fromEntries(urlSearchParams);

        if (query.code !== undefined && query.state !== undefined && localStorage.getItem("state") === query.state) {
            // get code and state from url, check if state from url is same as from localstorage
            // return!!!!!!!!! code
            localStorage.removeItem("state")

            let url = new URL(window.location.href)
            url.searchParams.delete("code")
            url.searchParams.delete("state")
            window.history.replaceState({}, document.title, url)

            return query.code
        }

        let buf = new Uint8Array(16);
        window.crypto.getRandomValues(buf)
        let state = buf2hex(buf)
        // store that in localstorage
        localStorage.setItem("state", state)

        window.crypto.getRandomValues(buf)
        let codeVerifier = buf2hex(buf)
        // store that in local storage
        localStorage.setItem("codeVerifier", codeVerifier)

        let url = new URL(AUTHORIZE_URL); // define that as a constant
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", CLIENT_ID);
        url.searchParams.set("state", state);
        url.searchParams.set("code_challenge", sha256asBase64(codeVerifier)); //implement that
        url.searchParams.set("code_challenge_method", "S256");
        // add all the other search params, response_type, client_id, state, code_challenge, code_challenge_method

        // console.log("redir: ", url.toString())
        window.location.href = url.toString();
        return null
    }

    getUserInfo() {

    }

    componentDidMount() {
        console.log("Mount")
        if (this.connecting) return
        if (localStorage.getItem("accessToken") && claims.exp > now()) { console.log("EXIT"); return }

        let code = this.getCode();
        if (!code) { return }

        let codeVerifier = localStorage.getItem("codeVerifier")
        localStorage.removeItem("codeVerifier")

        if (!codeVerifier) throw new Error("Code Verif or something is falsey")

        let formData = new FormData();
        formData.append("grant_type", "authorization_code");
        formData.append("client_id", CLIENT_ID); // store this as a .env variable
        formData.append("code", code);
        formData.append("code_verifier", codeVerifier); // this should be the thing you dynamically created (before the hash)

        let options: RequestInit = {
            "method": "POST",
            "body": formData,
            "mode": "cors"
        };

        this.connecting = true

        fetch(TOKEN_URL, options)
            .then((response) => response.json())
            .then((payload) => {
                let accessToken = payload["access_token"]
                let claims = jwt_decode(accessToken)
                localStorage.setItem("accessToken", accessToken)
                localStorage.setItem("claims", JSON.stringify(claims))
                localStorage.removeItem("userInfo")
                console.log("WORKS")
            })
            .then(() => {
                this.connecting = false
                this.forceUpdate()
            })

        // fetch token from TOKEN_URL and await its return - then do a force_update
    }

    render() {
        if (localStorage.getItem("accessToken") && claims.exp && claims.exp > now()) {
            return <>{this.props.children}</>
        }
        return <h1>Loading OAuth2 Login...</h1>;
    }
}

export default OAuth