"use client";
import { useState } from "react";
import "./styles.css";
import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { ImBlocked } from "react-icons/im";
import { SlOptionsVertical } from "react-icons/sl";

type singleTask = {
  content: string;
  status: "Running" | "Canceled" | "Completed";
  priority: "High" | "Normal" | "Low";
  category?: string;
};

export default function TodoTasks() {
  const [tasks, setTasks] = useState<singleTask[]>([]);

  const setTaskStatus = (id: number, st: "Canceled" | "Completed") => {
    // if (tasks[id].status == "Running")
    //   setTasks((tasksArray) => {
    //     tasksArray[id].status = st
    //     return tasksArray;
    //   });

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
      <h2>No Tasks</h2>
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
              } rounded-[4px]`}
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
                <button>
                  <SlOptionsVertical />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col ju h-96 w-[600px] bg-[#0a4b75] p-4 shadow-2xl">
        <div className="flex justify-between">
          <button
            onClick={addTask}
            className="flex rounded-[4px] bg-[#1e6495] w-10 p-1 m-1 justify-center text-[#0a4b75] text-4xl hover:text-cyan-700"
          >
            <IoAddOutline />
          </button>
          <div className="flex self-center">
            <h1 className="self-center">Filters</h1>
            <div className="flex m-2">
              <h1>Category</h1>
              <select name="category" id="cat">
                <option value=""> -- Select an option</option>
              </select>
            </div>
          </div>
        </div>
        {tasksJsx}
      </div>
    </div>
  );
}
