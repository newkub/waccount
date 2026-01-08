<script setup lang="ts">
definePageMeta({
	layout: "account",
});

const { getTickets, createTicket, loading } = useSupport();

const tickets = ref<any[]>([]);
const showCreateModal = ref(false);
const form = reactive({
	subject: "",
	message: "",
	category: "technical",
	priority: "medium",
});

onMounted(async () => {
	try {
		const response = await getTickets();
		tickets.value = response.tickets || [];
	} catch (error) {
		console.error("Failed to fetch tickets:", error);
	}
});

const handleCreateTicket = async () => {
	try {
		const response = await createTicket(form.subject, form.message, form.category, form.priority);
		tickets.value.unshift(response);
		showCreateModal.value = false;
		form.subject = "";
		form.message = "";
	} catch (error) {
		console.error("Failed to create ticket:", error);
	}
};
</script>

<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-2xl font-bold">Support Tickets</h1>
				<p class="text-gray-600 dark:text-gray-400">
					Get help from our support team
				</p>
			</div>
			<button
				class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
				@click="showCreateModal = true"
			>
				New Ticket
			</button>
		</div>

		<SupportTicketsTable :tickets="tickets" />

		<CreateTicketModal
			:show="showCreateModal"
			:loading="loading"
			:form="form"
			@close="showCreateModal = false"
			@submit="handleCreateTicket"
		/>
	</div>
</template>
