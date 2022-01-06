import { GetAccessesPayload, IAccessPopulated, IAccessSort } from '@bupd/types';
import { useState } from 'react';
import { useGetAccessesQuery } from '../../api';
import { AccessDetails, AccessDetailsProps } from '../../components/AccessDetails';
import { AccessList } from '../../components/AccessList';
import { Paginate } from '../../components/Paginate';
import {
  AccessesFilterGroup,
  accessSortLabelRecord,
  createInitialGetAccessesQuery
} from '../../constants';

export default function Accesses() {
  const [currentDetail, setAccessDetail] = useState<AccessDetailsProps['data']>(null);
  return (
    <div className="flex gap-5 h-full">
      <Paginate<GetAccessesPayload, IAccessSort, IAccessPopulated>
        filterGroups={AccessesFilterGroup()}
        dataListComponentFn={(items) => (
          <AccessList accesses={items} setAccessDetail={setAccessDetail} />
        )}
        clientQueryFn={createInitialGetAccessesQuery}
        dataFetcher={useGetAccessesQuery}
        label="Access Requests"
        sortLabelRecord={accessSortLabelRecord}
        searchBarPlaceholder='Search by access id'
      />
      <div className="my-2">
        <AccessDetails data={currentDetail} />
      </div>
    </div>
  );
}
