import { Inter } from "next/font/google";
import TodoTasks from "./components/todo-tasks";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <TodoTasks />; 
}
