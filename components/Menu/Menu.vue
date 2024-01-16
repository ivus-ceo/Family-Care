<template>
	<UPopover
		class="pointer-events-auto"
		:popper="{ placement: 'bottom-start', overflowPadding: 0 }"
		:ui="{ 'width': 'w-[calc(100%-2.5rem)]' }"
		overlay
	>
		<UButton
			class="rounded-xl"
			size="xl"
			color="gray"
			icon="i-heroicons-bars-3-bottom-left-20-solid"
			:style="{ 'box-shadow': 'none' }"
			@click="handleClick"
		/>

		<template #panel>
			<UVerticalNavigation
				:ui="ui"
				:links="links"
			/>
		</template>
	</UPopover>
</template>

<script setup lang="ts">
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from "@capacitor/local-notifications";

const store = useStore()

const ui = {
	"wrapper": "relative rounded-xl",
	"base": "h-16 rounded-xl justify-center group relative flex items-center gap-2 focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-1 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 before:absolute before:inset-px before:rounded-md disabled:cursor-not-allowed disabled:opacity-75",
	"ring": "focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
	"padding": "px-3 py-1.5",
	"width": "w-full",
	"rounded": "rounded-xl",
	"font": "font-medium",
	"size": "text-base",
	"active": "text-gray-900 dark:text-white before:bg-gray-100 dark:before:bg-gray-800",
	"inactive": "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50",
	"label": "truncate relative",
	"icon": {
		"base": "flex-shrink-0 w-4 h-4",
		"active": "text-gray-700 dark:text-gray-200",
		"inactive": "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200"
	},
	"avatar": {
		"base": "flex-shrink-0",
		"size": "3xs"
	},
	"badge": {
		"base": "relative ms-auto inline-block py-0.5 px-2 text-xs rounded-md -me-1 -my-0.5",
		"active": "bg-white dark:bg-gray-900",
		"inactive": "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white group-hover:bg-white dark:group-hover:bg-gray-900"
	},
	"divider": {
		"wrapper": {
			"base": "p-2"
		}
	}
}

const links = ref([
	{
		label: 'Refresh',
		icon: 'i-heroicons-arrow-path-20-solid',
		to: `/`,
		target: '_top'
	},
])

const handleClick = async (): Promise<void> => {
	await Haptics.impact({ style: ImpactStyle.Heavy });
	await LocalNotifications.requestPermissions()
}
</script>

<style scoped>
.test > * {
	border: none !important;
	box-shadow: none !important;
}
</style>