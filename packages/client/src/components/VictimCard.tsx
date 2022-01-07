import { IVictim } from "@bupd/types";
import { DetailsList } from "./DetailsList";

interface VictimCardProps {
  victim: IVictim
}

export function VictimCard(props: VictimCardProps) {
  const { victim } = props;

  return <div>
    <div className="justify-center flex font-bold text-2xl my-2">
      {victim.name}
    </div>
    <DetailsList
      items={[
        ['Age', victim.age ?? "N/A"],
        ['Address', victim.address ?? "N/A"],
        ['Phone', victim.phone_no ?? "N/A"],
        ['Case', victim.case_no],
      ]}
    />
  </div>
}