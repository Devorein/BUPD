import { CurrentUserResponse } from '@shared';
import React from 'react';

export interface IRootContext {
	currentUser: CurrentUserResponse | null;
}

export const RootContext = React.createContext({} as IRootContext);
