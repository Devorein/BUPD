import { ApiResponse, IQuery, PaginatedResponse } from "@bupd/types";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query';
import { Button } from "./Button";

interface LoadMoreButtonProps<Payload extends IQuery<any, any>> {
  hasNextPage?: boolean
  isQueryFetching: boolean
  lastFetchedPage: ApiResponse<PaginatedResponse<any>> | null | undefined
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<ApiResponse<PaginatedResponse<any>>, Error>>,
  payload: Payload
}

export function LoadMoreButton<Payload extends IQuery<any, any>>(props: LoadMoreButtonProps<Payload>) {
  const { fetchNextPage, hasNextPage, isQueryFetching, lastFetchedPage, payload } = props;

  return <div className="flex justify-center">
    {hasNextPage && !isQueryFetching && (
      <Button
        color="secondary"
        sx={{
          paddingLeft: '10px',
          paddingRight: '5px'
        }}
        onClick={() => {
          if (payload) {
            payload.next = lastFetchedPage?.status === "success"
              ? lastFetchedPage.data?.next
              : null
          }
          fetchNextPage({
            pageParam: payload
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