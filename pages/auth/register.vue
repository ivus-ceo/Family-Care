<template>
	<Page
		class="p-5"
		title="Register"
		:breadcrumbs="[{ label: 'Register', icon: 'i-heroicons-user-plus-20-solid' }]"
	>
		<UForm
			class="w-full space-y-4"
			:state="state"
			:schema="schema"
			@submit="handleSubmit"
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
				label="Enter E-Mail"
				name="email"
			>
				<UInput
					icon="i-heroicons-envelope"
					placeholder="email@example.com"
					:loading="isLoading"
					v-model="state.email"
				/>
			</UFormGroup>

			<UFormGroup
				size="xl"
				label="Enter Password"
				name="password"
			>
				<UInput
					type="password"
					icon="i-heroicons-lock-closed"
					placeholder="Password"
					:loading="isLoading"
					v-model="state.password"
				/>
			</UFormGroup>

			<UFormGroup
				size="xl"
				label="Confirm Password"
				name="confirmed_password"
			>
				<UInput
					type="password"
					icon="i-heroicons-lock-closed"
					placeholder="Confirm password"
					:loading="isLoading"
					v-model="state.confirmed_password"
				/>
			</UFormGroup>

			<UButton
				size="xl"
				type="submit"
				block
				:loading="isLoading"
			>
				Register
			</UButton>
		</UForm>

		<div class="text-center mt-3">
			Already have account?
			<UButton class="mt-3" variant="outline" size="xl" to="/auth/login" block>Login</UButton>
		</div>
	</Page>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import type { InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const toast = useToast()
const supabase = useSupabaseClient()

const isLoading = ref(false)
const state = reactive({
	first_name: '',
	last_name: '',
	email: '',
	password: '',
	confirmed_password: undefined
})

const schema = Yup.object({
	first_name: Yup.string().required('Required'),
	last_name: Yup.string().required('Required'),
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
	confirmed_password: Yup.string().min(8, 'Must be at least 8 characters').required('Required')
		.oneOf([Yup.ref('password')], 'Your passwords do not match.')
})

type Schema = InferType<typeof schema>

const handleSubmit = async (event: FormSubmitEvent<Schema>): Promise<void> => {
	isLoading.value = true
	await Haptics.impact({ style: ImpactStyle.Heavy })
	const { data, error: signUpError } = await supabase.auth.signUp({
		email: event.data.email,
		password: event.data.password,
		options: {
			data: {
				first_name: event.data.first_name,
				last_name: event.data.last_name,
			}
		}
	})

	if (signUpError) {
		toast.add({ title: signUpError.message })
		isLoading.value = false
		return
	}

	const { error: insertProfileError } = await supabase.from('profiles').insert({
		id: data.user!.id,
		first_name: event.data.first_name,
		last_name: event.data.last_name,
	} as never)

	if (insertProfileError) {
		toast.add({ title: insertProfileError.message })
		isLoading.value = false
		return
	}

	window.location.replace('/')
}
</script>

<style scoped>

</style>