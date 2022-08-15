import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConditionalRender from './conditionalRender';
import ReadClaimsExample from './displayClaims';

import TestLoginPage from './test'

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<TestLoginPage />} />
                <Route path='/auth' element={<TestLoginPage />} />
                <Route path='/cond' element={
                    <ConditionalRender
                        ifLoggedIn={<ReadClaimsExample/>}
                        notLoggedIn={<h1>You are not logged in!</h1>}
                    />
                } />
                <Route path='*' element={<h1>404 Unknown Page</h1>} />
            </Routes>
        </Router>
    )
}

export default App;
