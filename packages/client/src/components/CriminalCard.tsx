import { ICriminal } from "@bupd/types";
import { DetailsList, DetailsListProps } from "./DetailsList";

interface CriminalCardProps {
  criminal: ICriminal & { total_cases?: number }
}

export function CriminalCard(props: CriminalCardProps) {
  const { criminal } = props;
  const items: DetailsListProps["items"] = [
    ['Name', criminal.name],
    ['ID', criminal.criminal_id],
  ]
  if (criminal.total_cases) {
    items.push(
      ['Total Cases', criminal.total_cases],
    )
  }
  return <div>
    <div className="flex justify-center w-full mb-5">
      <img
        className="h-[50px] w-[50px] rounded-full shadow-md object-cover"
        alt="profile"
        src={
          criminal.photo ?? 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg'
        }
      />
    </div>
    <DetailsList
      items={items}
    />
  </div>
}