import { PropsWithChildren } from "react";

const Aria = (props: PropsWithChildren<{focusable?: boolean, href?: string, id?: string}>) => {
  if (props.href) {
    return (
      <a 
        href={props.href}
        className={'aria-only' + ((props.focusable)? ' focusable' : '')}
        id={(props.id)? props.id : undefined}
      >
        {props.children}
      </a>
    )
  } else {
    return (
      <span
        className={'aria-only' + ((props.focusable)? ' focusable' : '')}
        id={(props.id)? props.id : undefined}
      >
        {props.children}
      </span>
    )
  }
}

export default Aria;