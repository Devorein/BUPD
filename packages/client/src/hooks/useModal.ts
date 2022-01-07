import { Dispatch, SetStateAction, useState } from 'react';

export interface UseModal<Data> {
	isModalOpen: boolean;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	selectedData: Data | null;
	setSelectedData: Dispatch<SetStateAction<Data | null>>;
	closeModal: () => void;
	openModal: (data: Data) => void;
}

export function useModal<Data>(): UseModal<Data> {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedData, setSelectedData] = useState<Data | null>(null);

	function closeModal() {
		setIsModalOpen(false);
		setSelectedData(null);
	}

	function openModal(data: Data) {
		setIsModalOpen(true);
		setSelectedData(data);
	}

	return {
		isModalOpen,
		setIsModalOpen,
		selectedData,
		setSelectedData,
		closeModal,
		openModal,
	};
}
