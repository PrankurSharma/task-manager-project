import { JSONContent } from "@tiptap/react";
export interface Task {
    id: string;
    title: string;
    status: statusType;
    dueOn?: Date | null;
    category: string;
    position: number;
    description?: JSONContent;
    draggableId: statusType;
    attachments: File[]
};

export interface RowProps {
    id: string;
    content: string;
}

export interface ActivityLogType {
    action: string;
    user: string;
    timestamp?: Date;
}

export type statusType = "todo" | "inprogress" | "completed";