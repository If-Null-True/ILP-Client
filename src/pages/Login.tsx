import OAuth from '../oauth';
import LocationSwitcher from '../components/Redirect';

const Login = () => {
  return (
    <main>
      <OAuth>
        <LocationSwitcher
          referrer={true}
          text={
            <div>
              <h1>Redirecting...</h1>
              <h2>If you are not redirected within 5 seconds, please <a href="/">click here</a>.</h2>
            </div>
          }
        />
      </OAuth>
    </main>
  )
}

export default Login;