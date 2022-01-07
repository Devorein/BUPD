import { GetDashboardResponse } from '@bupd/types';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { useApiQuery } from '../../hooks/useApiQuery';

export function useGetDashboardQuery() {
	const { currentUser } = useContext(RootContext);
	return useApiQuery<GetDashboardResponse>(['dashboard'], `dashboard`, {
		enabled: Boolean(currentUser),
	});
}
