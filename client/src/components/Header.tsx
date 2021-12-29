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
  return <div className="flex gap-3 items-center justify-end shadow-md p-3">
    {currentUser ? <div className="font-bold text-lg mr-5">{currentUserName}</div> : null}
    {currentUser?.type === "admin" ? <Button content="Register a police" onClick={() => {
      router.push(`/register`)
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
}