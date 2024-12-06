<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { Card, Button, Rating, Badge } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { userStatus } from '../lib/store/store.js';
	import { json } from '@sveltejs/kit';
	import { products } from '../lib/products/products';
	import {
		adminhandleSubmit,
		handleSubmit,
		courier_handleSubmit,
		update_courier_status,
		user_handleSubmit,
		courieraction_handleSubmit,
		update_product_handleSubmit,
		delete_product_handleSubmit
	} from '../lib/scripts/scripts.js';

	let isadmin = false;
	let Admin = false;

	let cart = [];
	let productnames = [];
	let sum = 0;
	function addToCart(productId, productname, productprice) {
		cart = [...cart, productId];
		productnames = [...productnames, productname];
		sum += productprice;
	}

	function removeFromCart(productId, productname, productprice) {
		const indexToRemove = cart.indexOf(productId);
		const indextoRemove = productnames.indexOf(productname);
		if (indexToRemove === -1 && indextoRemove === -1) {
			return;
		}
		productnames.splice(indextoRemove, 1);
		cart.splice(indexToRemove, 1);
		cart = [...cart];
		productnames = [...productnames];

		if (!isNaN(sum) || sum < 0) {
			sum -= productprice;
			sum = sum;
		}
	}
	$: who = $userStatus.who;
	$: loggedIn = $userStatus.loggedIn;
	$: storephone = $userStatus.storephone;
	const unsubscribe = userStatus.subscribe((value) => {});
	onDestroy(unsubscribe);

	let register = true;
	function registerClicked() {
		register = !register;
	}
	function AdminClicked() {
		Admin = !Admin;
	}
	//логин админа
	let admin_phone = '';
	let admin_password = '';
	let admin_errorMessage = '';

	async function loginadminhandleSubmit() {
		const result = await adminhandleSubmit(admin_phone, admin_password);

		if (!result.success) {
			admin_errorMessage = result.errorMessage;
		} else {
			userStatus.setLoggedIn(admin_phone, 'admin');
			isadmin = true;
			admin_phone = '';
			admin_password = '';
			admin_errorMessage = '';
		}
	}

	//логин пользователя
	let phone = '';
	let password = '';
	let errorMessage = '';
	let responce = '';

	async function loginuserhandleSubmit() {
		const result = await handleSubmit(phone, password);

		if (!result.success) {
			errorMessage = result.errorMessage;
		} else {
			userStatus.setLoggedIn(phone, 'user');
			responce = '';
			errorMessage = '';
			password = '';
			phone = '';
		}
	}

	//создание заказа
	let delivery_address = '';
	let order_error = '';
	function order_validateForm() {
		if (cart.length == 0) {
			order_error = 'The cart cannot be empty.';
			return false;
		}

		if (delivery_address.length < 1 || delivery_address.length > 80) {
			order_error = 'Delivery address must be between 1 and 80 characters long.';
			return false;
		}

		return true;
	}

	async function order_handleSubmit() {
		if (!order_validateForm()) return;
		const Data = {
			old_phone: storephone,
			delivery_address: delivery_address,
			products: cart
		};
		try {
			const response = await fetch('http://localhost:18080/api/v1/order', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(Data)
			});

			if (response.ok) {
				responce = await response.json();
				cart = [];
				productnames = [];
				order_error = '';
				sum = 0;
			} else {
				const errorData = await response.json();
				order_error = errorData.message || `HTTP error! status: ${response.status}`;
			}
		} catch (error) {
			console.error('Error with login:', error);
			order_error = 'An unexpected error occurred.';
		}
	}

	//добавить курьера
	let courier_age = '';
	let courier_gender = '';
	let courier_phone = '';
	let courier_active = '';
	let courier_errorMessage = '';
	async function courierhandleSubmit() {
		const result = await courier_handleSubmit(
			courier_age,
			courier_gender,
			courier_phone,
			courier_active
		);

		if (!result.success) {
			courier_errorMessage = result.errorMessage;
		} else {
			courier_age = '';
			courier_gender = '';
			courier_phone = '';
			courier_active = '';
			courier_errorMessage = '';
		}
	}

	//обновить курьера
	let update_courier_id = '';
	let update_courier_active = '';
	let update_error_message = '';

	async function updatehandleSubmit() {
		const result = await update_courier_status(update_courier_id, update_courier_active);

		if (!result.success) {
			update_error_message = result.errorMessage;
		} else {
			update_courier_id = '';
			update_courier_active = '';
			update_error_message = '';
		}
	}

	//зарегать(добавить пользователя)
	let user_age = '';
	let user_gender = '';
	let user_phone = '';
	let user_password = '';
	let user_errorMessage = '';

	async function userhandleSubmit() {
		const result = await user_handleSubmit(user_age, user_gender, user_phone, user_password);

		if (!result.success) {
			user_errorMessage = result.errorMessage;
		} else {
			user_age = '';
			user_gender = '';
			user_phone = '';
			user_password = '';
			user_errorMessage = '';
		}
	}

	//создать действие курьера
	let courier_action_order_id = '';
	let courier_action_courier_id = '';
	let courier_action_action = '';
	let errorMessagecourieraction = '';

	async function courieractionhandleSubmit() {
		const result = await courieraction_handleSubmit(
			courier_action_order_id,
			courier_action_courier_id,
			courier_action_action
		);

		if (!result.success) {
			errorMessagecourieraction = result.errorMessage;
		} else {
			courier_action_order_id = '';
			courier_action_courier_id = '';
			courier_action_action = '';
			errorMessagecourieraction = '';
		}
	}

	//посмотреть информацию о продукте
	let info_product_name = '';
	let info_product_data = '';
	let product_error_info = '';
	function product_info_validateForm() {
		product_error_info = '';
		if (info_product_name.length > 30 || info_product_name.length === 0) {
			product_error_info = 'Product must id be a positive number.';
			return false;
		}
		return true;
	}
	async function info_product_handleSubmit() {
		if (!product_info_validateForm()) return;
		try {
			const params = new URLSearchParams();
			params.append('name', info_product_name);

			const response = await fetch(`http://localhost:18080/api/v1/product?${params}`);

			if (!response.ok) {
				const errorData = await response.json();
				product_error_info = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				info_product_data = await response.json();
				product_error_info = '';
			}
		} catch (error) {
			console.error('Error fetching user info:', error);
			product_error_info = 'An unexpected error occurred.';
			info_product_data = '';
		}
	}

	//обновить информацию о продукте
	let update_product_id = '';
	let update_product_name = '';
	let update_product_price = '';
	let update_product_count = '';
	let update_product_error_message = '';

	async function updateproduct_handleSubmit() {
		const result = await update_product_handleSubmit(
			update_product_id,
			update_product_name,
			update_product_price,
			update_product_count
		);

		if (!result.success) {
			update_product_error_message = result.errorMessage;
		} else {
			update_product_id = '';
			update_product_name = '';
			update_product_price = '';
			update_product_count = '';
			update_product_error_message = '';
		}
	}

	//удалить продукт
	let delete_product_id = '';
	let delete_product_message = '';
	async function deleteproduct_handleSubmit() {
		const result = await delete_product_handleSubmit(delete_product_id);

		if (!result.success) {
			delete_product_message = result.errorMessage;
		} else {
			delete_product_id = '';
			delete_product_message = '';
		}
	}

	let ul;
	let scrollPosition = 0;

	function handleScroll() {
		scrollPosition = window.scrollY;
		if (scrollPosition > 80) {
			ul.style.position = 'fixed';
			ul.style.top = '0';
			ul.style.left = '0'; 
		} else {
			ul.style.position = 'relative';
			ul.style.top = '';
			ul.style.left = ''; 
		}
	}

	window.addEventListener('scroll', handleScroll);
</script>

<div class="colored-gray">
	<div class="text2">
		<p>+79814576088 24-hour room Service</p>
	</div>
</div>

<div class="colored-green">
	<div class="text5">
		<h1>EcoMarket</h1>
	</div>
	<div class="button-container">
		<button class="enter-button" on:click={() => goto('/basket')}>Go to account</button>
	</div>
</div>

{#if loggedIn == false}
	{#if register == true}
		<div class="container">
			<div class="header">
				<form on:submit|preventDefault={loginuserhandleSubmit}>
					<input class="text1" type="text" bind:value={phone} placeholder="Phone" />
					<input class="text1" type="text" bind:value={password} placeholder="Password" />
					<button class="enter-button" type="submit">Login</button>
				</form>
				{#if errorMessage}
					<p style="color: red;">{errorMessage}</p>
				{/if}
			</div>
		</div>

		<div class="container">
			<p class="text1">Dont have an account? Click here!</p>
			<div class="text1">
				<button class="enter-button" type="button" on:click={registerClicked}>Registration</button>
			</div>
		</div>
	{:else}
		{#if Admin == true}
			<div class="container3">
				<h1 class="text3">Admin login</h1>
				<div class="header">
					<form on:submit|preventDefault={loginadminhandleSubmit}>
						<input class="text1" type="text" bind:value={admin_phone} placeholder="Phone" />
						<input class="text1" type="text" bind:value={admin_password} placeholder="Password" />
						<button class="enter-button" type="submit">Login</button>
					</form>
					{#if admin_errorMessage}
						<p style="color: red;">{admin_errorMessage}</p>
					{/if}
				</div>
			</div>
		{:else}
			<div>
				<form on:submit|preventDefault={userhandleSubmit}>
					<div class="text1">
						<div class="container">
							<label for="age">Age:</label>
							<input type="number" id="age" bind:value={user_age} />

							<label for="gender">Gender(m/f):</label>
							<input type="text" id="gender" bind:value={user_gender} />

							<label for="phone">Phone:</label>
							<input type="text" id="phone" bind:value={user_phone} />

							<label for="password">Password:</label>
							<input type="text" id="password" bind:value={user_password} />

							<button class="enter-button">Register me</button>
						</div>
						{#if user_errorMessage}
							<p style="color: red;">{user_errorMessage}</p>
						{/if}
					</div>
				</form>
			</div>
		{/if}
		<div class="container2">
			<div class="text1">
				<button class="enter-button" type="button" on:click={registerClicked}>Back to login</button>
			</div>
			<div>
				<p class="text1">Admin</p>
				<div class="text1">
					<button class="enter-button" type="button" on:click={AdminClicked}>Initialization</button>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<div class="container4">
		<div class="fixed">
			<div class="flex">
				<ul
					bind:this={ul}
					class="top-100 absolute left-0 w-48 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				>
					<div>
						<p style="color: red;">{sum} rub</p>
						{#if cart.length > 0}
							<ul class="flex flex-col space-y-1">
								{#each productnames as product}
									<li>{product}</li>
								{/each}
							</ul>
						{:else}
							<p>Your cart is empty.</p>
						{/if}
						<div class="mt-2 flex justify-between">
							<form on:submit|preventDefault={order_handleSubmit}>
								<label for="delivery_address">Delivery address:</label>
								<input
									type="text"
									id="delivery_address"
									bind:value={delivery_address}
									class="w-full"
								/>
								<button class="enter-button mt-2">Create order</button>
								{#if order_error}
									<p style="color: red;">{order_error}</p>
								{/if}
							</form>
						</div>
					</div>
				</ul>
			</div>
		</div>
	</div>

	<div class="container1 flex-grow">
		<div class="grid grid-cols-4 gap-4">
			{#each products as product}
				<Card padding="none" class="card">
					<a href="/">
						<img class="rounded-t-lg p-8" src={product.image} alt="product1" />
					</a>

					<div class="card-footer flex items-center justify-between">
						<div class="card-content mt-auto px-5 pb-5">
							<a href="/">
								<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
									{product.name}
								</h5>
							</a>
							<Rating rating={product.rate} size={24} class="mb-5 mt-2.5">
								<Badge slot="text" class="ms-3">{product.rate}</Badge>
							</Rating>
							<span class="float-end text-3xl font-bold text-gray-900 dark:text-white"
								>{product.price}</span
							>
							<div class="float-end flex space-x-2">
								<button
									class="enter-button1"
									on:click={() => removeFromCart(product.id, product.name, product.price)}
									>Delete</button
								>
								<button
									class="enter-button1"
									on:click={() => addToCart(product.id, product.name, product.price)}
									>Buy now</button
								>
							</div>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	</div>

	<div>
		<div class="button-container">
			<button class="enter-button" on:click={() => goto('/basket')}>Go to account</button>
		</div>
	</div>

	{#if isadmin}
		<form on:submit|preventDefault={courierhandleSubmit}>
			<label for="age">Age:</label>
			<input type="number" id="age" bind:value={courier_age} />

			<label for="gender">Gender(m/f):</label>
			<input type="text" id="gender" bind:value={courier_gender} />

			<label for="phone">Phone:</label>
			<input type="text" id="phone" bind:value={courier_phone} />

			<label for="active">Active:</label>
			<input type="text" id="active" bind:value={courier_active} />

			<button class="enter-button">Add Courier</button>
			{#if courier_errorMessage}
				<p style="color: red;">{courier_errorMessage}</p>
			{/if}
		</form>

		<form on:submit|preventDefault={updatehandleSubmit}>
			<label for="update_courier_id">Courier id:</label>
			<input type="number" id="update_courier_id" bind:value={update_courier_id} />

			<label for="update_courier_active">Active:</label>
			<input type="text" id="update_courier_active" bind:value={update_courier_active} />
			<button class="enter-button">Update courier status</button>
			{#if update_error_message}
				<p style="color: red;">{update_error_message}</p>
			{/if}
		</form>

		<form on:submit|preventDefault={courieractionhandleSubmit}>
			<label for="courier_action_order_id">Order id:</label>
			<input type="number" id="courier_action_order_id" bind:value={courier_action_order_id} />

			<label for="courier_action_courier_id">Courier id:</label>
			<input type="number" id="courier_action_courier_id" bind:value={courier_action_courier_id} />

			<label for="courier_action_action">Action(transfer or deliver):</label>
			<input type="text" id="courier_action_action" bind:value={courier_action_action} />
			<button class="enter-button">Create courier action(transfer/deliver)</button>
			{#if errorMessagecourieraction}
				<p style="color: red;">{errorMessagecourieraction}</p>
			{/if}
		</form>

		<form on:submit|preventDefault={info_product_handleSubmit}>
			<label for="info_product_name">Name:</label>
			<input type="text" id="info_product_name" bind:value={info_product_name} />

			<button class="enter-button">Get info product</button>
			{#if product_error_info}
				<p style="color: red;">{product_error_info}</p>
			{/if}
		</form>
		<div>
			{#if info_product_data}
				<p>
					Product ID: {info_product_data.product_id}, Name: {info_product_data.name}, Price: {info_product_data.price},
					Count: {info_product_data.count}
				</p>
			{/if}
		</div>

		<form on:submit|preventDefault={updateproduct_handleSubmit}>
			<label for="update_product_id">Product id:</label>
			<input type="number" id="update_product_id" bind:value={update_product_id} />

			<label for="update_product_name">Name:</label>
			<input type="text" id="update_product_name" bind:value={update_product_name} />

			<label for="update_product_price">Price:</label>
			<input type="number" id="update_product_price" bind:value={update_product_price} />

			<label for="update_product_count">Count:</label>
			<input type="number" id="update_product_count" bind:value={update_product_count} />

			<button class="enter-button">Update product</button>
			{#if update_product_error_message}
				<p style="color: red;">{update_product_error_message}</p>
			{/if}
		</form>

		<form on:submit|preventDefault={deleteproduct_handleSubmit}>
			<label for="delete_product_id">Product id:</label>
			<input type="number" id="delete_product_id" bind:value={delete_product_id} />

			<button class="enter-button">Delete product</button>
			{#if delete_product_message}
				<p style="color: red;">{delete_product_message}</p>
			{/if}
		</form>
	{/if}
{/if}

<style>
	.colored-gray {
		background-color: #7b7e7b;
		color: #2c3726;
		padding: 8px;
		border-top: 1px solid rgb(5, 3, 3);
		border-bottom: 1px solid rgb(5, 3, 3);
		width: 100%;
		box-sizing: border-box;
		margin: 0px auto;
	}

	.colored-green {
		background-color: #0dcd17;
		color: #2c3726;
		padding: 25px;
		border-bottom: 1px solid rgb(5, 3, 3);
		width: 100%;
		box-sizing: border-box;
		margin: 0px auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.container {
		padding-top: 200px;
	}

	.container1 {
		padding-left: 200px;
		padding-right: 200px;
		padding-bottom: 20px;
	}

	.container2 {
		padding-top: 100px;
	}
	.container3 {
		padding-top: 128px;
	}
	.header {
		padding-left: 140px;
		font-size: 2em;
		margin: 0;
		flex-grow: 1;
		text-align: center;
	}
	.container4 {
		padding-top: 20px;
	}

	.text1 {
		font-size: 1em;
		margin: 0;
		flex-grow: 2;
		text-align: center;
	}

	.text2 {
		font-size: 1em;
		margin: 0;
		flex-grow: 1;
		text-align: right;
	}
	.text3 {
		font-size: 2em;
		margin: 0;
		flex-grow: 2;
		text-align: center;
	}
	.text5 {
		font-size: 3em;
		flex-grow: 1;
		text-align: center;
		margin-left: 150px;
	}

	.button-container {
		display: flex;
		justify-content: flex-end;
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

	.enter-button1 {
		padding: 0px 3px;
		color: #010101;
		text-decoration: none;
		border-radius: 2px;
		margin-right: 2px;
		border-bottom: 1px solid rgb(5, 3, 3);
		border-top: 1px solid rgb(5, 3, 3);
		border-right: 1px solid rgb(5, 3, 3);
		border-left: 1px solid rgb(5, 3, 3);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
	}

</style>
