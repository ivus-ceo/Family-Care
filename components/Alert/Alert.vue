<template>
	<div class="mx-5 mb-2">
		<UButton
			class="rounded-xl font-bold"
			size="xl"
			color="red"
			block
			:style="{ 'box-shadow': 'none' }"
			@click="handleClick"
		>
			Alert
		</UButton>
	</div>
</template>

<script setup lang="ts">
import { LocalNotifications } from "@capacitor/local-notifications";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import type { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import type { Geolocation, ProfileWithGeolocation } from "~/types";

const store = useStore()
const supabase = useSupabaseClient()

const handleClick = async () => {
	await Haptics.impact({ style: ImpactStyle.Heavy });
	const { error } = await supabase.from('notifications').insert({
		profile_id: store.user!.id,
	} as never)
}

const handleRealtimeNotification = (payload: RealtimePostgresChangesPayload<any>) => {
	const newNotification = payload['new']
	store.team.map(async (profile: ProfileWithGeolocation) => {
		// if (profile.id !== newNotification.profile_id) {
			await LocalNotifications.schedule({
				notifications: [
					{
						title: 'Alert',
						body: 'Danger',
						id: 1,
						schedule: { at: new Date(Date.now() + 1000) },
						sound: undefined,
						attachments: undefined,
						actionTypeId: '',
						extra: null,
					},
				],
			});
		// }
	})
}

/**
 * Realtime notifications
 */
supabase
	.channel('table-db-changes')
	.on('postgres_changes',
		{
			event: '*',
			schema: 'public',
			table: 'notifications',
		},
		handleRealtimeNotification
	)
	.subscribe()
</script>

<style scoped>

</style>