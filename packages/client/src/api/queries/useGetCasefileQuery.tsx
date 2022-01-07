import { GetCasefileResponse } from "@bupd/types";
import { useContext } from "react";
import { RootContext } from "../../contexts/RootContext";
import { useApiQuery } from "../../hooks";

export function useGetCasefileQuery(caseNo?: number) {
  const { currentUser } = useContext(RootContext);
  return useApiQuery<GetCasefileResponse>(
    ['casefile', caseNo ?? ""],
    `casefile/${caseNo}`,
    {
      enabled: Boolean(caseNo) && Boolean(currentUser),
    }
  );
}