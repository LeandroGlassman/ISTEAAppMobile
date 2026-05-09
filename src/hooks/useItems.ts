import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  reminderAt?: number;
  notificationId?: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = "@tasks_list";

export function useItems() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
    } catch (e) {
      console.error("[useItems] getItem error:", e);
    } finally {
      setLoading(false);
    }
  };

  const persist = async (updated: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("[useItems] setItem error:", e);
    }
  };

  const addTask = useCallback(
    async (data: Omit<Task, "id" | "completed" | "createdAt">) => {
      const newTask: Task = {
        ...data,
        id: Date.now().toString(),
        completed: false,
        createdAt: Date.now(),
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      await persist(updated);
      return newTask;
    },
    [tasks]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const updated = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updated);
      await persist(updated);
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const updated = tasks.filter(t => t.id !== id);
      setTasks(updated);
      await persist(updated);
    },
    [tasks]
  );

  return { tasks, loading, addTask, toggleTask, deleteTask };
}
