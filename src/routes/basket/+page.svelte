<script>
  import { goto } from '$app/navigation';
let items = [];
for (let i = 1; i <= 3; i++) {
  items.push(i);
}




</script>



<head>
  <title>Centered Blocks</title>
<style>
  .container {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center;    /* Center vertically */
    height: 300px;         /* Adjust as needed */
    width: 80%;            /* Adjust as needed, responsive layout */
    margin: 0 auto;        /* Center container within page */
    border: 1px solid #ccc; /* Optional border for visual clarity */
  }
  
  .block {
    width: 30%;             /* Adjust block width as desired */
    height: 100%;            /* Ensures equal height */
    background-color: #f0f0f0; /* Light gray background */
    margin: 0 1%;            /* Adds some space between blocks */
    text-align: center;       /* Centers text within block */
    border: 1px solid #ddd;   /* Optional border */
    padding: 20px;            /* Add padding around the content */
    box-sizing: border-box;   /* Important! Includes padding in the width calculation */
  }
  
  </style>
  </head>
  <!-- <body>
  
  <div class="container">
    <div class="block">
      Add your image here -->
      <!-- <img src="image1.jpg" alt="Image 1" style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;">  
    </div>
    <div class="block">
      <img src="image2.jpg" alt="Image 2" style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;">
    </div>
    <div class="block">
      <img src="image3.jpg" alt="Image 3" style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;">
    </div>
  </div>
  
  </body> -->
 
  <div class="button-container">
  <button class="enter-button" on:click={() => goto('/')}>Go back</button>
  </div>

<h1>Список покупок</h1>
<ul>
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>




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


</style>