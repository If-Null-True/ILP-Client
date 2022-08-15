import logo from './logo.svg';
import './App.css';
import OAuth from './oauth';
import NeedUserInfo, {userInfo} from './userinfo';
import ReadClaimsExample from './displayClaims';
import ReadUserInfoExample from './displayUserInfo';

function TestLoginPage() {
    return (
        <OAuth>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Info from JWT:</h2>
                    <ReadClaimsExample/>
                    <br></br>
                    <h2>Info from school OAuth API:</h2>
                    <NeedUserInfo>
                        <ReadUserInfoExample/>
                    </NeedUserInfo>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        </OAuth>
    );
}

export default TestLoginPage