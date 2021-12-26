import { ICriminal } from '../shared.types';
import { find } from './utils';

const CriminalModel = {
	find(filterQuery: Partial<ICriminal>) {
		return find<ICriminal>({ filter: filterQuery }, 'Criminal');
	},
};

export default CriminalModel;
