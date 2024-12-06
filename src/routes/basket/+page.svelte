<script>
	import { goto } from '$app/navigation';
	import { ArrowRightOutline, ToggleHeaderCellOutline } from 'flowbite-svelte-icons';
	import { onDestroy } from 'svelte';
	import { userStatus } from '../../lib/store/store.js';
	import { Card, Button, Rating, Badge } from 'flowbite-svelte';
	import { update_user_status } from '../../lib/scripts/scripts.js';
	$: who = $userStatus.who;
	$: loggedIn = $userStatus.loggedIn;
	$: storephone = $userStatus.storephone;
	const unsubscribe = userStatus.subscribe((value) => {});

	onDestroy(unsubscribe);

	function Exit() {
		userStatus.reset();
	}

	//отобразить инфу про пользователя
	let user_errorMessage_info = '';
	let user_data = '';
	async function infohandleSubmit() {
		user_errorMessage_info = '';
		user_data = '';
		try {
			if (!storephone) {
				user_errorMessage_info = 'Phone number is required.';
				return; 
			}
			const params = new URLSearchParams();
			params.append('phone', storephone);

			const response = await fetch(`http://localhost:18080/api/v1/profile?${params}`);

			if (!response.ok) {
				const errorData = await response.json();
				user_errorMessage_info = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				user_data = await response.json();
			}
		} catch (error) {
			console.error('Error fetching user info:', error);
			user_errorMessage_info = 'An unexpected error occurred.';
			user_data = '';
		}
	}

	//обновить пользователя
	let update_user_age = '';
	let update_user_phone = '';
	let update_error_message = '';

	async function loginuserhandleSubmit() {
		const result = await update_user_status(update_user_age, update_user_phone, storephone);

		if (!result.success) {
			update_error_message = result.errorMessage;
		} else {
			userStatus.setLoggedIn(update_user_phone, `${who}`);
			update_user_age = '';
			update_user_phone = '';
			update_error_message = '';
		}
	}

	let orders_data = [];
	let orders_error_message = '';

	async function get_all_orders() {
		orders_data = [];
		orders_error_message = '';

		try {
			if (!storephone) {
				orders_error_message = 'Phone number is required.';
				return;
			}

			const params = new URLSearchParams();
			params.append('phone', storephone);
			const response = await fetch(`http://localhost:18080/api/v1/allorder?${params}`);

			if (!response.ok) {
				let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorMessage;
				} catch (jsonError) {
					console.error('Error parsing error response:', jsonError);
				}
				orders_error_message = errorMessage;
			} else {
				const responseData = await response.json();
				if (responseData.orders) {
					orders_data = responseData.orders;
				} else {
					orders_error_message = 'Unexpected response format from server';
				}
			}
		} catch (error) {
			console.error('Error fetching orders:', error);
			orders_error_message = 'An unexpected error occurred.';
		}
	}

	let cancel_order_id = '';
	let order_error = '';

	function cancel_validateForm() {
		order_error = ''; 

		if (isNaN(parseInt(cancel_order_id)) || parseInt(cancel_order_id) < 0) {
			order_error = 'Order id must be a positive number.';
			return false;
		}

		return true;
	}

	async function cancel_order_handleSubmit() {
		if (!cancel_validateForm()) return;

		const cancelData = {
			order_id: parseInt(cancel_order_id),
			phone: storephone
		};
		try {
			const response = await fetch('http://localhost:18080/api/v1/cancelorder', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(cancelData)
			});
			if (!response.ok) {
				const errorData = await response.json();
				order_error = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				cancel_order_id = '';
			}
		} catch (error) {
			console.error('Error adding user:', error);
			order_error = 'An unexpected error occurred.';
		}
	}
</script>

{#if loggedIn == true}
	<div class="flex justify-between">
		<div class="button-container">
			<button class="enter-button" on:click={() => goto('/')}>Go back</button>
		</div>

		<h1>Hello, {who} {storephone}</h1>

		<div>
			<button class="enter-button" type="button" on:click={infohandleSubmit}>Get info {who}</button>
			{#if user_errorMessage_info}
				<p style="color: red;">{user_errorMessage_info}</p>
			{/if}
		</div>
	</div>

	<div class="container">
		<div class="centered-text">
			<h2>If you wanna update your profile, enter age and phone:</h2>
		</div>
		<form on:submit|preventDefault={loginuserhandleSubmit}>
			<label for="update_user_age">Age:</label>
			<input type="number" id="update_user_age" bind:value={update_user_age} />

			<label for="update_user_phone">Phone:</label>
			<input type="text" id="update_user_phone" bind:value={update_user_phone} />
			<button class="enter-button">Update</button>
			{#if update_error_message}
				<p class = "text4" style="color: red;">{update_error_message}</p>
			{/if}
		</form>
	</div>
	<div class="text4">
		{#if user_data}
			<p>
				User ID: {user_data.user_id}, Age: {user_data.age}, Gender: {user_data.gender}, Phone: {user_data.phone}
			</p>
		{/if}
	</div>

	<div
		class="button-container1"
		style="display: flex; flex-direction: column; align-items: center;"
	>
		<button class="enter-button" type="button" on:click={get_all_orders}>Get info orders</button>
		{#if orders_error_message}
			<ul>
				<li>
					<p style="color: red;">{orders_error_message}</p>
				</li>
			</ul>
		{/if}
	</div>

	<p class="text4">Orders history:</p>
	<div class="text4">
		{#if orders_data && orders_data.length > 0}
			<ul>
				{#each orders_data as order}
					<li>
						Order ID: {order.order_id}, Creation Time: {order.creation_time}, Time: {order.time},
						Delivery Address: {order.delivery_address}, Status: {order.status}
					</li>
				{/each}
			</ul>
		{:else if orders_data && orders_data.length === 0}
			<ul>
				<li>
					<p>No orders found.</p>
				</li>
			</ul>
		{/if}
	</div>

	<form
		class="button-container1"
		style="display: flex; flex-direction: column; align-items: center;"
		on:submit|preventDefault={cancel_order_handleSubmit}
	>
		<label for="cancel_order_id">Order id:</label>
		<input type="number" id="cancel_order_id" bind:value={cancel_order_id} />

		<button class="enter-button">Cancel order</button>
		{#if order_error}
			<p style="color: red;">{order_error}</p>
		{/if}
	</form>

	<div class="container1">
		<button class="enter-button" type="button" on:click={() => goto('/')} on:click={Exit}
			>Exit from account</button
		>
	</div>
{:else}
	<p class="text1">You are didn't authorized</p>
	<div class="button-container1">
		<button class="enter-button" on:click={() => goto('/')}>Go back</button>
	</div>
{/if}

<style>
	.text1 {
		font-size: 1em;
		margin: 0;
		flex-grow: 2;
		text-align: center;
	}

	.button-container {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10px;
	}

	.button-container1 {
		display: flex;
		justify-content: center;
		margin-bottom: 10px;
	}

	.enter-button {
		padding: 10px 30px;
		background-color: #2c3726;
		color: #0dcd17;
		text-decoration: none;
		border-radius: 6px;
		margin-right: 10px;
	}

	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 180px;
		width: 70%;
		margin: 0 auto;
		border: 1px solid #ccc;
	}

	.container1 {
		position: block;
		display: flex;
		justify-content: flex-end;
		padding-top: 100px;
		padding-left: 1340px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.block {
		width: 30%;
		height: 100%;
		background-color: #f0f0f0;
		margin: 0 1%;
		text-align: center;
		border: 1px solid #ddd;
		padding: 20px;
		box-sizing: border-box;
	}

	.text4 {
		font-size: 1em;
		margin: 0;
		flex-grow: 2;
		text-align: center;
	}

	.centered-text {
		text-align: center;
		margin-top: 0;
		font-size: 2em;
	}
</style>
