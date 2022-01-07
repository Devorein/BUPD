import { Tab, Tabs } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

interface MultiTabsProps {
	panels: ReactNode[];
	tabs: string[];
	activeTab?: number;
	className?: string;
}

interface TabPanelProps {
	children?: ReactNode;
	index: any;
	value: any;
}

function MultiTabsPanel(props: TabPanelProps) {
	const { children, value, index } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			className="MultiTabsPanel"
		>
			<div>{children}</div>
		</div>
	);
}

export function MultiTabs(props: MultiTabsProps) {
	const { className = '', activeTab } = props;
	const [tabState, setTabState] = useState(activeTab ?? 0);
	const { panels, tabs } = props;

	useEffect(() => {
		setTabState(props.activeTab ?? 0);
	}, [props.activeTab]);

	return (
		<div className={`MultiTabs ${className}`}>
			<Tabs
				className="MultiTabs-header mb-5"
				indicatorColor="primary"
				textColor="primary"
				color="primary"
				value={tabState}
				onChange={(_, newValue: number) => setTabState(newValue)}
			>
				{tabs.map((label) => (
					<Tab sx={{}} className="MultiTabs-header-tab text-base" label={label} key={label} />
				))}
			</Tabs>
			<div className="MultiTabs-panels">
				{panels.map((panel, index) => (
					<MultiTabsPanel key={`panel.${index + 1}`} value={tabState} index={index}>
						{panel}
					</MultiTabsPanel>
				))}
			</div>
		</div>
	);
}
