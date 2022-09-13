import { useState } from 'react';
import '../scss/components/nav.scss';
import '../scss/components/collapsing-nav.scss';
import ConditionalRender from '../conditionalRender';
import GoogleIcon from './Icons';
import Aria from './Aria';
import { userInfo } from '../userinfo';
import { claims } from '../oauth';



const YearGroup = (props: { gradYear: number }) => {
  let ilpYear = props.gradYear - 2; // Calculate when the given year would've done ILP
  let currentYear = Number(((new Date()).getFullYear() + '').slice(2, 4)); // Get the last two digits of the current year

  let grade;
  if (ilpYear > currentYear)
    grade = 'too young aiya tell the dev to fix'
  else if (ilpYear === currentYear)
    grade = 'Year 10'
  else if (ilpYear === currentYear - 1)
    grade = 'Year 11'
  else if (ilpYear === currentYear - 2)
    grade = 'Year 12'
  else
    grade = 'Graduated'

  return (
    <li>
      <a href={'/cohort/g' + props.gradYear} className='link'>
        G{props.gradYear} ({grade})
      </a>
    </li>
  )
}

const WhoCares = () => {
  return (
    <ul>
      <li className='text'>
        Signed in as <strong>{userInfo.displayName}</strong>
      </li>
      {
        (claims.scope.includes('student')) ?
          (<li>
            <a href='/article/create'>
              <GoogleIcon name='add' />
              Create a project
            </a>
          </li>) :
          null
      }
      {
        (claims.scope.includes('student')) ?
          (<li>
            <a href='/article/owned'>
              <GoogleIcon name='preview' />
              View your projects
            </a>
          </li>) :
          null
      }
    </ul>
  )
}



const CollapsingNav = () => {
  const [open, setOpen] = useState<Boolean>(false);

  return (
    <div id='main-nav'>
      <Aria focusable={true} href="#main" id="skip-main-nav-button">
        Skip to content
      </Aria>

      <button
        id='main-nav-button'
        aria-label='Open Navigation Button'
        onClick={() => setOpen(!open)}
        className={(open) ? 'open' : ''}
      >
        <GoogleIcon name={(open) ? 'close' : 'menu'} />
      </button>


      <nav className={(open) ? 'collapsing open' : 'collapsing'} id='main-menu' aria-label='Main Menu'>
        <ul>

          {/* ACCOUNT SUBMENU */}
          <li>
            <h2>
              <GoogleIcon name='account_circle' />
              Account
            </h2>

            <nav className='submenu' aria-label='Account Submenu'>
              <ConditionalRender
                ifLoggedIn={
                  <WhoCares />
                }
                notLoggedIn={
                  <ul>
                    <li>
                      <a href='/auth'>
                        <GoogleIcon name='login' />
                        Login
                      </a>
                    </li>
                  </ul>
                }
              />
            </nav>
          </li>


          <li className='divider'></li>


          {/* PAGES SUBMENU */}
          <li>
            <h2>
              <GoogleIcon name='article' />
              Pages
            </h2>

            <nav className='submenu' aria-label='Pages Submenu'>
              <ul>
                <li>
                  <a href='/'>
                    <GoogleIcon name='home' />
                    Home
                  </a>
                </li>
                <li>
                  <a href='/search'>
                    <GoogleIcon name='search' />
                    Search
                  </a>
                </li>
                {/* <li>
                  <a href='/about'>
                    <GoogleIcon name='info' />
                    About
                  </a>
                </li> */}
                {/* <li>
                  <a href='/contact-us'>
                    <GoogleIcon name='email' />
                    Contact Us
                  </a>
                </li> */}
              </ul>
            </nav>
          </li>


          <li className='divider'></li>


          {/* CATEGORIES SUBMENU */}
          <li>
            <h2>
              <GoogleIcon name='category' />
              Categories
            </h2>

            <nav className='submenu' aria-label='Categories Submenu'>
              <ul>
                <li>
                  <a href="/category/art">
                    <GoogleIcon name='brush' />
                    Art
                  </a>
                </li>
                <li>
                  <a href="/category/design">
                    <GoogleIcon name='design_services' />
                    Design
                  </a>
                </li>
                <li>
                  <a href="/category/entrepreneurial">
                    <GoogleIcon name='attach_money' />
                    Entrepreneurial
                  </a>
                </li>
                <li>
                  <a href="/category/research">
                    <GoogleIcon name='biotech' />
                    Research
                  </a>
                </li>
                <li>
                  <a href="/category/subjectSpecific">
                    <GoogleIcon name='extension' />
                    Subject-Specific
                  </a>
                </li>
              </ul>
            </nav>
          </li>


          <li className='divider'></li>


          {/* PAGES SUBMENU */}
          <li>
            <h2>
              <GoogleIcon name='calendar_month' />
              Cohorts
            </h2>

            <nav className='submenu' aria-label='Cohorts Submenu'>
              <YearGroup gradYear={24} />
            </nav>
          </li>

        </ul>

      </nav>

    </div>
  )
}



const SidebarNav = () => {
  return (
    <nav className="sidebar" id="main-menu" aria-label="Main Menu">
      <ul>
        <li>
          <button>
            <GoogleIcon name='account_circle' />
            <Aria>Account</Aria>
          </button>
          <nav className="submenu accounts" aria-label="Account Submenu">
            <ConditionalRender
              ifLoggedIn={
                <ul>
                  <li>
                    <a href="Visit">View your project</a>
                  </li>
                </ul>
              }
              notLoggedIn={
                <ul>
                  <li>
                    <a href="auth">
                      <span className="material-icons-outlined" role="presentation">login</span>
                      Login
                    </a>
                  </li>
                </ul>
              }
            />
          </nav>
        </li>

        <li className="divider" role="presentation">
          <hr />
        </li>

        <li>
          <a href="/">
            <GoogleIcon name='home' />
            <Aria>
              {(window.location.pathname === '/') ? "Current page:" : null}
              Home
            </Aria>
          </a>
        </li>

        <li>
          <button>
            <GoogleIcon name='search' />
            <Aria>Search</Aria>
          </button>
          <nav className="submenu search" aria-label="Search Submenu">
            <form action="search" method="get">
              <label htmlFor="search-bar">Search Projects</label>
              <input type="text" name="q" id="search-bar" placeholder="Type your query here and then press enter…" />
            </form>
          </nav>
        </li>

        <li>
          <button>
            <GoogleIcon name='more_horiz' />
            <Aria>More</Aria>
          </button>
          <nav className="submenu more" aria-label="More Options Submenu">
            <ul>
              <li>
                <a href="view.html?=">
                  <GoogleIcon name='info' />
                  About
                </a>
              </li>
              <li>
                <a href="accessibility.html">
                  <GoogleIcon name='accessibility' />
                  Accessibility
                </a>
              </li>
              <li>
                <a href="contact-us.html">
                  <GoogleIcon name='email' />
                  Contact Us
                </a>
              </li>
              {/* <li>
                <a href="https://github.com/If-Null-True/ilp-website">
                  <img src="../images/github-64.png" alt="" />
                  GitHub
                </a>
              </li> */}
            </ul>
          </nav>
        </li>

        <li className="divider" role="presentation">
          <hr />
        </li>

        <li className="labelled">
          <button>
            <span className="name">Years</span>
            <GoogleIcon name='calendar_month' />
          </button>
          <nav className="submenu years" aria-label="Years Submenu">
            <ul>
              <li><a href="login.html">G23 (Year 11)</a></li>
              <li><a href="login.html">G24 (Graduated)</a></li>
            </ul>
          </nav>
        </li>

        <li className="labelled">
          <button>
            <span className="name">Categories</span>
            <GoogleIcon name='category' />
          </button>
          <nav className="submenu categories" aria-label="Categories Submenu">
            <ul>
              <li>
                <a href="category/art.html">
                  <GoogleIcon name='brush' />
                  Art
                </a>
              </li>
              <li>
                <a href="category/design.html">
                  <GoogleIcon name='design_services' />
                  Design
                </a>
              </li>
              <li>
                <a href="category/entrepreneurial.html">
                  <GoogleIcon name='attach_money' />
                  Entrepreneurial
                </a>
              </li>
              <li>
                <a href="category/research.html">
                  <GoogleIcon name='biotech' />
                  Research
                </a>
              </li>
              <li>
                <a href="category/subject-specific.html">
                  <GoogleIcon name='extension' />
                  Subject-Specific
                </a>
              </li>
            </ul>
          </nav>
        </li>
      </ul>
    </nav>
  )
}



export default SidebarNav;
export { CollapsingNav };