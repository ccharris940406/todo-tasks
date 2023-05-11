"use client";
import { useState } from "react";
import "./styles.css";
import { IoAddOutline } from "react-icons/io5";
import Tasks from "../tasks";
import useSWR from "swr";
import { SlOptionsVertical } from "react-icons/sl";
import TaskModalAddCategory from "../task-modal-add-category";
import TaskModalSettings from "../task-modal-settings";

type Category = {
  title: string;
  id?: number;
  color: string;
};

const getCategories = async (key: string) => {
  const res = await fetch(key);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const categories: Category[] = await res.json();
  return categories;
};

const addCategory = async (key: string, catTitle: string, catColor: string) => {
  console.log(`${key}/title/${catTitle}/${catColor}`);
  const res = await fetch(`${key}/title/${catTitle}/${catColor}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed creating category");
  return res.status;
};

const removeCategory = async (id: number) => {
  const res = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed deleting category");
  return res.json();
};

export default function TodoTasks() {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [taskSettingsOpen, setTaskSettingsOpen] = useState(false);
  const [currentTaskCategory, setCurrentTaskCategory] = useState<number | null>(
    null
  );
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<
    number | null
  >(null);
  const [currentTask, setCurrentTask] = useState<number | null>(null);
  const { isLoading, mutate } = useSWR("/api/tasks");
  const { data: dataCategories, mutate: mutateCategories } = useSWR(
    "/api/categories",
    getCategories
  );

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
            <button
              onClick={() => {
                addTask();
                mutate();
              }}
              className="flex rounded-[4px] bg-[#1e6495] w-10 p-1 m-1 justify-center text-[#0a4b75] text-4xl hover:text-cyan-700 self-center"
            >
              {!isLoading ? (
                <IoAddOutline />
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}
            </button>
            <div className="flex self-center">
              <h1 className="self-center text-3xl font-bold text-white">
                Filters
              </h1>
              <div className="flex m-2 bg-[#5191c1] p-2 rounded-md">
                <h1 className="mr-2 font-bold text-2xl text-[#3e3e3e]">
                  Category
                </h1>
                <select
                  onChange={(event) =>
                    setCurrentCategoryFilter(+event.currentTarget.value)
                  }
                  className="self-center text-2xl rounded-2xl"
                  name="category"
                  id="cat"
                >
                  <option value=""> -- Select an option</option>
                  {dataCategories?.map((value) => {
                    return <option value={value.id}>{value.title}</option>;
                  })}
                </select>
              </div>
              {
                <button
                  onClick={() => {
                    setAddCategoryOpen(true);
                  }}
                >
                  <SlOptionsVertical />
                </button>
              }
            </div>
          </div>
          <Tasks
            currentCatId={currentCategoryFilter}
            openTaskSettings={() => setTaskSettingsOpen(true)}
            setCurrentTask={(id) => {
              setCurrentTask(() => {
                return id;
              });
            }}
            setCurrentTaskCategory={(id) => {
              setCurrentTaskCategory(() => {
                return id;
              });
            }}
          />
        </div>
      </div>
      {taskSettingsOpen && (
        <TaskModalSettings
          currentTask={currentTask}
          currentTaskCategory={currentTaskCategory}
          closeModal={() => setTaskSettingsOpen(false)}
        />
      )}
      {addCategoryOpen && (
        <TaskModalAddCategory
          categories={dataCategories ?? []}
          closeModal={() => setAddCategoryOpen(false)}
          addCategory={(category: string, color: string) => {
            addCategory("/api/categories", category, color.substring(1));
            dataCategories
              ? mutateCategories([
                  ...dataCategories,
                  { title: category, color: color },
                ])
              : true;
          }}
          removeCategory={(id) => {
            removeCategory(id);
            mutateCategories();
          }}
        />
      )}
    </>
  );
}
