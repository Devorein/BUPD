import router from "next/router";
import { Button } from "./Button";

export function AdminHome() {
  return <div className="flex w-full flex-col gap-5 h-full items-center justify-center">
    <Button onClick={() => router.push('/polices')} content="View Polices" />
    <Button onClick={() => router.push('/victims')} content="View Victims" />
    <Button onClick={() => router.push('/accesses')} content="View Accesses" />
    <Button onClick={() => router.push('/casefiles')} content="View Casefiles" />
    <Button onClick={() => router.push('/criminals')} content="View Criminals" />
    <Button onClick={() => router.push('/register')} content="Register a police" />
  </div>
}