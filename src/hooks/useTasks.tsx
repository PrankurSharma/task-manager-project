import { useQuery } from "@tanstack/react-query"
import { fetchTasks } from "../api/taskApi";
import { Task } from "../types/task";
import { auth } from "../api/firebase";

export const useTasks = () => {
    return useQuery<Task[], Error>({
        queryKey: ["tasks"],
        queryFn: () => new Promise((resolve, reject) => {
            fetchTasks((tasks) => resolve(tasks)).catch((error: Error) => reject(error));
        }),
        enabled: !!auth.currentUser
    });
}