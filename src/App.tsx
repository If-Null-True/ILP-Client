import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConditionalRender from './conditionalRender';
import ReadClaimsExample from './displayClaims';

// Stylesheets
import './scss/main.scss';

// Pages / Components
import SidebarNav, { CollapsingNav } from './components/Nav';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Category from './pages/Category';
import Search from './pages/Search';
import Logout from './pages/Logout';
import Login from './pages/Login';
import ArticleCreate from './pages/article/CreateArticle';

import TestLoginPage from './test'
import ModifyArticle from './pages/article/modify';
import Oauth from './oauth';
import OwnedArticles from './pages/article/ownedArticles';
import Cohort from './pages/Cohort';

function App() {
    return (
        <Router>
            <CollapsingNav />
            <Routes>
                {/* General Pages */}
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<ContactUs />} />
                <Route path='/contact-us' element={<ContactUs />} />
                <Route path='/category/*' element={<Category />} />
                <Route path='/cohort/*' element={<Cohort />} />
                <Route path='/search' element={<Search />} />

                {/* Accounts */}
                <Route path='/auth' element={<Login />} />
                <Route path='/admin/index.php/dev/console/index.asp/accounts/manage/logout/index.html/logout.css/login' element={<Logout />} />
                <Route path='/thispagedoesnotexist' element={<Logout />} />

                {/* Articles */}
                <Route path='/article/owned' element={<OwnedArticles />} />
                <Route path='/article/create' element={<ArticleCreate />} />
                <Route path='/article/modify/:id' element={<ModifyArticle />} />


                {/* Utility */}
                <Route path='/test' element={<TestLoginPage />} />
                <Route path='/cond' element={
                    <ConditionalRender
                        ifLoggedIn={<ReadClaimsExample/>}
                        notLoggedIn={<h1>You are not logged in!</h1>}
                    />
                } />

                {/* Catch-All */}
                <Route path='*' element={<main id="main"><h1>404 Unknown Page</h1></main>} />
            </Routes>
        </Router>
    )
}

export default App;
