import router from "next/router";
import { useContext } from "react";
import { useGetCurrentUserQueryData } from "../api";
import { JWT_LS_KEY } from "../constants";
import { RootContext } from "../contexts";
import { Button } from "./Button";

export function Header() {
  const { currentUser } = useContext(RootContext);
  // Find the user name from the current logged in entity
  const getCurrentUserQueryData = useGetCurrentUserQueryData()
  let currentUserName: string | null = null;
  if (currentUser) {
    if (currentUser.type === "admin") {
      currentUserName = `Admin ${currentUser.id}`
    } else {
      currentUserName = currentUser.name
    }
  }
  return <div className="flex gap-3 items-center justify-between shadow-md p-3">
    <div>
      {currentUser ? <div><span className="font-medium">Welcome back, </span><span className="font-bold text-lg">{currentUserName}</span></div> : null}
    </div>
    <div className="flex gap-3">
      {currentUser?.type === "admin" ? <Button content="Register a police" onClick={() => {
        router.push(`/register`)
      }} /> : null}
      {currentUser?.type === "police" ? <Button content="Create a case" onClick={() => {
        router.push(`/case`)
      }} /> : null}
      {!currentUser ? <Button content="Login" onClick={() => {
        router.push(`/login`)
      }} /> : <Button content="Logout" onClick={() => {
        getCurrentUserQueryData(() => {
          return {
            status: "success",
            data: null
          }
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem(JWT_LS_KEY);
        }
        router.push('/login');
      }} />}
    </div>
  </div>
}