import GoogleIcon from "../components/Icons";

const ContactUs = () => {
  return (
    <main>
      <h1 className="title">Contact Us</h1>
      <h2>Contact the school</h2>
      <p>
        <div className="flex-row">
          <GoogleIcon name='business' />
          <div className="flex-col">
            <span>138 Abbott Rd</span>
            <span>North Curl Curl NSW 2099</span>
          </div>
        </div>
      </p>
    </main>
  )
}

export default ContactUs;