<script>
let items = [];
for (let i = 1; i <= 3; i++) {
  items.push(i);
}




</script>










<h1>Список покупок</h1>
<ul>
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>
