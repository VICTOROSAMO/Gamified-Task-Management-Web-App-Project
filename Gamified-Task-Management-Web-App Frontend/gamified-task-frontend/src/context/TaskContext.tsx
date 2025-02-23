import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { tasksCollection } from "../services/firebase";
import {onSnapshot, query, where, addDoc } from "firebase/firestore";
import { Task } from "../types/Task";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  tasks: Task[];
  createTask: (title: string, description: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  // 🔹 Fetch tasks from Firestore when the user logs in
  useEffect(() => {
    if (!user) return;

    const q = query(tasksCollection, where("userId", "==", user.uid));
    
    // Real-time listener for Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Task[];
      setTasks(taskList);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [user]);

  const createTask = async (title: string, description: string) => {
    if (!user) return;
    const newTask: Task = {
      title,
      description,
      status: "pending",
      createdAt: Date.now(),
      userId: user.uid,
    };

    await addDoc(tasksCollection, newTask);
  };

  return (
    <TaskContext.Provider value={{ tasks, createTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask must be used within a TaskProvider");
  return context;
};
