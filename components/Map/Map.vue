<template>
	<LMap
		class="h-screen w-screen"
		:zoom="map.zoom"
		:center="map.center"
		:inertia="map.inertia"
	>
<!--		:draggable="store.user?.user_metadata.first_name === marker.first_name"-->
<!--		@moveend="handleDragEnd"-->

		<LMarker
			v-for="(marker, key) in map.markers.values()"
			:key="key"
			:lat-lng="[marker.lat, marker.lng]"
		>
			<LIcon
				:icon-size="[40, 40]"
				:icon-anchor="[20, 40]"
				:popup-anchor="[0, -40]"
				icon-url="/icons/marker.svg"
			/>
			<LPopup
				:content="`${marker.first_name} ${marker.last_name}`"
				:options="{ closeButton: false }"
			/>
		</LMarker>

		<MapTileLayers/>
	</LMap>
</template>

<script setup lang="ts">
import { useStore } from "~/stores";
import { useGeolocation, useInterval } from "@vueuse/core";
import { Geolocation as G } from "@capacitor/geolocation";
import type { Coords, Geolocation, Marker, ProfileWithGeolocation, UserID } from "~/types";
import type { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import type { DragEndEvent } from "leaflet";

const store = useStore()
const toast = useToast()
const supabase = useSupabaseClient()


const map = ref({
	zoom: 3,
	center: [0,0],
	inertia: true,
	markers: new Map() as Map<UserID, Marker>,
	interval: 3 * 60 * 1000 // 3 minutes
})

const updateDBGeolocation = async () => {
	const coordinates = await G.getCurrentPosition({ enableHighAccuracy: true });

	const { error } = await supabase.from('geolocations').upsert({
		profile_id: store.user!.id,
		latitude: coordinates.coords.latitude,
		longitude: coordinates.coords.longitude,
	} as never, { onConflict: 'profile_id'})

	if (error) {
		toast.add({ title: error?.message })
	}

	console.log(coordinates.coords)
}

const updateMarkerPosition = (profile: ProfileWithGeolocation) => {
	if (!profile.geolocations) return

	map.value.markers.set(profile.id, {
		first_name: profile.first_name,
		last_name: profile.last_name,
		team_code: profile.team_code,
		lat: profile.geolocations.latitude,
		lng: profile.geolocations.longitude,
	})
}

const updateRealtimeGeolocation = (geolocation: RealtimePostgresChangesPayload<Geolocation>) => {
	const newGeolocation = geolocation['new'] as Geolocation
	const oldGeolocation = geolocation['old'] as Geolocation

	if (map.value.markers.has(newGeolocation.profile_id)) {
		const marker = map.value.markers.get(newGeolocation.profile_id) as Marker
		updateMarkerPosition({
			id: newGeolocation.profile_id,
			first_name: marker.first_name,
			last_name: marker.last_name,
			team_code: marker.team_code,
			geolocations: {
				latitude: newGeolocation.latitude,
				longitude: newGeolocation.longitude
			}
		})
	}
}

/**
 * Set markers for users in the same team
 */
if (store.team) {
	store.team.map((profile: ProfileWithGeolocation) => {
		if (profile.id === store.user?.id && profile.geolocations) {
			map.value.zoom = 17
			map.value.center = [
				profile.geolocations.latitude,
				profile.geolocations.longitude
			]
		}
		updateMarkerPosition(profile)
	})
}

setInterval(async () => {
	await updateDBGeolocation()
}, map.value.interval)

store.$subscribe((mutation, state) => {
	const chosenUser = state.chosenUser;

	if (chosenUser && chosenUser.geolocations) {
		const geolocations = chosenUser.geolocations;
		map.value.center = [geolocations.latitude, geolocations.longitude]
		map.value.zoom = 17
	}
})

/**
 * TEMP
 *
 * @param event
 */
const handleDragEnd = async (event: DragEndEvent) => {
	const coords = event.target['_latlng']

	const { error: geolocationError } = await supabase.from('geolocations').upsert({
		profile_id: store.user!.id,
		latitude: coords.lat,
		longitude: coords.lng,
	} as never, { onConflict: 'profile_id'})

	console.log(`lat: ${coords.lat} lng: ${coords.lng}`)
}

/**
 * Realtime markers updater
 */
supabase
	.channel('table-db-changes')
	.on('postgres_changes',
		{
			event: '*',
			schema: 'public',
			table: 'geolocations',
		},
		updateRealtimeGeolocation
	)
	.subscribe()

// .leaflet-marker-pane > * {
// -webkit-transition: transform .3s linear;
// -moz-transition: transform .3s linear;
// -o-transition: transform .3s linear;
// -ms-transition: transform .3s linear;
// transition: transform .3s linear;
// }
</script>

<style>
.leaflet-top,
.leaflet-bottom {
	display: none !important;
}
</style>