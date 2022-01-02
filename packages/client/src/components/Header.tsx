import router from "next/router";
import { useContext } from "react";
import { useGetCurrentUserQueryData } from "../api";
import { JWT_LS_KEY } from "../constants";
import { RootContext } from "../contexts";
import Logo from "../svg/logo";
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
    <div onClick={() => {
      router.push({ pathname: '/' })
    }} className="flex gap-1 items-center cursor-pointer">
      <Logo />
      <span className="font-bold text-xl">
        BUPD
      </span>
    </div>
    <div className="flex gap-3 items-center">
      {currentUser ? <div className="mr-3"><span className="font-medium">Welcome back, </span><span className="font-bold text-lg">{currentUserName}</span></div> : null}
      {currentUser?.type === "admin" ? <Button content="Register a police" onClick={() => {
        router.push(`/register`)
      }} /> : null}
      {currentUser?.type === "police" ? <Button content="Report a case" onClick={() => {
        router.push(`/case`)
      }} /> : null}
      {!currentUser ? <Button content="Login" onClick={() => {
        router.push(`/login`)
      }} /> : <Button content="Logout" onClick={() => {
        getCurrentUserQueryData(() => ({
          status: "error",
          message: "Logged out"
        }));
        if (typeof window !== "undefined") {
          localStorage.removeItem(JWT_LS_KEY);
        }
        router.push('/login');
      }} />}
    </div>
  </div>
}