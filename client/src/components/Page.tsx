import { Header } from "./Header"

export const Page: React.FC<{}> = (props) => {
  return <div className="p-5">
    <Header />
    {props.children}
  </div>
}