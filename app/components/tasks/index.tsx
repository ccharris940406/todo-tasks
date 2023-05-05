import Task from "../task";
import useSWR from "swr";

type Task = {
  id: number;
  title: string;
  category: number;
  completed: boolean;
  canceled: boolean;
};

async function getTasks(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed");
  }
  const data: Task[] = await res.json();
  return data;
}

export default function Tasks() {
  const { data, isLoading, error } = useSWR("/api/tasks", getTasks);

  async function addTask() {
    const res = await fetch("/api/tasks", {
      method: "POST",
    });
  }

  if (error) {
    return <h1>{error}</h1>;
  } else if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return !data || data.length === 0 ? (
    <h1>No Tasks</h1>
  ) : (
    data && (
      <div className="overflow-auto flex flex-col p-4 m-2">
        {data.map((current) => (
          <Task task_props={current} />
        ))}
      </div>
    )
  );
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
