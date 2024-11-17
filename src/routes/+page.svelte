





<script>
	import { onMount } from 'svelte';
    let suggestions;


	onMount(() => {
        
fetch('http://localhost:18080/api/couriers')
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    suggestions=data
    console.log(data);
  });
	console.log('the component has mounted');
  });


  let items = [];
for (let i = 1; i <= 3; i++) {
  items.push(i);
}



</script>


<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
{suggestions}

<style>
  .colored-block {
    background-color: lightblue;
    color: darkblue;
    padding: 20px;
    border: 1px solid black;
    text-align: center;  
    max-width: 300px; 
    margin: 20px auto;
  }
</style>



<div class="colored-block">
  <h2>Это текст в цветном блоке</h2>
  <p>Еще текст внутри блока.</p>
</div>

<h1>Список покупок</h1>
<ul>
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>
<!-- <img src="http://google.com/coolcat.jpg" /> -->
