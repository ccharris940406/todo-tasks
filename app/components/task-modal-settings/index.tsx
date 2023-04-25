import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

type singleTask = {
  content: string;
  status: "Running" | "Canceled" | "Completed";
  priority: "High" | "Normal" | "Low";
  category?: string;
};

type params = {
  closeModal: () => void;
  taskId: singleTask | null;
  categories: string[];
};

export default function TaskModalSettings({
  closeModal,
  taskId,
  categories,
}: params) {
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(
    null
  );
  const categorySelect = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    setModalContainer(document.createElement("div"));
  }, []);

  useEffect(() => {
    if (modalContainer) {
      document.body.appendChild(modalContainer);
    }

    if (categorySelect.current !== null && taskId?.category !== undefined)
      categorySelect.current.value = taskId?.category;

    return () => {
      if (modalContainer !== null) {
        document.body.removeChild(modalContainer);
      }
    };
  }, [modalContainer]);

  return (
    modalContainer &&
    createPortal(
      <div
        className="fixed flex justify-center top-0 backdrop-blur-md left-0 h-full w-full"
        onClick={closeModal}
      >
        <div
          className="flex flex-col justify-between self-center p-4 w-96 h-44 bg-[#0a4b75] shadow-xl "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex h-full w-full self-center">
            <select
              ref={categorySelect}
              name="Categories"
              id=""
              className="w-[50%] h-14 m-1"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => {
                return <option value={cat}>{cat}</option>;
              })}
            </select>
            <select name="" id="" className="w-[50%] h-14 m-1"></select>
          </div>
          <div className="self-end flex justify-center w-full">
            <button
              className="m-4 h-10 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={closeModal}
            >
              Discard
            </button>
            <button
              onClick={() => {
                taskId &&
                  categorySelect.current &&
                  (taskId.category = categorySelect.current?.value,
                    closeModal())
              }}
              className="m-4 h-10 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>,
      modalContainer
    )
  );
}
