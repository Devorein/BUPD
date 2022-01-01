import { ApiResponse, IQuery, PaginatedResponse } from "@bupd/types";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import router from "next/router";
import qs from "qs";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query';
import { Button } from "./Button";

interface LoadMoreButtonProps {
  hasNextPage?: boolean
  isQueryFetching: boolean
  lastFetchedPage: ApiResponse<PaginatedResponse<any>> | null | undefined
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<ApiResponse<PaginatedResponse<any>>, Error>>,
}

export function LoadMoreButton(props: LoadMoreButtonProps) {
  const { fetchNextPage, hasNextPage, isQueryFetching, lastFetchedPage } = props;
  const query = qs.parse(router.asPath.slice(2)) as unknown as IQuery<any, any>;

  return <div className="flex justify-center mt-5">
    {hasNextPage && !isQueryFetching && (
      <Button
        color="secondary"
        sx={{
          paddingLeft: '10px',
          paddingRight: '5px'
        }}
        onClick={() => {
          if (query) {
            query.next = lastFetchedPage?.status === "success"
              ? lastFetchedPage.data?.next
              : null
          }
          fetchNextPage({
            pageParam: qs.stringify(query)
          });
        }}
        content={
          <span className="flex items-center">
            <span className="text-center block">More</span>{" "}
            <ArrowDropDownIcon />
          </span>
        }
      />
    )}
  </div>
}