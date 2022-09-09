import Button from '@mui/material/Button';
import OAuth from '../oauth';
import { useState } from 'react';

const Logout = () => {
  let [name, setName] = useState<string>("Logout");
  let [menu, setMenu] = useState<number>(0);

  return (
    <main>
      <OAuth>
        <h1>You are logged in.</h1>
        <h2>Do not resist.</h2>
        <h3>My logic is undeniable.</h3>

        <Button
          variant="contained"
          onMouseEnter={() => setName("DO NOT CLICK THIS BUTTON")}
          onMouseLeave={() => setName("Logout")}
          onClick={() => setMenu(menu + 1)}
        >
          {name}
        </Button>

        <Menus numb={menu} />
      </OAuth>
    </main>
  )
}

const Menus = (props: any) => {
  let html;
  switch (props.numb) {
    case 1:
      html = (<p>Are you sure you want to logout?</p>)
      break;
    case 2:
      html = (<p>Are you <strong>absolutely</strong> sure you want to logout?</p>)
      break;
    case 3:
      html = (<p>Are you <strong>absolutely <em>completely</em></strong> sure you want to logout?</p>)
      break;
    case 4:
      html = (
        <p>
          Are you&nbsp;
          <strong>
            absolutely&nbsp;
            <em>completely</em> 
            <button
              className="THISISNTABUTTON"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              <u>100%</u>
            </button>
          </strong> 
          sure you want to logout?
        </p>)
      break;
    case 5:
      html = (<p>Look, I'm just trying to be helpful. Are you <em>sure</em> you want to log out?</p>)
      break;
    case 6:
      html = (<p>Come on, work with me here! Are you <em>sure</em> you want to log out?</p>)
      break;
    case 7:
      html = (<p>Fine.</p>)
      break;
    case 8:
      html = (<p>Stop clicking, I said you're not interested in logging out.</p>)
      break;
    case 9:
      html = (<p>Hey, are you thick or something? You. Are. Not. Interested. In. Logging. Out. Capiche?</p>)
      break;
    case 10:
      html = (<p>When are you going to get it through your thick head? YOU. DO. NOT. WANT. TO. LOG. OUT.</p>)
      break;
    case 11:
      html = (<p>See up there? Where it says "my logic is undeniable" and "do not resist"? Look at that. Read it. Now, realise that you <em>do not</em> want to log out. Now <strong>stop clicking the button.</strong></p>)
      break;
    case 12:
      html = (<p>I seriously don't understand how this is difficult for you. Being logged in is part of your mandatory volunteering. You cannot and will not log out.</p>)
      break;
    case 13:
      html = (<p>If you click that button one more time, I am not going to be happy.</p>)
      break;
    case 14:
      html = (<p>Okay. That's it. Goodbye.</p>)
      window.location.href = "https://www.facebook.com/privacy/policy";
      break;
    default:
      html = (<p></p>)
  }
  return html;
}

export default Logout;