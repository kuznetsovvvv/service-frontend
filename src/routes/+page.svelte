<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
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
		if (!courier_validateForm()) return; // Прерываем отправку, если форма не прошла валидацию

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







	let user_age = '';
	let user_gender = '';
	let user_phone = '';
	let user_errorMessage = '';

	function user_validateForm() {
		user_errorMessage = ''; // Очищаем сообщение об ошибке

		if (isNaN(parseInt(user_age)) || parseInt(user_age) <= 0) {
			user_errorMessage = 'Age must be a positive number.';
			return false;
		}

		const phoneRegex = /^[+]?\d{11,12}$/;
		if (!phoneRegex.test(user_phone)) {
			user_errorMessage = 'Phone number must be 11 or 12 digits long.';
			return false;
		}

		return true;
	}

	async function user_handleSubmit() {
		if (!user_validateForm()) return; // Прерываем отправку, если форма не прошла валидацию

		const userData = {
			age: parseInt(user_age),
			gender: user_gender,
			phone: user_phone
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
			}
		} catch (error) {
			console.error('Error adding user:', error);
			user_errorMessage = 'An unexpected error occurred.';
		}
	}



	let user_phone_info = '';
	let user_errorMessage_info = '';
  	let user_data=null;
	function infovalidateForm() {
		user_errorMessage_info = ''; // Очищаем сообщение об ошибке

		const phoneRegex = /^[+]?\d{11,12}$/;
		if (!phoneRegex.test(user_phone_info)) {
			user_errorMessage_info = 'Phone number must be 11 or 12 digits long.';
			return false;
		}

		return true;
	}
  async function infohandleSubmit() {
		if (!infovalidateForm()) return; // Прерываем отправку, если форма не прошла валидацию
   
		try {
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
      user_data=null;
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
	<div class="header">
		<h1>EcoMarket</h1>
	</div>

	<a href="#top" class="enter-button">Enter</a>
</div>

<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>





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


<form on:submit|preventDefault={user_handleSubmit}>
	<label for="age">Age:</label>
	<input type="number" id="age" bind:value={user_age} />

	<label for="gender">Gender:</label>
	<input type="text" id="gender" bind:value={user_gender} />

	<label for="phone">Phone:</label>
	<input type="text" id="phone" bind:value={user_phone} />

	<button class="enter-button">Add User</button>
	{#if user_errorMessage}
		<p style="color: red;">{user_errorMessage}</p>
	{/if}
</form>



<form on:submit|preventDefault={infohandleSubmit}>  
	<label for="user_phone_info">Phone:</label>
	<input type="number" id="user_phone_info" bind:value={user_phone_info} />

  <button class="enter-button">Get info user</button>
  {#if user_errorMessage_info}
  <p style="color: red;">{user_errorMessage_info}</p>
{/if}
</form>
{#if user_data} 
<p>User ID: {user_data.user_id}, Age: {user_data.age}, Gender: {user_data.gender}, Phone: {user_data.phone}</p>
{/if}









<div class="button-container">
	<button class="enter-button" on:click={() => goto('/basket')}>Go to order</button>
  </div>
















<!-- <img src="http://google.com/coolcat.jpg" /> -->






























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

	.header {
		font-size: 3em;
		margin: 0;
		flex-grow: 1;
		text-align: center;
	}

	.text1 {
		font-size: 3em;
		margin: 0;
		flex-grow: 1;
		text-align: center;
	}

	.text2 {
		font-size: 1em;
		margin: 0;
		flex-grow: 1;
		text-align: right;
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
</style>
