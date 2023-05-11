import { Category } from "@prisma/client";
import Task from "../task";
import useSWR from "swr";

type Task = {
  id: number;
  title: string;
  categoryId: number;
  category: Category;
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

type Params = {
  currentCatId: null | number;
  openTaskSettings: () => void;
  setCurrentTask: (id: number) => void;
  setCurrentTaskCategory: (id: number) => void;
};

export default function Tasks({
  currentCatId,
  openTaskSettings,
  setCurrentTask,
  setCurrentTaskCategory,
}: Params) {
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
        {data
          .filter((task) => {
            return currentCatId
              ? task.categoryId === currentCatId
              : task.category !== null;
          })
          .map((current) => (
            <Task
              taskProps={current}
              openTaskSettings={openTaskSettings}
              setCurrentTask={setCurrentTask}
              setCurrentTaskCategory={setCurrentTaskCategory}
            />
          ))}
      </div>
    )
  );
}
