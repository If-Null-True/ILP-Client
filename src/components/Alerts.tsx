import { PropsWithChildren } from "react"

export const Notice = (props: PropsWithChildren) => {
  return (
    <div className="notice" role="status">
      <p>
        <strong>Note:&nbsp;</strong>
        {props.children}
      </p>
    </div>
  )
}

export const Warning = (props: PropsWithChildren) => {
  return (
    <div className="warning" role="status">
      <p>
        <strong>Warning:&nbsp;</strong>
        {props.children}
      </p>
    </div>
  )
}

export const Alert = (props: PropsWithChildren) => {
  return (
    <div className="alert" role="alert">
      <p>
        <strong>Alert:&nbsp;</strong>
        {props.children}
      </p>
    </div>
  )
}

export const Error = (props: PropsWithChildren) => {
  return (
    <div className="error" role="status">
      <p>
        <strong>Error:&nbsp;</strong>
        {props.children}
      </p>
    </div>
  )
}