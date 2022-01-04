import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Button } from "./Button";
import { TransitionedModal } from "./Modal";

interface DeleteModalProps<Data> {
  onDelete: (selectedData: Data, resetState: () => void) => void
  isMutationLoading: boolean
  children: (renderProps: {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    selectedData: Data | null
    setSelectedData: Dispatch<SetStateAction<Data | null>>,
    resetState: () => void
  }) => ReactNode
}

export function DeleteModal<Data>(props: DeleteModalProps<Data>) {
  const { onDelete, children, isMutationLoading } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Data | null>(null)

  function resetState() {
    setIsModalOpen(false);
    setSelectedData(null);
  }

  return <>
    <TransitionedModal isModalOpen={isModalOpen} onClose={() => {
      resetState()
    }}>
      <div className="p-5 flex flex-col gap-5">
        <div className="text-center text-2xl font-bold uppercase">
          Are you sure you want to delete?
        </div>
        <div className="text-center text-md font-medium">This action can&apos;t be reversed</div>
        <div className="flex justify-between mt-5">
          <Button content="Confirm" disabled={isMutationLoading || !selectedData} color="secondary" onClick={() => {
            if (selectedData) {
              onDelete(selectedData, resetState)
            }
          }} />
          <Button disabled={isMutationLoading || !selectedData} content="Cancel" onClick={() => resetState()} />
        </div>
      </div>
    </TransitionedModal>
    {children({
      isModalOpen,
      selectedData,
      setIsModalOpen,
      setSelectedData,
      resetState
    })}
  </>
}