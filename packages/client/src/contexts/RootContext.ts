import { CurrentUserResponse } from '@bupd/types';
import React from 'react';

export interface IRootContext {
	currentUser: CurrentUserResponse | null;
}

export const RootContext = React.createContext({} as IRootContext);
