// @ts-ignore
import { defineStore } from 'pinia'
import type { Geolocation, ProfileWithGeolocation, User } from "~/types";
import type { Ref } from "vue";

export const useStore = defineStore('store', () => {
    /**
     * State
     */
    const supabase = useSupabaseClient()
    const user: Ref<User|null> = ref(null)
    const team: Ref<ProfileWithGeolocation[]|null> = ref<ProfileWithGeolocation[]|null>(null)
    const chosenUser: Ref<ProfileWithGeolocation|null> = ref<ProfileWithGeolocation|null>(null)

    /**
     * Getters
     */
    const isLoggedIn = computed((): boolean => {
        return !!user.value;
    })

    /**
     * Actions
     */
    const getUser = async () => {
        const supabaseUser = useSupabaseUser()
        if (supabaseUser.value) user.value = supabaseUser.value as User
        return user
    }

    const getTeam = async () => {
        const teamCode = user.value?.user_metadata.team_code

        if (!isLoggedIn.value && !teamCode) return

        const { data, error } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, team_code, geolocations (latitude, longitude)')
            .eq('team_code', teamCode as string)

        team.value = data as unknown as ProfileWithGeolocation[]
        return team;
    }

    return {
        user,
        team,
        chosenUser,
        isLoggedIn,
        getUser,
        getTeam,
    }
})