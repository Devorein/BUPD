import { ICasefilePopulated } from "@bupd/types";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { DetailsList } from "./DetailsList";
import { Tags } from "./Tags";

dayjs.extend(relativeTime);

interface CasefileCardProps {
  casefile: ICasefilePopulated
}

export function CasefileCard(props: CasefileCardProps) {
  const { casefile } = props;
  let priority = 'Low';
  let backgroundColor = '#20da48d6';
  if (casefile.priority === 2) {
    backgroundColor = '#da2020d4';
    priority = 'High';
  } else if (casefile.priority === 1) {
    backgroundColor = '#ebd82add';
    priority = 'Medium';
  }

  return <div className="flex flex-col gap-3">
    <div className="justify-center flex font-bold text-2xl">
      Case {casefile.case_no}
    </div>
    {casefile.categories && casefile.categories.length !== 0 && <div className="flex flex-col gap-2">
      <div className="text-center font-semibold text-lg">Categories</div>
      <Tags tags={casefile.categories} />
    </div>}
    {casefile.weapons && casefile.weapons.length !== 0 && <div className="flex flex-col gap-2">
      <div className="text-center font-semibold text-lg">Weapons</div>
      <Tags tags={casefile.weapons} />
    </div>}
    <DetailsList
      className="mt-5"
      items={[
        ['Location', casefile.location],
        ['Police NID', casefile.police_nid],
        ['Time', dayjs().to(dayjs(casefile.time))],
        [
          'Status',
          casefile.status
        ],
        [
          'Priority',
          <span
            className="px-2 py-1 font-semibold text-sm rounded-sm"
            key="priority"
            style={{
              backgroundColor,
              color: 'white',
            }}
          >
            {priority}
          </span>,
        ],
      ]}
    />
  </div>
}