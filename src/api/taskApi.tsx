import { addDoc, collection, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy, getDocs, writeBatch, where, limit, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "./firebase"
import { ActivityLogType, Task } from "../types/task";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const fetchTasks = async (callback: (tasks: Task[]) => void) => {
    const q = query(collection(db, "tasks"), where("userId", "==", auth.currentUser?.uid), orderBy("status"), orderBy("position"));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), dueOn: doc.data().dueOn?.toDate() } as Task));
    callback(tasks);
}

export const addTask = async (task: Omit<Task, "id">) => {
    const { attachments, ...rest } = task;
    const docRef = await addDoc(collection(db, "tasks"), {
        ...rest,
        userId: auth.currentUser?.uid
    });
    return docRef;
}

export const getLastPosition = async () => {
    const tasksRef = collection(db, "tasks");

    const q = query(tasksRef, orderBy("position", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    const lastPos = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().position : 0;
    return lastPos;
}

export const updateTask = async (tasks: Task[], task: Task, fromDrag: boolean) => {
    const batch = writeBatch(db);
    tasks.forEach((val) => {
        const docRef = doc(db, "tasks", val.id);
        const { attachments, ...rest } = val;
        batch.update(docRef, { ...rest, userId: auth.currentUser?.uid });
    });
    batch.commit();
}

export const deleteTasks = async (taskIds: string[]) => {
    await Promise.all(taskIds.map(id => deleteDoc(doc(db, "tasks", id))));
}

export const changeTasksStatus = async (taskIds: string[], status: Task["status"]) => {
    console.log("Calling change task status...");
    await Promise.all(taskIds.map(id => updateDoc(doc(db, "tasks", id), { status: status, draggableId: status })));
}

export const getActivityLog = async (taskId: string) => {
    const activityRef = collection(db, "tasks", taskId, "activityLog");
    const q = query(activityRef, orderBy("timestamp"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate() } as ActivityLogType));
}

export const addActivityLog = async (taskIds: string[], log: ActivityLogType) => {
    const batch = writeBatch(db);
    taskIds.forEach((taskId) => {
        const activityRef = doc(collection(db, "tasks", taskId, "activityLog"));
        batch.set(activityRef, {...log, timestamp: serverTimestamp()});
    });
    console.log("adding batches...");
    await batch.commit();
}

export const fetchAttachments = async (taskId: string) => {
    const querySnapshot = await getDocs(collection(db, "tasks", taskId, "attachments"));
  
    return querySnapshot.docs.map((doc) => ({
      ...doc.data() // File metadata (name, url, size, uploadedBy, createdAt)
    }));
  };

export const addAttachments = async (taskId: string, attachments: File[], uploadedBy: string) => {
    const batch = writeBatch(db);

    const uploadPromises = attachments.map(async (file) => {
        const snapshot = await uploadBytes(ref(storage, `tasks/${taskId}/${file.name}`), file);
        const fileUrl = await getDownloadURL(snapshot.ref);
        batch.set(doc(collection(db, "tasks", taskId, "attachments")), {
            name: file.name,
            url: fileUrl,
            size: file.size,
            uploadedBy,
            createdAt: new Date().toISOString()
        });
    });
    await Promise.all(uploadPromises);
    await batch.commit();
}