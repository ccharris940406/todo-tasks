import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { SlOptionsVertical } from "react-icons/sl";
import useSWR from "swr";

type Task = {
  id: number;
  title: string;
  category: number;
  completed: boolean;
  canceled: boolean;
};

const getTask = async (key: string) => {
  const res = await fetch(key);

  if (!res.ok) throw new Error("Failed to get task");
  const result: Task = await res.json();
  return result;
};

export default function Task({ task_props }: { task_props: Task }) {
  const { data, isLoading, error, mutate } = useSWR(
    `/api/tasks/${task_props.id}`,
    getTask
  );

  async function setTitle(arg: number, newTitle: string) {
    await fetch(`/api/tasks/${arg}`, {
      method: "PUT",
      body: JSON.stringify({ title: newTitle }),
    });
  }

  async function setCompleted(arg: number) {
    await fetch(`/api/tasks/${arg}`, {
      method: "PUT",
      body: JSON.stringify({ completed: true }),
    });
  }
  async function setCanceled(arg: number) {
    await fetch(`/api/tasks/${arg}`, {
      method: "PUT",
      body: JSON.stringify({ canceled: true }),
    });
  }

  async function removeTask(arg: number) {
    await fetch(`/api/tasks/${arg}`, { method: "DELETE" });
  }

  if (error) return <h1>Error</h1>;
  if (isLoading) return <h1>Loadin..</h1>;
  if (data) {
    return (
      <div
        key={`task_${data.id}`}
        className={`m-1 p-2 h-14 flex flex-row justify-between ${
          data.canceled === true
            ? "bg-[#fb6f24]"
            : data.completed === true
            ? "bg-[#8ca315]"
            : "bg-[#5191c1]"
        } rounded-[4px]
              `}
      >
        <input
          type="text"
          placeholder="Task Name"
          className="p-2 w-[90%] bg-[#e0eebd] rounded-2xl "
          value={data.title}
          onChange={(event) => {
            setTitle(data.id, event.target.value);
            mutate({ ...data, title: event.target.value });
          }}
          disabled={
            data.canceled !== true && data.completed !== true ? false : true
          }
        />
        <div className="flex">
          <button
            onClick={async () => {
              // trigger(data.id);
              await setCompleted(data.id);
              mutate({ ...data, completed: true });
            }}
            disabled={
              data.canceled !== true && data.completed !== true ? false : true
            }
            className={`p-1 m-1 text-[#0a4b75] text-2xl ${
              data.completed !== true && data.canceled !== true
                ? "hover:text-[#8ca315]"
                : "hover:cursor-not-allowed"
            }`}
          >
            <FaCheckCircle />
          </button>
          <button
            className={`p-1 m-1 text-[#0a4b75] text-2xl ${
              data.canceled !== true && data.completed !== true
                ? "hover:text-[#fb6f24]"
                : "hover:cursor-not-allowed"
            }`}
            disabled={
              data.canceled !== true && data.completed !== true ? false : true
            }
            onClick={async () => {
              await setCanceled(data.id);
              mutate({ ...data, canceled: true });
            }}
          >
            <ImBlocked />
          </button>
          <button
            className={`p-1 m-1 text-[#0a4b75] text-2xl ${
              data.canceled !== true || data.completed !== true
                ? "hover:text-[#000000]" : true
            }`}
            onClick={() => {
              removeTask(data.id);
              mutate();
            }}
          >
            <FaMinusCircle />
          </button>
          <button>
            <SlOptionsVertical />
          </button>
        </div>
      </div>
    );
  } else return <></>;
}

/*
  const tasksJsx =
    tasks.length === 0 ? (
      <div
        className={`flex h-full w-full justify-center items-center ${roboto.className}`}
      >
        <h2 className="text-4xl bg-[#5191c1] p-5 rounded-lg shadow-xl text-[#0a4b75]">
          No Tasks
        </h2>
      </div>
    ) : (
      <div className="overflow-auto flex flex-col p-3">
        {tasks
          .filter((element) =>
            currentCategory !== ""
              ? element.category?.title === currentCategory
              : 1
          )
          .map((current, index) => {
            return (
              <div
                key={current.id}
                className={`m-1 p-2 h-14 flex flex-row justify-between ${
                  current.canceled === true
                    ? "bg-[#fb6f24]"
                    : current.completed === true
                    ? "bg-[#8ca315]"
                    : "bg-[#5191c1]"
                } rounded-[4px]
              `}
              >
                <input
                  placeholder="Task Name"
                  className="p-2 w-[90%] bg-[#e0eebd] rounded-2xl"
                  value={current.title}
                  onChange={(event) =>
                    setTasks(
                      tasks.map((task) =>
                        task.id === current.id && task.completed !== true
                          ? { ...task, title: event.target.value }
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
                      taskId.current = tasks[index];
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
    
  */
