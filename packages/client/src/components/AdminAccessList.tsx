import { GetAccessesPayload, IAccessPopulated, IAccessSort } from '@bupd/types';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WorkIcon from '@mui/icons-material/Work';
import React, { useState } from "react";
import { useGetAccessesQuery } from '../api';
import {
  AccessesFilterGroup,
  accessSortLabelRecord,
  createInitialGetAccessesQuery,
  PermissionIconRecord
} from '../constants';
import { AccessDetails, AccessDetailsProps } from './AccessDetails';
import { ApprovalIcons } from './ApprovalIcons';
import { Paginate } from './Paginate';

export default function AdminAccessList() {
  const [currentDetail, setAccessDetail] = useState<AccessDetailsProps['data']>(null);
  return (
    <div className="flex gap-5 h-full">
      <Paginate<GetAccessesPayload, IAccessSort, IAccessPopulated>
        filterGroups={AccessesFilterGroup()}
        dataListComponentFn={(accesses) => (
          <div className="flex gap-5 px-5 flex-col overflow-hidden">{
            accesses.map((access, accessIndex) => <div key={access.access_id} className="hover:scale-[1.015] transition-transform duration-300 items-center flex gap-3 border-2 shadow-md p-5 rounded-sm justify-between" style={{ borderColor: '#dad8d85e' }}>
              <div className="flex gap-3 items-center">
                <div className="font-bold">{accessIndex + 1}.</div>
                <div className="text-lg font-semibold hover:underline cursor-pointer" onClick={() => {
                  setAccessDetail({
                    type: "police",
                    ...access.police
                  })
                }}>{access.police_nid}</div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">Requesting {PermissionIconRecord[access.permission]}  access</div>
                <div className="flex items-center gap-2">to <span onClick={() => {
                  if (access.type === "criminal") {
                    setAccessDetail({
                      type: "criminal",
                      ...access.criminal!
                    })
                  } else if (access.type === "case") {
                    setAccessDetail({
                      type: "casefile",
                      ...access.casefile!
                    })
                  }
                }} className="flex items-center gap-1 uppercase font-bold hover:underline cursor-pointer text-sm">{access.type === "criminal" ? <AccountBoxIcon fontSize="small" /> : <WorkIcon fontSize="small" />} {access.type === "case" ? access.case_no : access.criminal_id}</span></div>
              </div>
              <ApprovalIcons accessId={access.access_id} approved={access.approved} />
            </div>)
          }</div>
        )}
        clientQueryFn={createInitialGetAccessesQuery}
        dataFetcher={useGetAccessesQuery}
        label="Access Requests"
        sortLabelRecord={accessSortLabelRecord}
      />
      <div className="my-2">
        <AccessDetails data={currentDetail} />
      </div>
    </div>
  );
}
