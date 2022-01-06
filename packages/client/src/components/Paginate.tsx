import { IQuery } from "@bupd/types";
import { Typography } from "@mui/material";
import { useState } from "react";
import { UseApiInfiniteQuery } from "../hooks/useApiInfiniteQuery";
import { FilterForm, FilterFormProps } from "./FilterForm";
import { LoadMoreButton } from "./LoadMoreButton";
import { SearchBar } from "./SearchBar";
import { Select } from "./Select";

interface PaginateProps<ClientQuery extends IQuery<any, any>, Data> {
  clientQueryFn: () => ClientQuery,
  dataFetcher: (query: ClientQuery) => UseApiInfiniteQuery<Data>
  label: string
  sortLabelRecord: Record<string, string>
  dataListComponentFn: (items: Data[]) => JSX.Element
  filterGroups: FilterFormProps<ClientQuery>["filterGroups"]
  className?: string
  searchBarPlaceholder?: string
}

export function Paginate<ClientQuery extends IQuery<any, any>, Sort extends [string, -1 | 1], Data>(props: PaginateProps<ClientQuery, Data>) {
  const { searchBarPlaceholder, dataListComponentFn, filterGroups, label, clientQueryFn, dataFetcher, sortLabelRecord, className = "" } = props;
  const [clientQuery, setClientQuery] = useState<ClientQuery>(clientQueryFn());
  const [dummyQuery, setDummyQuery] = useState<ClientQuery>(
    clientQuery,
  );

  const { hasNextPage, lastFetchedPage, fetchNextPage, data, totalItems, allItems, isFetching, } = dataFetcher(clientQuery);

  if (data) {
    return <div className={`flex justify-center gap-5 py-5 w-full h-full ${className}`}>
      {filterGroups.length !== 0 && <div className="h-full min-w-[300px]">
        <FilterForm<ClientQuery> clientFilter={dummyQuery.filter} setClientFilter={(clientFilter) => {
          setDummyQuery({
            ...clientQuery,
            filter: clientFilter as ClientQuery["filter"]
          })
        }} setClientQuery={setClientQuery} filterGroups={filterGroups} resetFilter={() => clientQueryFn().filter} />
      </div>}

      <div className="flex gap-2 flex-col w-full h-full">
        <Typography className="mb-5 uppercase" variant="h4">{label}</Typography>
        <div className="flex flex-col gap-3 w-full h-full" style={{
          height: 'calc(100% - 130px)'
        }}>
          <div className="flex justify-between items-center">
            <div className="flex gap-3 w-full">
              <Select<number> value={parseInt(clientQuery.limit?.toString() ?? "5", 10)} items={[5, 10, 15, 20, 25]} renderValue={(value) => `${value} per page`} onChange={(event) => {
                setClientQuery({
                  ...clientQuery,
                  limit: event.target.value as number,
                  next: null
                })
              }} />
              <Select<string> value={clientQuery.sort.join(".")} items={Object.keys(sortLabelRecord)} menuItemRender={(value) => sortLabelRecord[value]} renderValue={(value) => sortLabelRecord[value]} onChange={(event) => {
                setClientQuery({
                  ...clientQuery,
                  sort: event.target.value.split(".") as Sort,
                  next: null
                })
              }} />
              {searchBarPlaceholder && <SearchBar value={clientQuery.filter.search?.join(" ") ?? ""} placeHolder={searchBarPlaceholder} onClick={(searchTerm) => {
                setClientQuery({
                  ...clientQuery,
                  filter: {
                    ...clientQuery.filter,
                    search: searchTerm.split(" ").map(Number)
                  }
                })
              }} />}
            </div>
            <div className="flex gap-3 text-lg">
              Total: <span className="font-bold">{allItems.length}/{totalItems}</span>
            </div>
          </div>
          <div className="overflow-auto w-full" style={{
            height: 'calc(100% - 135px)',
            flexGrow: 1
          }}>
            {dataListComponentFn(allItems)}
          </div>
        </div>
        <div style={{ marginTop: 15 }}>
          <LoadMoreButton payload={clientQuery} fetchNextPage={fetchNextPage} isQueryFetching={isFetching} lastFetchedPage={lastFetchedPage} hasNextPage={hasNextPage && allItems.length !== totalItems} />
        </div>
      </div>
    </div>;
  }

  return null;
}