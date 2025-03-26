import { useQuery } from "@tanstack/react-query"
import { getActivityLog } from "../api/taskApi";
import { auth } from "../api/firebase";

export const useActivityLog = (taskId: string) => {
    return useQuery({
        queryKey: ["activityLogs", taskId],
        queryFn: () => getActivityLog(taskId),
        enabled: !!taskId && !!auth.currentUser,
    });
}