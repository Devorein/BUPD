import { CurrentUser, GetCurrentUserResponse } from '@bupd/types';
import React from 'react';
import { UseQueryResult } from 'react-query';

export interface IRootContext {
	getCurrentUserQueryResult: UseQueryResult<GetCurrentUserResponse, Error>;
	currentUser: CurrentUser;
}

export const RootContext = React.createContext({} as IRootContext);
