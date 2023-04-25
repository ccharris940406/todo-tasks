import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoAddCircleOutline} from "react-icons/io5"
import { FaMinusCircle } from "react-icons/fa";

type params = {
  categories: string[];
  closeModal: () => void;
  addCategory: (category: string) => void;
  removeCategory: (index: number) => void;
};

export default function TaskModalAddCategory({
  categories,
  closeModal,
  addCategory,
  removeCategory,
}: params) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(
    null
  );
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
        className="flex h-full w-full fixed top-0 left-0 justify-center backdrop-blur-sm"
        onClick={closeModal}
      >
        <div
          className="p-2 self-center bg-[#0a4b75] shadow-2xl rounded-lg  h-[300px] w-[400px]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex rounded-lg justify-center bg-[#5191c1] h-[20%] p-1">
            <input
              className="text-3xl rounded-lg h-full w-[90%] align-middle self-center"
              ref={inputRef}
              type="text"
            />
            <button
              className=" rounded-full text-center text-[2.5em] text-[#0a4b75] align-middle justify-center bg-[#00000000] w-[10%] h-full self-center"
              onClick={() => {
                addCategory(inputRef.current?.value ?? "");
              }}
            >
              <IoAddCircleOutline />
            </button>
          </div>
          <div className="h-[80%] mt-1 overflow-auto">
            {categories.map((category, index) => {
              return (
                categories.length != 0 && (
                  <div className="p-1 bg-[#5191c1] m-1 first:mt-0 justify-center last:mb-0 rounded-lg flex">
                    <h2 className="rounded-lg w-[90%] text-2xl bg-[#fb6f24] ">{category}</h2>
                    <button className="text-2xl text-[#044b75] self-center align-middle w-[10%] justify-center items-center ml-1 text-center "
                      onClick={() => {
                        removeCategory(index);
                      }}
                    >
                  <FaMinusCircle />
                    </button>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>,
      modalContainer
    )
  );
}
