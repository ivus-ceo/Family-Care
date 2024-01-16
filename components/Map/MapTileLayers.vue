<template>
	<LTileLayer
		v-for="(layer, i) in layers"
		:key="i"
		:url="layer.url"
		:max-zoom="20"
	/>
</template>

<script setup lang="ts">
const layers = ref([
	{
		url: `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png`,
	},
]);
</script>

<style scoped>

</style>