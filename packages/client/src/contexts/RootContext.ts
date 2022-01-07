import { GetCurrentUserResponse, IAdmin, IPolice } from '@bupd/types';
import React from 'react';
import { UseQueryResult } from 'react-query';

export interface IRootContext {
	getCurrentUserQueryResult: UseQueryResult<GetCurrentUserResponse, Error>;
	currentUser:
		| (IAdmin & {
				type: 'admin';
		  })
		| (IPolice & {
				type: 'police';
		  })
		| null;
}

export const RootContext = React.createContext({} as IRootContext);
