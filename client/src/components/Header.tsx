import { useContext } from "react";
import { RootContext } from "../contexts";
import { Button } from "./Button";

export function Header() {
  const { currentUser } = useContext(RootContext);
  let currentUserName: string | null = null;
  if (currentUser) {
    if (currentUser.type === "admin") {
      currentUserName = `Admin ${currentUser.id}`
    } else {
      currentUserName = currentUser.name
    }
  }
  return <div className="flex gap-5 items-center justify-end">
    {currentUser ? <div className="font-bold text-lg">{currentUserName}</div> : null}
    {!currentUser ? <Button content="Login" /> : <Button content="Logout" />}
  </div>
}