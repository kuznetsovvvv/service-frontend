<script>
	import { goto } from '$app/navigation';
	import { ArrowRightOutline, ToggleHeaderCellOutline } from 'flowbite-svelte-icons';
	import { onDestroy } from 'svelte';
	import { userStatus } from '../../store/store';
	import { Card, Button, Rating, Badge } from 'flowbite-svelte';

	$: loggedIn = $userStatus.loggedIn;
	$: storephone = $userStatus.storephone;
	const unsubscribe = userStatus.subscribe((value) => {});

	onDestroy(unsubscribe);

	function Exit() {
		userStatus.reset();
	}

  let orders='';



	let user_phone_info = '';
	let user_errorMessage_info = '';
	let user_data = '';
	async function infohandleSubmit() {
		user_phone_info = storephone;
		user_errorMessage_info = '';
		user_data = '';
		try {
			if (!storephone) {
				user_errorMessage_info = 'Phone number is required.';
				return; // Прерываем выполнение, если номер телефона не задан
			}
			const params = new URLSearchParams();
			params.append('phone', user_phone_info);

			const response = await fetch(`http://localhost:18080/api/v1/profile?${params}`);

			if (!response.ok) {
				const errorData = await response.json();
				user_errorMessage_info = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				user_data = await response.json();
				user_phone_info = '';
			}
		} catch (error) {
			console.error('Error fetching user info:', error);
			user_errorMessage_info = 'An unexpected error occurred.';
			user_data = '';
		}
	}

	let update_user_age = '';
	let update_user_phone = '';
	let update_error_message = '';

	function update_user_validateForm() {
		update_error_message = ''; // Очищаем сообщение об ошибке
		const phoneRegex = /^[+]?\d{11,12}$/;
		if (isNaN(parseInt(update_user_age)) || parseInt(update_user_age) <= 0) {
			update_error_message = 'Age must be a positive number.';
			return false;
		}
		if (!phoneRegex.test(update_user_phone)) {
			update_error_message = 'Phone number must be 11 or 12 digits long.';
			return false;
		}

		return true;
	}

	async function update_user_status() {
		if (!update_user_validateForm()) return;

		const updateData = {
			age: parseInt(update_user_age),
			phone: update_user_phone,
			old_phone: storephone
		};
		try {
			const response = await fetch('http://localhost:18080/api/v1/profile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});
			if (!response.ok) {
				const errorData = await response.json();
				update_error_message = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				update_user_age = '';
				update_user_phone = '';
			}
		} catch (error) {
			console.error('Error adding user:', error);
			update_error_message = 'An unexpected error occurred.';
		}
	}























</script>

{#if loggedIn == true}
	<div class="flex justify-between">
		<div class="button-container">
			<button class="enter-button" on:click={() => goto('/')}>Go back</button>
		</div>

		<h1>Hello, user {storephone}</h1>

		<div>
			<button class="enter-button" type="button" on:click={infohandleSubmit} disabled={!storephone}
				>Get info user</button
			>
			{#if user_errorMessage_info}
				<p style="color: red;">{user_errorMessage_info}</p>
			{/if}
		</div>
	</div>
	<div class="text4">
		{#if user_data}
			<p>
				User ID: {user_data.user_id}, Age: {user_data.age}, Gender: {user_data.gender}, Phone: {user_data.phone}
			</p>
		{/if}
	</div>
<div class="container">
	<h1>If you wanna update your profile, enter age and phone:</h1>

	<form on:submit|preventDefault={update_user_status}>
		<label for="update_user_age">Age:</label>
		<input type="number" id="update_user_age" bind:value={update_user_age} />

		<label for="update_user_phone">Phone:</label>
		<input type="text" id="update_user_phone" bind:value={update_user_phone} />
		<button class="enter-button">Update</button>
		{#if update_error_message}
			<p style="color: red;">{update_error_message}</p>
		{/if}
	</form>
</div>
	<div class="container1">
		<button class="enter-button" type="button" on:click={() => goto('/')} on:click={Exit}
			>Exit from account</button
		>
	</div>
{/if}

<style>
	.button-container {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10px;
	}

	.enter-button {
		padding: 10px 30px; /* Отступы внутри кнопки */
		background-color: #2c3726;
		color: #0dcd17;
		text-decoration: none;
		border-radius: 6px;
		margin-right: 10px;
	}

	.container {
		display: flex;
		justify-content: center; /* Center horizontally */
		align-items: center; /* Center vertically */
		height: 140px; /* Adjust as needed */
		width: 70%; /* Adjust as needed, responsive layout */
		margin: 0 auto; /* Center container within page */
		border: 1px solid #ccc; /* Optional border for visual clarity */
	}

	.container1 {
		display: flex;
		justify-content: flex-end;
		padding-top: 400px;
		padding-left: 1340px;
		position: fixed;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.block {
		width: 30%; /* Adjust block width as desired */
		height: 100%; /* Ensures equal height */
		background-color: #f0f0f0; /* Light gray background */
		margin: 0 1%; /* Adds some space between blocks */
		text-align: center; /* Centers text within block */
		border: 1px solid #ddd; /* Optional border */
		padding: 20px; /* Add padding around the content */
		box-sizing: border-box; /* Important! Includes padding in the width calculation */
	}

	.text4 {
		font-size: 1em;
		margin: 0;
		flex-grow: 2;
		text-align: center;
	}
</style>
