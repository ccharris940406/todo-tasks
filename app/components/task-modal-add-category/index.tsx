import { SetStateAction, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaMinusCircle } from "react-icons/fa";
import { ChromePicker } from "react-color";
import useSWR from "swr";

type Category = {
  title: string;
  id?: number;
  color?: string;
};

type params = {
  categories: Category[];
  closeModal: () => void;
  removeCategory: (id: number) => void;
};

export default function TaskModalAddCategory({
  categories,
  closeModal,
  removeCategory,
}: params) {
  const [colorPicker, setColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(
    null
  );
  const { data: dataCategories, mutate: categoriesMutate } =
    useSWR("/api/categories");

  const addCategory = async (
    key: string,
    catTitle: string,
    catColor: string
  ) => {
    const res = await fetch(`${key}`, {
      method: "POST",
      body: JSON.stringify({
        title: catTitle,
        color: catColor.substring(1),
      }),
    });
    if (!res.ok) throw new Error("Failed creating category");
    const cate: Category = await res.json();
    return cate;
  };
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

  const handeColor = (col: { hex: SetStateAction<string> }) => {
    const stringColor = col.hex.toString();
    setCurrentColor(() => {
      return stringColor;
    });
  };

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
                const newCat = addCategory(
                  "/api/categories",
                  inputRef.current?.value ?? "",
                  currentColor
                );
                categoriesMutate([...dataCategories, newCat]);
              }}
            >
              <IoAddCircleOutline />
            </button>
            <button
              style={{ backgroundColor: currentColor }}
              className={`w-5 rounded-xl`}
              onClick={() =>
                setColorPicker(() => {
                  return !colorPicker;
                })
              }
            ></button>
            {colorPicker && (
              <div className="absolute z-10 inline-block w-64">
                <ChromePicker color={currentColor} onChange={handeColor} />
              </div>
            )}
          </div>
          <div className="h-[80%] mt-1 overflow-auto">
            {categories.map((category) => {
              return (
                categories.length != 0 && (
                  <div className="p-1 bg-[#5191c1] m-1 first:mt-0 justify-center last:mb-0 rounded-lg flex">
                    <h2
                      style={{
                        backgroundColor: `#${
                          category.color ? category.color : "#ffffff"
                        }`,
                      }}
                      className="rounded-lg w-[90%] text-2xl"
                    >
                      {category.title}
                    </h2>
                    <button
                      className="text-2xl text-[#044b75] self-center align-middle w-[10%] justify-center items-center ml-1 text-center "
                      onClick={() => {
                        removeCategory(category.id ? category.id : 0);
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
