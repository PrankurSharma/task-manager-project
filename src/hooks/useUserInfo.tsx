import { useQuery } from "@tanstack/react-query"
import { User } from "firebase/auth"
import { auth } from "../api/firebase";

export const useUserInfo = () => {
    return useQuery<User | null, Error>({
        queryKey: ["user"],
        queryFn: async () => {
            return new Promise((resolve, reject) => {
                const unsubscribe = auth.onAuthStateChanged((user) => {
                    unsubscribe();
                    resolve(user);
                }, reject);
            });
        },
        staleTime: Infinity
    });
}