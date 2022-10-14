import React from "react";

class LocationSwitcher extends React.Component<{ href?: string, text?: React.ReactNode, referrer?: boolean, referer?: boolean }> {
  componentDidMount() {
    if (this.props.href) {
      window.location.href = this.props.href as string;
    }
    else if (this.props.referrer || this.props.referer) {
      const origin = localStorage.getItem('login-referrer');
    //   localStorage.removeItem('login-referrer')
      if (!origin || origin === '/auth')
        window.location.href = '/';
      else
        window.location.href = origin as string;
    }
  }

  render() {
    return ((this.props.text) ? this.props.text : <h1>Redirecting...</h1>)
  }
}

export default LocationSwitcher;