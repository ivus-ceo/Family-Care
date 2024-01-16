<template>
	<UPopover
		v-if="state.users.length > 0"
		class="pointer-events-auto"
		:popper="{ placement: 'bottom-start', overflowPadding: 0 }"
		:ui="{ 'width': 'w-[calc(100%-2.5rem)]' }"
		overlay
	>
		<UButton
			class="rounded-xl"
			size="xl"
			color="gray"
			icon="i-heroicons-user-group-20-solid"
			:style="{ 'box-shadow': 'none' }"
			@click="handleClick"
		/>

		<template #panel>
			<UTabs
				orientation="vertical"
				:items="state.users"
				:ui="ui"
				v-model="selected"
			>
				<template #default="{ item, index, selected }">
					<div class="flex items-center gap-2 relative truncate rounded-xl">
						<UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

						<span class="truncate">{{ item.label }}</span>
					</div>
				</template>
			</UTabs>
		</template>
	</UPopover>
</template>

<script setup lang="ts">
import type { ProfileWithGeolocation, Switch } from "~/types";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { LocalNotifications } from "@capacitor/local-notifications";

const store = useStore()

const ui = {
	'wrapper': 'relative space-y-0',
	'list': {
		'height': 'h-16',
		'tab': {
			'height': 'h-14',
		}
	}
}

const state = reactive({
	users: [] as Switch[],
})

if (store.team) {
	store.team.map((profile: ProfileWithGeolocation) => {
		state.users.push({
			label: `${profile.first_name} ${profile.last_name}`,
			icon: 'i-heroicons-user-20-solid',
			user: profile,
		})
	})
}

const selected = computed({
	get() {
		const index = state.users.findIndex((item) => item.user.id === store.user?.id)
		return (index !== -1) ? index : 0
	},
	async set(index: number) {
		store.chosenUser = state.users[index]['user']
		await Haptics.impact({ style: ImpactStyle.Heavy })
	}
})

const handleClick = async (): Promise<void> => {
	await Haptics.impact({ style: ImpactStyle.Heavy });
	await LocalNotifications.requestPermissions()
}
</script>

<style scoped>

</style>