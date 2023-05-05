"use client";
import { useEffect, useState } from "react";
import "./styles.css";
import { IoAddOutline } from "react-icons/io5";
import { Roboto } from "next/font/google";
import Tasks from "../tasks";
import useSWR from "swr";
import { data } from "autoprefixer";

type Category = {
  title: string;
  id: number;
  color: string;
};

const roboto = Roboto({
  weight: ["400"],
  subsets: ["latin"],
});

const getCategories = async () => {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const categories: Category[] = await res.json();
  return categories;
};

export default function TodoTasks() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { isLoading, mutate } = useSWR("/api/tasks");

  useEffect(() => {
    const fectCategories = async () => {
      const result = await getCategories();
      setCategories(result);
    };
    fectCategories();
  }, []);

  async function addTask() {
    const res = await fetch("/api/tasks", {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to create a task");
  }

  return (
    <>
      <div className="flex items-center justify-center h-screen ">
        <div className="flex flex-col rounded-xl  h-[500px] w-[800px] bg-[#0a4b75] shadow-2xl p-2">
          <div className="flex justify-between">
            {!isLoading && (
              <button
                onClick={() => {
                  addTask();
                  mutate();
                }}
                className="flex rounded-[4px] bg-[#1e6495] w-10 p-1 m-1 justify-center text-[#0a4b75] text-4xl hover:text-cyan-700 self-center"
              >
                <IoAddOutline />
              </button>
            )}
            <div className="flex self-center">
              <h1 className="self-center text-3xl font-bold text-white">
                Filters
              </h1>
              <div className="flex m-2 bg-[#5191c1] p-2 rounded-md">
                <h1 className="mr-2 font-bold text-2xl text-[#3e3e3e]">
                  Category
                </h1>
                <select
                  className="self-center text-2xl rounded-2xl"
                  name="category"
                  id="cat"
                >
                  <option value=""> -- Select an option</option>
                  {categories.map((value) => {
                    return <option value={value.title}>{value.title}</option>;
                  })}
                </select>
              </div>
              {/* <button
                onClick={() => {
                  setAddCategoryOpen(true);
                }}
              >
                <SlOptionsVertical />
              </button> */}
            </div>
          </div>
          <Tasks />
        </div>
      </div>
      {/* {taskSettingsOpen && (
        <TaskModalSettings
          closeModal={() => setTaskSettingsOpen(false)}
          taskId={taskId.current}
          categories={categories}
        />
      )}
      {addCategoryOpen && (
        <TaskModalAddCategory
          categories={categories}
          closeModal={() => setAddCategoryOpen(false)}
          addCategory={(category: string) => {
            setCategories((categories) => {
              return category !== ""
                ? [...categories, category]
                : [...categories];
            });
          }}
          removeCategory={(index: number) => {
            removeCategoryIndex(index);
          }}
        />
      )} */}
    </>
  );
}
