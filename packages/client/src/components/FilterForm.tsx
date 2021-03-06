import { IQuery } from '@bupd/types';
import { Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { Button } from './Button';
import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup';
import { DateRange, DateRangeProps } from './DateRange';
import { NumberRange, NumberRangeProps } from './NumberRange';
import { Select, SelectProps } from './Select';

export interface FilterFormProps<ClientQuery extends IQuery<any, any>> {
	setClientQuery: Dispatch<SetStateAction<ClientQuery>>;
	clientFilter: ClientQuery['filter'];
	setClientFilter: Dispatch<SetStateAction<ClientQuery['filter']>>;
	resetFilter: () => ClientQuery['filter'];
	filterGroups: (
		| {
				type: 'checkbox_group';
				props: Omit<CheckboxGroupProps<ClientQuery['filter']>, 'setState' | 'state'>;
		  }
		| {
				type: 'number_range';
				props: Omit<NumberRangeProps<ClientQuery['filter']>, 'setState' | 'state'>;
		  }
		| {
				type: 'select';
				props: SelectProps<string[]> & { stateKey: keyof ClientQuery['filter'] };
		  }
		| {
				type: 'date_range';
				props: Omit<DateRangeProps<ClientQuery['filter']>, 'setState' | 'state'> & {
					stateKey: keyof ClientQuery['filter'];
				};
		  }
	)[];
}

export function FilterForm<ClientQuery extends IQuery<any, any>>(
	props: FilterFormProps<ClientQuery>
) {
	const { filterGroups, resetFilter, setClientQuery, clientFilter, setClientFilter } = props;

	return (
		<div className="flex flex-col justify-between h-full min-w-[250px]">
			<div className="flex flex-col gap-5">
				<Typography variant="h4">Filter</Typography>
				<div className="flex flex-col gap-5">
					{filterGroups.map((filterGroup) => {
						switch (filterGroup.type) {
							case 'checkbox_group': {
								return (
									<CheckboxGroup<ClientQuery['filter']>
										key={filterGroup.props.label}
										{...filterGroup.props}
										setState={setClientFilter}
										state={clientFilter}
									/>
								);
							}
							case 'number_range': {
								return (
									<NumberRange<ClientQuery['filter']>
										key={filterGroup.props.label}
										{...filterGroup.props}
										setState={setClientFilter}
										state={clientFilter}
									/>
								);
							}
							case 'select': {
								const { stateKey, ...rest } = filterGroup.props;
								return (
									<Select<string[]>
										value={clientFilter[stateKey]}
										key={stateKey.toString()}
										{...rest}
										onChange={(e) => {
											setClientFilter({
												...clientFilter,
												[filterGroup.props.stateKey]: e.target.value,
											});
										}}
									/>
								);
							}
							case 'date_range': {
								return (
									<DateRange<ClientQuery['filter']>
										key={filterGroup.props.label}
										setState={setClientFilter}
										state={clientFilter}
										{...filterGroup.props}
									/>
								);
							}
							default: {
								return null;
							}
						}
					})}
				</div>
			</div>
			<div className="flex gap-3">
				<Button
					color="secondary"
					content="Apply"
					onClick={() => {
						setClientQuery((clientQuery) => ({ ...clientQuery, filter: clientFilter }));
					}}
				/>
				<Button
					content="Reset"
					onClick={() => {
						setClientFilter(resetFilter());
					}}
				/>
			</div>
		</div>
	);
}
