<template>
	<div class="w-screen h-screen">
		<UBreadcrumb :links="links" />
		<h1
			v-if="title"
			class="my-4 text-4xl font-bold"
			v-html="title"
		></h1>
		<p
			v-if="subtitle"
			class="my-4 text-base"
			v-html="subtitle"
		></p>
		<slot/>
	</div>
</template>

<script setup lang="ts">
import type { Breadcrumb } from "~/types";

const props = defineProps<{
	title?: string
	subtitle?: string
	breadcrumbs?: Breadcrumb[]
}>()

const links = computed(() => {
	const items: Breadcrumb[] = [{
		label: 'Home',
		icon: 'i-heroicons-home',
		to: '/'
	}]

	return (props.breadcrumbs) ? items.concat(props.breadcrumbs) : []
})
</script>

<style scoped>

</style>