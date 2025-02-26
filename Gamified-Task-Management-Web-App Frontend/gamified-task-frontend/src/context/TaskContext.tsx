import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { tasksCollection } from "../services/firebase";
import { addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { Task } from "../types/Task";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  tasks: Task[];
  createTask: (title: string, description: string, dueDate: Date) => Promise<void>; // 🔹 Updated function signature
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}


const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  // Fetch tasks from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(tasksCollection, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Task[];
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  const createTask = async (title: string, description: string, dueDate: Date) => {
    if (!user) return;
  
    await addDoc(tasksCollection, {
      title,
      description,
      status: "pending",
      createdAt: Date.now(), // Save timestamp
      dueDate: dueDate.getTime(), // Convert date to timestamp
      userId: user.uid,
    });
  };
  

  const updateTaskStatus = async (taskId: string, status: string) => {
    const taskRef = doc(tasksCollection, taskId);
    await updateDoc(taskRef, { status });
  };

  const deleteTask = async (taskId: string) => {
    const taskRef = doc(tasksCollection, taskId);
    await deleteDoc(taskRef);
  };

  return (
    <TaskContext.Provider value={{ tasks, createTask, updateTaskStatus, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask must be used within a TaskProvider");
  return context;
};

