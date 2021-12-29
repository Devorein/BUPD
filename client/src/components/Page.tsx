import { Header } from "./Header"

export const Page: React.FC<{}> = (props) => {
  return <div className="Page p-5 w-full">
    <Header />
    <div className="Body">
      {props.children}
    </div>
  </div>
}