<template>
	<Page
		class="p-5"
		title="Login"
		:breadcrumbs="[{ label: 'Login', icon: 'i-heroicons-arrow-right-start-on-rectangle-20-solid' }]"
	>
		<UForm
			class="w-full space-y-4"
			:state="state"
			@submit="handleSubmit"
		>
			<UFormGroup
				size="xl"
				label="Enter E-Mail"
				name="email"
			>
				<UInput
					icon="i-heroicons-envelope"
					placeholder="email@example.com"
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
					v-model="state.password"
				/>
			</UFormGroup>

			<UButton
				size="xl"
				type="submit"
				block
			>
				Login
			</UButton>
		</UForm>

		<div class="text-center mt-3">
			Don't have an account?
			<UButton class="mt-3" variant="outline" size="xl" to="/auth/register" block>Register</UButton>
		</div>
	</Page>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const toast = useToast()
const supabase = useSupabaseClient()

const isLoading = ref(false)
const state = reactive({
	email: '',
	password: '',
})

const schema = object({
	email: string().email('Invalid email').required('Required'),
	password: string().min(8, 'Must be at least 8 characters').required('Required')
})

type Schema = InferType<typeof schema>

const handleSubmit = async (event: FormSubmitEvent<Schema>): Promise<void> => {
	await Haptics.impact({ style: ImpactStyle.Heavy })
	isLoading.value = true
	const { data, error: signInError } = await supabase.auth.signInWithPassword(event.data)

	if (signInError) {
		toast.add({ title: signInError.message })
		isLoading.value = false
		return
	}

	window.location.replace('/')
}
</script>

<style scoped>

</style>