import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db, tasksCollection } from "../services/firebase";
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { Task } from "../types/Task";

// Define the type for the TaskContext
interface TaskContextType {
  tasks: Task[];
  createTask: (title: string, description: string, dueDate?: Date) => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth(); // Get the logged-in user

  // 🔹 Fetch tasks from Firestore when the user logs in
  useEffect(() => {
    if (!user) return;
  
    console.log("Fetching tasks for user:", user.uid); // Debugging log
  
    const fetchTasks = async () => {
      try {
        const q = query(tasksCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
  
        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
  
        console.log("Fetched tasks:", fetchedTasks);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, [user]);
  

  // 🔹 Function to add a new task to Firestore
  const createTask = async (title: string, description: string, dueDate?: Date) => {
    if (!user) {
      console.error("User is not logged in! Task creation blocked.");
      return;
    }

    try {
      const newTask = {
        title,
        description,
        status: "pending",
        createdAt: Timestamp.now(),
        dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
        userId: user.uid,
      };

      console.log("Attempting to save task:", newTask); // Debugging log

      const docRef = await addDoc(tasksCollection, newTask);
      console.log("Task added successfully:", docRef.id);

      setTasks((prev) => [
        ...prev,
        {
          id: docRef.id,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status as "pending" | "in-progress" | "completed", // 🔹 Ensure `status` type is correct
          createdAt: newTask.createdAt,
          dueDate: newTask.dueDate ?? null, // 🔹 Ensure `dueDate` is never undefined
          userId: newTask.userId,
        },
      ]);
      
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 🔹 Function to update a task's status
  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: status as "pending" | "in-progress" | "completed" } // 🔹 Ensure correct type
            : task
        )
      );
      
      console.log(`Task ${taskId} status updated to ${status}`);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // 🔹 Function to delete a task from Firestore
  const deleteTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      console.log(`Task ${taskId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, createTask, updateTaskStatus, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use TaskContext
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask must be used within a TaskProvider");
  return context;
};
