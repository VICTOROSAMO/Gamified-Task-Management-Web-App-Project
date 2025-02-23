import { Timestamp } from "firebase/firestore";

export interface Task {
  id?: string; // Firestore auto-generates IDs
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: number | Timestamp; // ✅ Allow both Firestore Timestamp & number
  userId: string;
}
