import { GetCasefileResponse } from "@bupd/types";
import { useContext } from "react";
import { RootContext } from "../../contexts/RootContext";
import { useApiQuery } from "../../hooks";

export function useGetCasefileQuery(caseNo?: number) {
  const { currentUser } = useContext(RootContext);
  return useApiQuery<GetCasefileResponse, { endpoint: string }>(
    ['casefile', caseNo ?? ""],
    `casefile`,
    {
      enabled: caseNo !== undefined && caseNo !== null && Boolean(currentUser),
    }
  );
}