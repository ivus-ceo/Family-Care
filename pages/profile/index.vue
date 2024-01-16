<template>
	<Page
		class="p-5"
		title="Profile"
		subtitle="Here you can update account information<br> and preferred settings"
		:breadcrumbs="[{ label: 'Profile', icon: 'i-heroicons-user-20-solid' }]"
	>
		<Section title="Information">
			<UForm
				class="w-full space-y-4"
				:state="state"
				:schema="schema"
				@submit="handleSave"
			>
				<div class="flex gap-4">
					<UFormGroup
						size="xl"
						label="Firstname"
						name="first_name"
					>
						<UInput
							icon="i-heroicons-identification-20-solid"
							placeholder="John"
							:loading="isLoading"
							v-model="state.first_name"
						/>
					</UFormGroup>

					<UFormGroup
						size="xl"
						label="Lastname"
						name="last_name"
					>
						<UInput
							icon="i-heroicons-identification-20-solid"
							placeholder="Doe"
							:loading="isLoading"
							v-model="state.last_name"
						/>
					</UFormGroup>
				</div>

				<UFormGroup
					size="xl"
					label="Team code"
					name="team_code"
				>
					<UInput
						icon="i-heroicons-key-20-solid"
						placeholder="xxxx-xxxx-xxxx-xxxx"
						:loading="isLoading"
						v-model="state.team_code"
					/>
				</UFormGroup>

				<UButton
					size="xl"
					type="submit"
					block
					:loading="isLoading"
				>
					Save
				</UButton>
			</UForm>
		</Section>

		<Section class="mt-4">
			<UButton
				size="xl"
				type="submit"
				color="red"
				block
				@click="handleLogout"
			>
				Logout
			</UButton>
		</Section>
	</Page>
</template>

<script setup lang="ts">
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import type { InferType } from "yup";
import { object, string } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { useStore } from "~/stores";

const supabase = useSupabaseClient()
const toast = useToast()
const store = useStore()

const isLoading = ref(false)
const state = reactive({
	first_name: store.user?.user_metadata.first_name,
	last_name: store.user?.user_metadata.last_name,
	team_code: store.user?.user_metadata.team_code ?? '',
})

const schema = object({
	first_name: string().required('Required'),
	last_name: string().required('Required'),
	team_code: string().nullable().default(null)
})

type Schema = InferType<typeof schema>

const handleSave = async (event: FormSubmitEvent<Schema>): Promise<void> => {
	isLoading.value = true
	await Haptics.impact({ style: ImpactStyle.Heavy })
	const { data, error: updateUserError } = await supabase.auth.updateUser({
		data: event.data
	})

	const { error: updateProfileError } = await supabase.from('profiles')
		.update(event.data as never)
		.eq('id', store.user?.id as string)

	if (updateUserError) {
		toast.add({ title: updateUserError.message })
		isLoading.value = false
		return
	}

	if (updateProfileError) {
		toast.add({ title: updateProfileError.message })
		isLoading.value = false
		return
	}

	isLoading.value = false
	toast.add({ title: 'Profile successfully updated' })
}

const handleLogout = async (): Promise<void> => {
	await Haptics.impact({ style: ImpactStyle.Heavy })
	const { error: signOutError } = await supabase.auth.signOut()

	if (signOutError) {
		toast.add({ title: signOutError.message })
		return
	}

	window.location.replace('/auth/login')
}

onMounted(async () => {
	await redirectIfNotLoggedIn()
})
</script>

<style scoped>

</style>