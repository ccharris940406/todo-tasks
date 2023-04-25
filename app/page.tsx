import { Roboto } from "next/font/google";
import TodoTasks from "./components/todo-tasks";

const inter = Roboto({
  subsets: ["latin"],
  weight: "100"
});

export default function Home() {
  return <TodoTasks />; 
}
