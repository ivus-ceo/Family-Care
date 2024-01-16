import { useStore } from "@/stores";

export default async function redirectIfNotLoggedIn(): Promise<void> {
    const store = useStore()
    if (!store.isLoggedIn) navigateTo('/auth/login')
}