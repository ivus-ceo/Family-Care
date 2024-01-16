<template>
	<UTabs
		class="mx-5 mb-5"
		:ui="ui"
		:items="tabs"
		v-model="selected"
	>
		<template #default="{ item, index, selected }">
			<div class="flex flex-col items-center gap-0 relative truncate">
				<UIcon :name="item.icon" class="w-6 h-6 flex-shrink-0" />

				<span class="truncate">{{ item.label }}</span>

				<span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
			</div>
		</template>
	</UTabs>
</template>

<script setup lang="ts">
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useStore } from "~/stores";
import type { Tab } from "~/types";

const store = useStore()
const route = useRoute()

const ui = {
	"wrapper": "relative space-y-2",
	"container": "relative w-full",
	"base": "focus:outline-none",
	"list": {
		"base": "relative",
		"background": "bg-gray-100 dark:bg-gray-800",
		"rounded": "rounded-xl",
		"shadow": "",
		"padding": "p-1",
		"height": "h-18",
		"width": "w-full",
		"marker": {
			"wrapper": "absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none",
			"base": "w-full h-full",
			"background": "bg-white dark:bg-gray-900",
			"rounded": "rounded-lg",
			"shadow": "shadow-sm"
		},
		"tab": {
			"base": "relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out",
			"background": "",
			"active": "text-gray-900 dark:text-white",
			"inactive": "text-gray-500 dark:text-gray-400",
			"height": "h-16",
			"padding": "px-3",
			"size": "text-sm",
			"font": "font-medium",
			"rounded": "rounded-lg",
			"shadow": ""
		}
	}
}

const tabs = ref<Tab[]>([{
	label: 'Home',
	icon: 'i-heroicons-home-20-solid',
	href: '/',
}])

if (store.isLoggedIn) {
	tabs.value.push({
		label: 'Profile',
		icon: 'i-heroicons-user-20-solid',
		href: '/profile'
	})
} else {
	tabs.value.push({
		label: 'Login',
		icon: 'i-heroicons-arrow-right-start-on-rectangle-20-solid',
		href: '/auth/login'
	})
}

const selected = computed({
	get() {
		const index = tabs.value.findIndex((item) => item.href === route.fullPath)
		return (index !== -1) ? index : 0
	},
	set(index: number) {
		const i = tabs.value.map(async (item, i) => {
			if (i === index) {
				await Haptics.impact({ style: ImpactStyle.Heavy })
				navigateTo(item.href)
			}
		})
	}
})
</script>

<style scoped>

</style>