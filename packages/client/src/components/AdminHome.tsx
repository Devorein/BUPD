import router from "next/router";
import { Button } from "./Button";

export function AdminHome() {
  return <div className="flex w-full flex-col gap-5 h-full items-center justify-center">
    <Button onClick={() => router.push('/admin/polices')} content="View Polices" />
    <Button onClick={() => router.push('/admin/victims')} content="View Victims" />
    <Button onClick={() => router.push('/admin/accesses')} content="View Accesses" />
    <Button onClick={() => router.push('/admin/casefiles')} content="View Casefiles" />
    <Button onClick={() => router.push('/admin/criminals')} content="View Criminals" />
    <Button onClick={() => router.push('/admin/register')} content="Register a police" />
  </div>
}