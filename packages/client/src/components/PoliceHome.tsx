import router from "next/router";
import { Button } from "./Button";

export function PoliceHome() {
  return <div className="flex w-full flex-col gap-5 h-full items-center justify-center">
    <Button onClick={() => router.push('/police/victims')} content="View Victims" />
    <Button onClick={() => router.push('/police/accesses')} content="View My Accesses" />
    <Button onClick={() => router.push('/police/casefiles')} content="View Casefiles" />
    <Button onClick={() => router.push('/police/criminals')} content="View Criminals" />
  </div>
}