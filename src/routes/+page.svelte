<script>
	import { onMount } from 'svelte';


  let age = '';
  let gender = '';
  let phone = '';
  let active = '';
  let errorMessage = '';

  function validateForm() {
    errorMessage = ''; // Очищаем сообщение об ошибке

    if (isNaN(parseInt(age)) || parseInt(age) <= 0) {
      errorMessage = 'Age must be a positive number.';
      return false;
    }

    const phoneRegex = /^\d{11,12}$/;
    if (!phoneRegex.test(phone)) {
      errorMessage = 'Phone number must be 11 or 12 digits long.';
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return; // Прерываем отправку, если форма не прошла валидацию

    const courierData = {
      id: crypto.randomUUID(),
      age: parseInt(age),
      gender: gender,
      phone: phone,
      active: active
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
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } else {
        alert('Courier added successfully!');
        age = '';
        gender = '';
        phone = '';
        active = '';
      }
    } catch (error) {
      console.error('Error adding courier:', error);
      errorMessage = 'An unexpected error occurred.';
    }
  }






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

  .enter-button {
    padding: 10px 30px; /* Отступы внутри кнопки */
    background-color: #2c3726; 
    color: #0dcd17;
    text-decoration: none; 
    border-radius: 6px;
  }
</style>

<div class="colored-gray">
  <div class="text2">
     <p>+79814576088  24-hour room Service</p>
  </div>

</div>





<div class="colored-green">

  
  <div class="header">
    <h1 >EcoMarket</h1>
  </div>

  <a href="#top" class="enter-button">Enter</a>
</div>


<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>







<form on:submit|preventDefault={handleSubmit}>
  <label for="age">Age:</label>
  <input type="number" id="age" bind:value={age} />

  <label for="gender">Gender:</label>
  <input type="text" id="gender" bind:value={gender} />

  <label for="phone">Phone:</label>
  <input type="tel" id="phone" bind:value={phone} />

  <label for="active">Active:</label>
  <input type="text" id="active" bind:value={active} />

  <button type="submit">Add Courier</button>
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}
</form>







<!-- <img src="http://google.com/coolcat.jpg" /> -->
