import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  reminderAt?: number;
  notificationId?: string;
  completed: boolean;
  createdAt: number;
}

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  addTask: (
    data: Omit<Task, "id" | "completed" | "createdAt">
  ) => Promise<Task>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const STORAGE_KEY = "@tasks_list";
const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setTasks(JSON.parse(stored));
      } catch (e) {
        console.error("[Tasks] load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (updated: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("[Tasks] persist error:", e);
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
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updated);
      await persist(updated);
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (target?.notificationId) {
        try {
          await Notifications.cancelScheduledNotificationAsync(target.notificationId);
        } catch (e) {
          console.warn("[Tasks] no se pudo cancelar la notificación:", e);
        }
      }
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      await persist(updated);
    },
    [tasks]
  );

  return (
    <TasksContext.Provider
      value={{ tasks, loading, addTask, toggleTask, deleteTask }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks debe usarse dentro de TasksProvider");
  return ctx;
}
