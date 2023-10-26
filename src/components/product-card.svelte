<script lang="ts">
  export let name;
  export let size;
  export let price;
  export let IconComponent;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function addToCart() {
    dispatch("addToCart");
    console.log("Adicionado ao carrinho");
  }
</script>

<div class="card">
  <button class="icon">
    <svelte:component this={IconComponent} />
  </button>
  <div class="wrapper">
    <div class="details">
      <div class="details-name">{name}</div>
      <div class="details-size">{size}</div>
      <div class="details-price">{price}</div>
    </div>
    <button class="button" on:click={addToCart}
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        ><path
          d="M450.001-450.001h-230v-59.998h230v-230h59.998v230h230v59.998h-230v230h-59.998v-230Z"
          fill="#4f44e0"
        /></svg
      ></button
    >
  </div>
</div>

<style>
  .card {
    height: 145px;
    width: 175px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
  }
  .details {
    gap: 4px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
  }

  .details-name {
    font-size: 16px;
    font-weight: 500;
  }
  .details-size {
    font-size: 12px;
    color: #595959;
  }
  .details-price {
    font-size: 14px;
  }

  .icon {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .button {
    background-color: #edecfc;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 256px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
  }

  .button:hover {
    background-color: #e0e0e0;
  }
</style>
