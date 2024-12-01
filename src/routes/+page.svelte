<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { Card, Button, Rating, Badge } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { userStatus } from '../lib/store/store.js';
	import { json } from '@sveltejs/kit';
	import { products } from '../lib/products/products';

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
		if(update_courier_active.length>3 || update_courier_active.length === 0){
			update_error_message = 'Courier active status must be either "active" or "inactive".';
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







//посмотреть информацию о продукте
	let info_product_name = '';
	let info_product_data = '';
	let product_error_info = '';
	function product_info_validateForm() {
		product_error_info = ''; 
		if (info_product_name.length>30 || info_product_name.length===0) {
			errorMassagecourieraction = 'Product must id be a positive number.';
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
	let update_product_id='';
	let update_product_name= '';
	let update_product_price = '';
	let update_product_count='';
	let update_product_error_message = '';

	function update_product_validateForm() {
		update_product_error_message = ''; // Очищаем сообщение об ошибке


		if(isNaN(parseInt(update_product_id)) || parseInt(update_product_id)<0){
			update_product_error_message = 'Product id must be a positive number.';
			return false;
		}
		if (update_product_name.length>30 || update_product_name.length === 0) {
			update_product_error_message = 'Name must be under 30 symbols.';
			return false;
		}
		if(isNaN(parseInt(update_product_price)) || parseInt(update_product_price)<0){
			update_product_error_message = 'Price must be a positive number.';
           return false;
		}
        if(isNaN(parseInt(update_product_count)) || parseInt(update_product_count)<0){
			update_product_error_message = 'Count must be a positive number.';
	        return false;
        }

		return true;
	}

	async function update_product_handleSubmit() {
		if (!update_product_validateForm()) return;

		const updateData = {
			product_id: parseInt(update_product_id),
			name: update_product_name,
			price: parseInt(update_product_price),
			count: parseInt(update_product_count)
		};
		try {
			const response = await fetch('http://localhost:18080/api/v1/product', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});
			if (!response.ok) {
				const errorData = await response.json();
				update_error_message = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				update_product_id = '';
				update_product_name = '';
				update_product_price = '';
				update_product_count='';
			}
		} catch (error) {
			console.error('Error adding user:', error);
			update_error_message = 'An unexpected error occurred.';
		}
	}



//удалить продукт
	let delete_product_id='';
	let delete_product_message = '';

	function delete_product_validateForm() {
		delete_product_message = ''; // Очищаем сообщение об ошибке

		if(isNaN(parseInt(delete_product_id)) || parseInt(delete_product_id)<0){
			delete_product_message = 'Product id must be a positive number.';
			return false;
		}

		return true;
	}
	
	async function delete_product_handleSubmit() {
		if (!delete_product_validateForm()) return;

		const deleteData = {
			product_id: parseInt(delete_product_id)
		};
		try {
			const response = await fetch('http://localhost:18080/api/v1/product', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(deleteData)
			});
			if (!response.ok) {
				const errorData = await response.json();
				delete_product_message = errorData.message || `HTTP error! status: ${response.status}`;
			} else {
				delete_product_id='';
			}
		} catch (error) {
			console.error('Error adding user:', error);
			delete_product_message = 'An unexpected error occurred.';
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
	  {#each products as product}
		<Card padding="none" class="card">
	  <a href="/">
		<img class="rounded-t-lg p-8" src="{product.image}" alt="product1" />
	  </a>
	  <div class="card-content px-5 pb-5 mt-auto">
		<a href="/">
		  <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
			{product.name}
		  </h5>
		</a>
		<Rating rating={product.rate} size={24} class="mb-5 mt-2.5">
		  <Badge slot="text" class="ms-3">{product.rate}</Badge>
		</Rating>
		<div class="card-footer flex items-center justify-between">
		  <span class="text-3xl font-bold text-gray-900 dark:text-white float-end">{product.price}</span>
		  <div class="flex space-x-2 float-end">
			<button class="enter-button1" on:click={() => removeFromCart(product.id, product.name,product.price)}>Delete</button>
			<button class="enter-button1" on:click={() => addToCart(product.id, product.name,product.price)}>Buy now</button>
		  </div>
		</div>
	  </div>
		</Card>
	  {/each}
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
		<p style="color: red;">{sum} rub</p>
		{#if cart.length > 0}
		<ul>
			{#each productnames as product}
				<li>{product}</li>
			{/each}
		</ul>
		{:else}
			Your cart is empty.
		{/if}
 </div> 
	





 
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
	<button class="enter-button">Update courier status</button>
	{#if update_error_message}
		<p style="color: red;">{update_error_message}</p>
	{/if}
 </form>




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










<form on:submit|preventDefault={info_product_handleSubmit}>
	<label for="info_product_name">Name:</label>
	<input type="text" id="info_product_name" bind:value={info_product_name} />

		<button class="enter-button">Get info product</button>
		{#if product_error_info}
			<p style="color: red;">{product_error_info}</p>
		{/if}
</form>
<div >
	{#if info_product_data}
		<p>
			Product ID: {info_product_data.product_id}, Name: {info_product_data.name}, Price: {info_product_data.price}, Count: {info_product_data.count}
		</p>
	{/if}
</div>


<form on:submit|preventDefault={update_product_handleSubmit}>
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




 <form on:submit|preventDefault={delete_product_handleSubmit}>
	<label for="delete_product_id">Product id:</label>
	<input type="number" id="delete_product_id" bind:value={delete_product_id} />

	<button class="enter-button">Delete product</button>
	{#if delete_product_message}
		<p style="color: red;">{delete_product_message}</p>
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
