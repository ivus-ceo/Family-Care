<template>
	<section>
		<h2
			v-if="title"
			class="my-4 text-2xl"
			v-html="title"
		></h2>
		<slot/>
	</section>
</template>

<script setup lang="ts">
const props = defineProps<{
	title?: string
}>()
</script>

<style scoped>

</style>