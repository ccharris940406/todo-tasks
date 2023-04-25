"use client";
import {  useRef, useState } from "react";
import "./styles.css";
import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { ImBlocked } from "react-icons/im";
import { SlOptionsVertical } from "react-icons/sl";
import TaskModalSettings from "../task-modal-settings";
import TaskModalAddCategory from "../task-modal-add-category";

type singleTask = {
  content: string;
  status: "Running" | "Canceled" | "Completed";
  priority: "High" | "Normal" | "Low";
  category?: string;
};

export default function TodoTasks() {
  const [tasks, setTasks] = useState<singleTask[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [taskSettingsOpen, setTaskSettingsOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);

  const select = useRef<HTMLSelectElement | null>(null);
  const taskId = useRef<singleTask | null> (null)

  const removeCategoryIndex = (index: number) => {
    setCategories((current) => {
      return index > -1
        ? current.filter((_, indx) => {
            return indx !== index;
          })
        : current;
    });
  };

  const setTaskStatus = (id: number, st: "Canceled" | "Completed") => {
    setTasks(
      tasks.map((task, index) =>
        index === id && task.status === "Running"
          ? { ...task, status: st }
          : task
      )
    );
  };

  const removeTask = (id: number) => {
    let result: singleTask[] = [];
    for (let i = 0; i < tasks.length; i++) {
      if (id != i) result.push(tasks[i]);
    }
    console.log(result);
    setTasks(result);
  };
  const addTask = () => {
    if (tasks.length > 0 && tasks[tasks.length - 1].content == "") return;
    const newTask: singleTask = {
      content: "",
      status: "Running",
      priority: "Normal",
    };
    setTasks([...tasks, newTask]);
  };

  const tasksJsx =
    tasks.length === 0 ? (
      <div className={`flex h-full w-full justify-center items-center`}>
        <h2 className="text-4xl bg-[#5191c1] p-5 rounded-lg shadow-xl text-[#0a4b75]">
          No Tasks
        </h2>
      </div>
    ) : (
      <div className="overflow-auto flex flex-col p-3">
        {tasks.map((current, index) => {
          return (
            <div
              key={index}
              className={`m-1 p-2 h-14 flex flex-row justify-between ${
                current.status === "Running"
                  ? "bg-[#5191c1]"
                  : current.status === "Canceled"
                  ? "bg-[#fb6f24]"
                  : "bg-[#8ca315]"
              } rounded-[4px]
              ${current.category !== select.current?.value &&
                select.current?.value !== ""
                  ? "hidden"
                  : ""
              }
              `}
            >
              <input
                placeholder="Task Name"
                className="p-2 w-[90%] bg-[#e0eebd] rounded-2xl"
                value={current.content}
                onChange={(event) =>
                  setTasks(
                    tasks.map((task, i) =>
                      i === index && task.status === "Running"
                        ? { ...task, content: event.target.value }
                        : task
                    )
                  )
                }
              />
              <div className="flex">
                <button
                  onClick={() => {
                    setTaskStatus(index, "Completed");
                  }}
                  className={`p-1 m-1 text-[#0a4b75] text-2xl ${
                    tasks[index].status === "Running"
                      ? "hover:text-[#8ca315]"
                      : ""
                  }`}
                >
                  <FaCheckCircle />
                </button>
                <button
                  onClick={() => {
                    setTaskStatus(index, "Canceled");
                  }}
                  className={`p-1 m-1 text-[#0a4b75] text-2xl ${
                    tasks[index].status === "Running"
                      ? "hover:text-[#fb6f24]"
                      : ""
                  }`}
                >
                  <ImBlocked />
                </button>
                <button
                  onClick={() => {
                    removeTask(index);
                  }}
                  className="p-1 m-1 text-[#0a4b75] text-2xl hover:text-black"
                >
                  <FaMinusCircle />
                </button>
                <button
                  onClick={() => {
                    taskSettingsOpen === true
                      ? setTaskSettingsOpen(false)
                      : setTaskSettingsOpen(true);
                    taskId.current = tasks[index]
                  }}
                >
                  <SlOptionsVertical />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );

  return (
    <>
      <div className="flex items-center justify-center h-screen ">
        <div className="flex flex-col rounded-xl  h-[500px] w-[800px] bg-[#0a4b75] shadow-2xl p-2">
          <div className="flex justify-between">
            <button
              onClick={addTask}
              className="flex rounded-[4px] bg-[#1e6495] w-10 p-1 m-1 justify-center text-[#0a4b75] text-4xl hover:text-cyan-700 self-center"
            >
              <IoAddOutline />
            </button>
            <div className="flex self-center">
              <h1 className="self-center text-3xl font-bold text-white">Filters</h1>
              <div className="flex m-2 bg-[#5191c1] p-2 rounded-md">
                <h1 className="mr-2 font-bold text-2xl text-[#3e3e3e]">Category</h1>
                <select
                  className="self-center text-2xl rounded-2xl"
                  name="category"
                  ref={select}
                  id="cat"
                  onChange={() => {
                    setTasks((tas) => {
                      return [...tas];
                    });
                  }}
                >
                  <option value=""> -- Select an option</option>
                  {categories.map((value) => {
                    return <option value={value}>{value}</option>;
                  })}
                </select>
              </div>
              <button
                onClick={() => {
                  setAddCategoryOpen(true);
                }}
              >
                <SlOptionsVertical />
              </button>
            </div>
          </div>
          {tasksJsx}
        </div>
      </div>
      {taskSettingsOpen && (
        <TaskModalSettings closeModal={() => setTaskSettingsOpen(false)} taskId={taskId.current} categories={categories} />
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
      )}
    </>
  );
}
