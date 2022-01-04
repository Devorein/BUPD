import { GetVictimsPayload, IVictim, IVictimSort } from '@bupd/types';
import { useGetVictimsQuery } from '../api/queries/useGetVictimsQuery';
import { DetailsList } from '../components/DetailsList';
import { Paginate } from '../components/Paginate';
import { victimsSortLabelRecord } from '../constants';
import { useIsAuthenticated } from '../hooks';

const createInitialGetVictimsQuery = (): GetVictimsPayload => ({
  limit: 10,
  next: null,
  sort: ['name', -1],
  filter: {
    age: [undefined, undefined]
  },
});

export default function Criminals() {
  useIsAuthenticated();

  return (
    <div className="flex justify-center w-full h-full">
      <Paginate<GetVictimsPayload, IVictimSort, IVictim>
        checkboxGroups={[]}
        clientQueryFn={createInitialGetVictimsQuery}
        dataListComponentFn={(victims) => (
          <div className="grid grid-cols-5 gap-5 pr-5">
            {victims.map((victim) => (
              <div
                className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3"
                key={`${victim.name}.${victim.case_no}`}
              >
                <div className="justify-center flex font-bold text-2xl my-2">
                  {victim.name}
                </div>

                <DetailsList
                  items={[
                    ['Age', victim.age ?? "N/A"],
                    ['Address', victim.address ?? "N/A"],
                    ['Phone', victim.phone_no ?? "N/A"]
                  ]}
                />
              </div>
            ))}
          </div>
        )}
        label="Victims"
        sortLabelRecord={victimsSortLabelRecord}
        dataFetcher={useGetVictimsQuery}
      />
    </div>
  );
}
