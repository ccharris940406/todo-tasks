"use client";
import { useState } from "react";
import "./styles.css";
import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import {IoAddOutline } from "react-icons/io5"
type singleTask = {
  content: string;
  status: "Running" | "Canceled" | "Completed";
};

export default function TodoTasks() {
  const [tasks, setTasks] = useState<singleTask[]>([]);
  const [tasksId, setTasksId] = useState(0);

  const addTask = () => {
    setTasksId(tasksId + 1);
    const newTask: singleTask = { content: "", status: "Running" };
    setTasks([...tasks, newTask]);
  };

  const tasksJsx =
    tasks.length === 0 ? (
      <h2>No Tasks</h2>
    ) : (
      <div className="overflow-auto flex flex-col p-3">
        {tasks.map((current, index) => {
          return (
            <div key={index} className="m-1 p-2 flex flex-row justify-between bg-[#e17572] rounded-[4px] ">
              <input
                placeholder="Task Name"
                className="p-2 w-[90%] bg-[#e0eebd]"
                value={current.content}
                onChange={(event) =>
                  setTasks(
                    tasks.map((task, i) =>
                      i === index
                        ? { ...task, content: event.target.value }
                        : task
                    )
                  )
                }
              />
              <div className="flex">
                <button
                  key={index}
                  className="p-1 m-1 text-[#2b0b16] text-2xl hover:text-green-700"
                >
                  <FaCheckCircle />
                </button>
                <button
                  key={index}
                  className="p-1 m-1 text-[#2b0b16] text-2xl hover:text-red-700"
                >
                  <RxCrossCircled />
                </button>
                <button
                  key={index}
                  className="p-1 m-1 text-[#2b0b16] text-2xl hover:text-gray-800"
                >
                  <FaMinusCircle />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col ju h-96 w-[600px] bg-[#2b0b16] p-4 shadow-2xl">
        <button
          onClick={addTask}
          className="flex rounded-[4px] bg-[#ce1446] w-10 p-1 m-1 justify-center text-[#405059] text-4xl hover:text-cyan-700">
          <IoAddOutline />
        </button>
        {tasksJsx}
      </div>
    </div>
  );
}
