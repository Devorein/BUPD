import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useGetCasefileQuery } from "../../api/queries/useGetCasefileQuery";
import { CasefileCard } from "../../components/CasefileCard";
import { CriminalCard } from "../../components/CriminalCard";
import { PoliceCard } from "../../components/PoliceCard";
import { VictimCard } from "../../components/VictimCard";

export default function Case() {
  const router = useRouter();
  const { case_no } = router.query as { case_no: string };

  const { data: getCasefileQueryData, isError, error } = useGetCasefileQuery(case_no ? parseInt(case_no, 10) : undefined);

  const { enqueueSnackbar } = useSnackbar();
  if (isError) {
    router.push("/");
    enqueueSnackbar(error.message, {
      variant: "error"
    })
    return null;
  }

  if (getCasefileQueryData?.status === "success") {
    return <div className="flex gap-5 h-full">
      <div className="min-w-[500px] p-5 shadow-md border-2 rounded-md">
        <CasefileCard casefile={getCasefileQueryData.data} />
      </div>
      <div className="flex flex-col gap-3">
        <Typography variant="h5">Criminals</Typography>
        <div className="flex flex-col gap-3 h-full overflow-auto pb-2 pr-5">
          {getCasefileQueryData.data.criminals.map(criminal => <div key={criminal.criminal_id} className="p-5 rounded-md border-2 shadow-md">
            <CriminalCard criminal={criminal} />
          </div>)}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Typography variant="h5">Victims</Typography>
        <div className="flex flex-col gap-3 h-full overflow-auto pb-2 pr-5">
          {getCasefileQueryData.data.victims.map(victim => <div key={`${victim.case_no}.${victim.name}`} className="p-5 rounded-md border-2 shadow-md">
            <VictimCard victim={victim} />
          </div>)}
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-3">
        <Typography variant="h5">Polices</Typography>
        <div className="flex flex-col gap-3 h-full overflow-auto pb-2 pr-5">
          {getCasefileQueryData.data.polices.map(police => <div key={police.nid} className="p-5 rounded-md border-2 shadow-md">
            <PoliceCard police={police} />
          </div>)}
        </div>
      </div>
    </div>

  }
  return null;
}