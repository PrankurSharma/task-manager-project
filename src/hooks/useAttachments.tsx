import { useQuery } from "@tanstack/react-query"
import { fetchAttachments } from "../api/taskApi";
import { auth } from "../api/firebase";

export const useAttachments = (taskId: string) => {
    return useQuery({
        queryKey: ["attachments", taskId],
        queryFn: () => fetchAttachments(taskId),
        enabled: !!taskId && !!auth.currentUser,
    });
}