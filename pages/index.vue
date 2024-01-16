<template>
	<Page class="relative">
		<Header/>
		<Map/>
	</Page>
</template>

<script setup lang="ts">
onMounted(async () => {
	await redirectIfNotLoggedIn()
})
</script>

<style scoped>

</style>