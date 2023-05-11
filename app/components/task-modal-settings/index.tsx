import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Category } from "@prisma/client";
import { NextResponse } from "next/server";

type params = {
  currentTask: number | null;
  currentTaskCategory: number | null;
  closeModal: () => void;
};

const setTaskCategory = async (
  idTask: number | null,
  idCategory: number | null
) => {
  console.log("hellou category", idCategory, idTask);
  if (idTask === null || idCategory === null) throw new Error("Failed");
  const res = await fetch(`/api/tasks/${idTask}`, {
    method: "PUT",
    body: JSON.stringify({
      categoryId: idCategory,
    }),
  });
  if (!res.ok) throw new Error("Failed");
  return NextResponse.json(res);
};

export default function TaskModalSettings({
  currentTask,
  currentTaskCategory,
  closeModal,
}: params) {
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(
    null
  );
  const categorySelect = useRef<HTMLSelectElement | null>(null);
  const [categoryToSet, setCategoryToSet] = useState<number>(
    currentTaskCategory ? currentTaskCategory : 0
  );
  const { data: dataCategories, mutate: mutateCategories } =
    useSWR("/api/categories");
  const { mutate: taskMutate } = useSWR(`/api/tasks/${currentTask}`);

  useEffect(() => {
    setModalContainer(document.createElement("div"));
  }, []);

  useEffect(() => {
    if (modalContainer) {
      document.body.appendChild(modalContainer);
    }

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
              value={categoryToSet}
              onChange={(event) => {
                console.log(+event.currentTarget.value);
                setCategoryToSet(+event.currentTarget.value as number);
              }}
              name="Categories"
              id=""
              className="w-[50%] h-14 m-1"
            >
              <option value={0}>Select a category</option>
              {dataCategories.map((cat: Category) => {
                return <option value={cat.id}>{cat.title}</option>;
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
                setTaskCategory(currentTask, categoryToSet);
                taskMutate();
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
