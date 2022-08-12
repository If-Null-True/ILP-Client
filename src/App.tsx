import logo from './logo.svg';
import './App.css';
import OAuth from './oauth';
import UserInfoDisplay from './UserInfoDisplay';
import ReadClaimsExample from './displayClaims';

function App() {
    return (
        <OAuth>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Info from JWT:</h2>
                    <ReadClaimsExample/>
                    <br></br>
                    <h2>Info from school OAuth API:</h2>
                    <UserInfoDisplay/>
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

export default App;
