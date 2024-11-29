<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { Card, Button, Rating, Badge } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { userStatus } from '../store/store';
	import { json } from '@sveltejs/kit';
	import {
		product1,
		product2,
		product3,
		product4,
		product5,
		product6,
		product7,
		product8,
		product9,
		product10
	} from './products/products';
	import {
		product11,
		product12,
		product13,
		product14,
		product15,
		product16,
		product17,
		product18,
		product19,
		product20
	} from './products/products';

	// работа с корзиной
	let cart = [];
	let productnames=[];
	let sum = 0;
	// Функция для добавления товара в корзину
	function addToCart(productId,productname,productprice) {
		cart = [...cart, productId]; // Создаем новый массив с добавленным ID
		productnames = [...productnames, productname];
		sum+=productprice;
	}

	function removeFromCart(productId,productname,productprice) {
		const indexToRemove = cart.indexOf(productId);
		const indextoRemove = productnames.indexOf(productname);
		if (indexToRemove === -1 && indextoRemove === -1) {
			return;
		}
		productnames.splice(indextoRemove,1);
		cart.splice(indexToRemove, 1);
		cart = [...cart];
		productnames = [...productnames];

		if(!isNaN(sum) || sum<0){
		sum-=productprice;
		sum=sum;
		}
	}
  

//логин пользователя
	let phone = '';
	let password = '';
	let register = true;
	let errorMessage = '';
	let responce = '';

	$: loggedIn = $userStatus.loggedIn;
	$: storephone = $userStatus.storephone;
	const unsubscribe = userStatus.subscribe((value) => {});

	onDestroy(unsubscribe);

	function login_validateForm() {
		const phoneRegex = /^[+]?\d{11,12}$/;

		if (!phoneRegex.test(phone)) {
			errorMessage = 'Phone number must be 11 or 12 digits long.';
			return false;
		}
		if (password.length < 1 || password.length > 40) {
			errorMessage = 'Password must be between 1 and 40 characters long.';
			return false;
		}

		return true;
	}

	async function handleSubmit() {
		if (!login_validateForm()) return;
		const Data = {
			phone: phone,
			password: password
		};
		try {
			const response = await fetch('http://localhost:18080/api/v1/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(Data)
			});

			if (response.ok) {
				responce = await response.json();
				userStatus.setLoggedIn(phone);
				phone = '';
				password = '';
				errorMessage = '';
				

			} else {
				const errorData = await response.json();
				errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
			}
		} catch (error) {
			console.error('Error with login:', error);
			errorMessage = 'An unexpected error occurred.';
		}
	}
	function registerClicked() {
		register = !register;
	}



//создание заказа
	let delivery_address = '';
	let order_error='';
	function order_validateForm() {

if(cart.length==0){
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
				cart=[];
				productnames=[];
				order_error='';
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

	function courier_validateForm() {
		courier_errorMessage = ''; // Очищаем сообщение об ошибке

		if (isNaN(parseInt(courier_age)) || parseInt(courier_age) <= 0) {
			courier_errorMessage = 'Age must be a positive number.';
			return false;
		}

		const phoneRegex = /^[+]?\d{11,12}$/;
		if (!phoneRegex.test(courier_phone)) {
			courier_errorMessage = 'Phone number must be 11 or 12 digits long.';
			return false;
		}

		return true;
	}

	async function courier_handleSubmit() {
		if (!courier_validateForm()) return; 

		const courierData = {
			age: parseInt(courier_age),
			gender: courier_gender,
			phone: courier_phone,
			active: courier_active
		};

		try {
			const response = await fetch('http://localhost:18080/api/couriers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(courierData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				courier_errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				alert('Courier added successfully!');
				courier_age = '';
				courier_gender = '';
				courier_phone = '';
				courier_active = '';
			}
		} catch (error) {
			console.error('Error adding courier:', error);
			courier_errorMessage = 'An unexpected error occurred.';
		}
	}





//обновить курьера
	let update_courier_id = '';
	let update_courier_active = '';
	let update_error_message = '';

	function update_courier_validateForm() {
		update_error_message = ''; // Очищаем сообщение об ошибке

		if (isNaN(parseInt(update_courier_id)) || parseInt(update_courier_id) <= 0) {
			update_error_message = 'Courier id must be a positive number.';
			return false;
		}
		return true;
	}

	async function update_courier_status() {
		if (!update_courier_validateForm()) return;

		const updateData = {
			courier_id: parseInt(update_courier_id),
			active: update_courier_active
		};
		try {
			const response = await fetch('http://localhost:18080/api/v1/couriers:id', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});
			if (!response.ok) {
				const errorData = await response.json();
				update_error_message = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				alert('Courier status updated successfully!');
				update_courier_id = '';
				update_courier_active = '';
			}
		} catch (error) {
			console.error('Error adding user:', error);
			update_error_message = 'An unexpected error occurred.';
		}
	}





//зарегать(добавить пользователя)
	let user_age = '';
	let user_gender = '';
	let user_phone = '';
	let user_password = '';
	let user_errorMessage = '';

	function user_validateForm() {
		user_errorMessage = ''; // Очищаем сообщение об ошибке
		const phoneRegex = /^[+]?\d{11,12}$/;
		if (isNaN(parseInt(user_age)) || parseInt(user_age) <= 0) {
			user_errorMessage = 'Age must be a positive number.';
			return false;
		} else if (!phoneRegex.test(user_phone)) {
			user_errorMessage = 'Phone number must be 11 or 12 digits long(with + or no).';
			return false;
		} else if (user_password.length == 0 || user_password.length > 40) {
			user_errorMessage = 'Password incorrect.';
			return false;
		}

		return true;
	}

	async function user_handleSubmit() {
		if (!user_validateForm()) return; // Прерываем отправку, если форма не прошла валидацию

		const userData = {
			age: parseInt(user_age),
			gender: user_gender,
			phone: user_phone,
			password: user_password
		};

		try {
			const response = await fetch('http://localhost:18080/api/v1/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				user_errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				alert('User added successfully!');
				user_age = '';
				user_gender = '';
				user_phone = '';
				user_password = '';
			}
		} catch (error) {
			console.error('Error adding user:', error);
			user_errorMessage = 'An unexpected error occurred.';
		}
	}






//создать действие курьера
	let courier_action_order_id = '';
	let courier_action_courier_id = '';
	let courier_action_action='';
	let errorMassagecourieraction = '';
	function courieraction_validateForm() {
		errorMassagecourieraction = ''; 
		if (isNaN(parseInt(courier_action_order_id)) || parseInt(courier_action_order_id) <= 0) {
			errorMassagecourieraction = 'Order id be a positive number.';
			return false;
		} else if (isNaN(parseInt(courier_action_courier_id )) || parseInt(courier_action_courier_id ) <= 0) {
			errorMassagecourieraction = 'Phone number must be 11 or 12 digits long(with + or no).';
			return false;
		}
		if (courier_action_action !== '"transfer"' || courier_action_action !== '"deliver"') {
        errorMassagecourieraction = 'Action must be "transfer" or "deliver".';
        return false;
         }
		return true;
	}
	async function courieraction_handleSubmit() {
		if (!courieraction_validateForm()) return; 

		const Data = {
			order_id: parseInt(courier_action_order_id),
			courier_id: parseInt(courier_action_courier_id),
			action: courier_action_action
		};

		try {
			const response = await fetch('http://localhost:18080/api/v1/order', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(Data)
			});

			if (!response.ok) {
				const errorData = await response.json();
				errorMassagecourieraction = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				courier_action_order_id = '';
				courier_action_courier_id = '';
				courier_action_action='';
			}
		} catch (error) {
			console.error('Error adding user:', error);
			errorMassagecourieraction = 'An unexpected error occurred.';
		}
	}








	let product_id = '';
	let product_data = '';
	let product_error_info = '';
	function product_info_validateForm() {
		product_error_info = ''; 
		if (isNaN(parseInt(product_id)) || parseInt(product_id) < 0) {
			errorMassagecourieraction = 'Product must id be a positive number.';
			return false;
		} 
		return true;
	}
	async function info_product_handleSubmit() {
		if (!product_info_validateForm()) return;
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



	//let suggestions;
	// 	onMount(() => {

	// fetch('http://localhost:18080/api/couriers')
	//   .then((response) => {
	//     return response.text();
	//   })
	//   .then((data) => {
	//     suggestions=data
	//     console.log(data);
	//   });
	// 	console.log('the component has mounted');
	//   });
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
				<form on:submit|preventDefault={handleSubmit}>
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
		<div>
			<form on:submit|preventDefault={user_handleSubmit}>
				<div class="text1">
					<div class="container">
						<label for="age">Age:</label>
						<input type="number" id="age" bind:value={user_age} />

						<label for="gender">Gender:</label>
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
					<div class="container">
						<button class="enter-button" type="button" on:click={registerClicked}
							>Back to login</button
						>
					</div>
				</div>
			</form>
		</div>
	{/if}
{:else}
	<div class="container1">
		<div class="grid grid-cols-4 gap-4">
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image1.png" alt="product1" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product1[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product1[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product1[0].id, product1[0].name,product1[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product1[0].id, product1[0].name,product1[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<div class="flex flex-col h-full">
				  <div>
					<a href="/">
					  <img class="rounded-t-lg p-8" src="../images/image2.jpg" alt="product2" />
					</a>
					<div class="px-5">
					  <a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
						  {product2[0].name}
						</h5>
					  </a>
					  <Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					  </Rating>
					</div>
				  </div>
				  <div class="card-footer flex items-center justify-between px-5 pb-5 mt-auto"> 
					<span class="text-3xl font-bold text-gray-900 dark:text-white">{product2[0].price}</span>
					<div class="flex space-x-2">
					  <button class="enter-button1" on:click={() => removeFromCart(product2[0].id, product2[0].name,product2[0].price)}>Delete</button>
					  <button class="enter-button1" on:click={() => addToCart(product2[0].id, product2[0].name,product2[0].price)}>Buy now</button>
					</div>
				  </div>
				</div>
			  </Card>
			  

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image3.png" alt="product3" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product3[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product3[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product3[0].id, product3[0].name,product3[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product3[0].id, product3[0].name,product3[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image4.png" alt="product4" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product4[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product4[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product4[0].id, product4[0].name,product4[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product4[0].id, product4[0].name,product4[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<div class="container1">
		<div class="grid grid-cols-4 gap-4">
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image5.png" alt="product5" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product5[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product5[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product5[0].id, product5[0].name,product5[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product5[0].id, product5[0].name,product5[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image6.png" alt="product6" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product6[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product6[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product6[0].id, product6[0].name,product6[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product6[0].id, product6[0].name,product6[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image7.png" alt="product7" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product4[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product7[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product7[0].id, product7[0].name,product7[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product7[0].id, product7[0].name,product7[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image8.png" alt="product8" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product8[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product8[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product8[0].id, product8[0].name,product8[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product8[0].id, product8[0].name,product8[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<div class="container1">
		<div class="grid grid-cols-4 gap-4">
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image9.png" alt="product9" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product9[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product9[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product9[0].id, product9[0].name,product9[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product9[0].id, product9[0].name,product9[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image10.png" alt="product10" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product10[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product10[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product10[0].id, product10[0].name,product10[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product10[0].id, product10[0].name,product10[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image11.png" alt="product11" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product11[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product11[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product11[0].id, product11[0].name,product11[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product11[0].id, product11[0].name,product11[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image12.png" alt="product12" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product12[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product12[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product12[0].id, product12[0].name,product12[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product12[0].id, product12[0].name,product12[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

		</div>
	</div>




	<div class="container1">
		<div class="grid grid-cols-4 gap-4">
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image13.png" alt="product13" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product13[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product13[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product13[0].id, product13[0].name,product13[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product13[0].id, product13[0].name,product13[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image14.png" alt="product14" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product14[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product14[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product14[0].id, product14[0].name,product14[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product14[0].id, product14[0].name,product14[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image15.png" alt="product15" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product15[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product15[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product15[0].id, product15[0].name,product15[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product15[0].id, product15[0].name,product15[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image16.png" alt="product16" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product16[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product16[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product16[0].id, product16[0].name,product16[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product16[0].id, product16[0].name,product16[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>


	<div class="container1">
		<div class="grid grid-cols-4 gap-4">
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image17.png" alt="product17" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product17[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product17[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product17[0].id, product17[0].name,product17[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product17[0].id, product17[0].name,product17[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>

			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image18.png" alt="product18" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product18[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product18[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product18[0].id, product18[0].name,product18[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product18[0].id, product18[0].name,product18[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image19.png" alt="product19" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product19[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product19[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product19[0].id, product19[0].name,product19[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product19[0].id, product19[0].name,product19[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
			<Card padding="none" class="card">
				<a href="/">
					<img class="rounded-t-lg p-8" src="../images/image20.png" alt="product20" />
				</a>
				<div class="card-content px-5 pb-5">
					<a href="/">
						<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{product20[0].name}
						</h5>
					</a>
					<Rating rating={4.2} size={24} class="mb-5 mt-2.5">
						<Badge slot="text" class="ms-3">4,2</Badge>
					</Rating>
					<div class="card-footer flex items-center justify-between mt-auto">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{product20[0].price}</span>
						<div class="flex space-x-2">
							<button class="enter-button1" on:click={() => removeFromCart(product20[0].id, product20[0].name,product20[0].price)}>Delete</button>
							<button class="enter-button1" on:click={() => addToCart(product20[0].id, product20[0].name,product20[0].price)}>Buy now</button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>









	

	<div class="flex justify-between ">


	<form on:submit|preventDefault={order_handleSubmit}>
		<label for="order_handleSubmit">Delivery address:</label>
		<input type="text" id="order_handleSubmit" bind:value={delivery_address} />

		<button class="enter-button">Create order</button>
		{#if order_error}
			<p style="color: red;">{order_error}</p>
		{/if}
	</form>
	<div class="button-container">
		<button class="enter-button" on:click={() => goto('/basket')}>Go to account</button>
	</div>
	</div>
	


	<div>
		<p>{sum} rub</p>
	<p>
		
		{#if cart.length > 0}
			Your products: {productnames.join(', ')}
		{:else}
			Your cart is empty.
		{/if}
	</p>
 </div> 
	





 <div>
 <form on:submit|preventDefault={courier_handleSubmit}>
	<label for="age">Age:</label>
	<input type="number" id="age" bind:value={courier_age} />

	<label for="gender">Gender:</label>
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

 <form on:submit|preventDefault={update_courier_status}>
	<label for="update_courier_id">Courier id:</label>
	<input type="number" id="update_courier_id" bind:value={update_courier_id} />

	<label for="update_courier_active">Active:</label>
	<input type="text" id="update_courier_active" bind:value={update_courier_active} />
	<button class="enter-button">Update courier</button>
	{#if update_error_message}
		<p style="color: red;">{update_error_message}</p>
	{/if}
 </form>
</div>



<form on:submit|preventDefault={courieraction_handleSubmit}>
	<label for="courier_action_order_id">Order id:</label>
	<input type="number" id="courier_action_order_id" bind:value={courier_action_order_id} />

	<label for="courier_action_courier_id">Courier id:</label>
	<input type="number" id="courier_action_courier_id" bind:value={courier_action_courier_id} />

	<label for="courier_action_action">Action(transfer or deliver):</label>
	<input type="text" id="courier_action_action" bind:value={courier_action_action} />
	<button class="enter-button">Create courier action(transfer order to courier)</button>
	{#if errorMassagecourieraction}
		<p style="color: red;">{errorMassagecourieraction}</p>
	{/if}
 </form>









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
		display: flex; /* Включаем Flexbox */
		justify-content: space-between; /* Распределяем элементы по краям */
		align-items: center;
	}

	.container {
		padding-top: 200px; /* Adjust as needed */
	}
	.container1 {
		padding-left: 200px;
		padding-right: 200px;
		padding-bottom: 20px;
		padding-top: 20px;
	}
	.header {
		padding-left: 140px;
		font-size: 2em;
		margin: 0;
		flex-grow: 1;
		text-align: center;
	}

	.header1 {
		padding-left: 100px;
		font-size: 2em;
		margin: 0;
		flex-grow: 1;
		text-align: center;
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
		font-size: 3em;
		margin: 0;
		flex-grow: 1;
		text-align: center;
		align-items: center;
	}

	.text4 {
		position: fixed;
		font-size: 1em;
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

	.button-container1 {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10px;
		margin-left: 100px;
	}

	.enter-button {
		padding: 10px 30px; /* Отступы внутри кнопки */
		background-color: #2c3726;
		color: #0dcd17;
		text-decoration: none;
		border-radius: 6px;
		margin-right: 10px;
	}

	.enter-button1 {
		padding: 0px 3px; /* Отступы внутри кнопки */
		color: #010101;
		text-decoration: none;
		border-radius: 2px;
		margin-right: 2px;
		border-bottom: 1px solid rgb(5, 3, 3);
		border-top: 1px solid rgb(5, 3, 3);
		border-right: 1px solid rgb(5, 3, 3);
		border-left: 1px solid rgb(5, 3, 3);
	}
	.card {
    display: flex;
    flex-direction: column; /* Располагаем элементы в колонку */
    height: 100%; /* Задаем высоту карточки */
}

.card-content {
    display: flex;
    flex-direction: column; /* Располагаем содержимое в колонку */
    flex-grow: 1; /* Позволяет этому контейнеру занимать оставшееся пространство */
}

.card-footer {
    display: flex; /* Используем Flexbox для размещения элементов в строку */
    justify-content: space-between; /* Размещаем элементы по краям */
    align-items: center; /* Центрируем элементы по вертикали */
    margin-top: auto; /* Отталкивает футер вниз */
}
</style>
