import { useRouter } from "next/router";
import { useGetCasefileQuery } from "../../api/queries/useGetCasefileQuery";

export default function Case() {
  const router = useRouter();
  const { case_no } = router.query as { case_no: string };

  const { data: getCasefileQueryData, isError, isLoading: isGetCasefileQueryLoading } = useGetCasefileQuery(case_no ? parseInt(case_no, 10) : undefined);

  if (isError) {
    router.push("/")
  }
  return <div>
    {case_no}
  </div>
}