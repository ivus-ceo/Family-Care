<template>
	<div class="relative">
		<main class="relative">
			<slot/>
		</main>

		<nav class="fixed bottom-0 left-0 right-0 z-[10000]">
			<Alert/>
			<Tabs/>
		</nav>

		<UNotifications class="z-[10000] mb-36" :ui="ui"/>
	</div>
</template>

<script setup lang="ts">
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { ActionPerformed, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { useStore } from "~/stores";

const ui = {
	"container": "relative overflow-hidden p-5",
	"transition": {
		"enterActiveClass": "transform ease-out duration-300 transition",
		"enterFromClass": "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2",
		"enterToClass": "translate-y-0 opacity-100 sm:translate-x-0",
		"leaveActiveClass": "transition ease-in duration-100",
		"leaveFromClass": "opacity-100",
		"leaveToClass": "opacity-0"
	},
}

const store = useStore()
await store.getUser()
await store.getTeam()

App.addListener('backButton', ({ canGoBack }) => {
	if(!canGoBack){
		App.exitApp();
	} else {
		window.history.back();
	}
});
</script>

<style scoped>

</style>