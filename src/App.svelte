<script lang="ts">
  import { onMount } from "svelte";
  import html2canvas from "html2canvas";
  import Card from "./components/product-card.svelte";
  import Row from "./components/row.svelte";
  import Column from "./components/Column.svelte";
  import SelectedItems from "./components/SelectedItems.svelte";
  import waterMedium from "./components/icons/water-medium-icon.svelte";
  import waterLoss from "./components/icons/water-loss-icon.svelte";
  import waterFull from "./components/icons/water-full-icon.svelte";
  import pastel from "./components/icons/pastel-icon.svelte";
  import Ticket from "./components/ticket.svelte";

  let ticketElement;

  onMount(() => {
    ticketElement.style.display = "none";
  });

  function getFormattedDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }

  let selectedItems = [];

  async function generateImage() {
    const selectedItemsElement = document.querySelector(
      ".selected-items"
    ) as HTMLElement;
    if (selectedItemsElement) {
      // selectedItemsElement.style.display = "block";
      const canvas = await html2canvas(selectedItemsElement);
      // selectedItemsElement.style.display = "none";
      const imgURL = canvas.toDataURL("image/png");

      let link = document.createElement("a");
      link.download = `listaPedidos_${getFormattedDate()}.png`;
      link.href = imgURL;
      link.click();
    }
  }

  let responsavel = "";
  let chavePix = "";

  function addToCart(item) {
    const existingItem = selectedItems.find((i) => i.name === item.name);

    if (existingItem) {
      existingItem.count += 1;

      selectedItems = selectedItems;
    } else {
      selectedItems = [...selectedItems, { ...item, count: 1 }];
    }
  }

  function removeItem(itemToRemove) {
    if (itemToRemove.count > 1) {
      const existingItem = selectedItems.find(
        (item) => item.name === itemToRemove.name
      );
      existingItem.count -= 1;
      selectedItems = selectedItems;
    } else {
      selectedItems = selectedItems.filter((item) => item !== itemToRemove);
    }
  }
</script>

<svelte:head>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap");
  </style>
</svelte:head>

<main>
  <Row>
    <Column>
      <Row>
        <Card
          name="Açaí P"
          price="R$ 3,00"
          size="pequeno"
          IconComponent={waterLoss}
          on:addToCart={() =>
            addToCart({ name: "Açaí P", price: "R$ 3,00", size: "pequeno" })}
        />
        <Card
          name="Açaí M"
          price="R$ 4,00"
          size="Médio"
          IconComponent={waterMedium}
          on:addToCart={() =>
            addToCart({ name: "Açaí M", price: "R$ 4,00", size: "Médio" })}
        />
        <Card
          name="Açaí G"
          price="R$ 5,00"
          size="Grande"
          IconComponent={waterFull}
          on:addToCart={() =>
            addToCart({ name: "Açaí G", price: "R$ 5,00", size: "Grande" })}
        />
      </Row>
      <Row>
        <Card
          name="Pastel de Carne"
          price="R$ 2,00"
          size="Normal"
          IconComponent={pastel}
          on:addToCart={() =>
            addToCart({
              name: "Pastel de Carne",
              price: "R$ 2,00",
              size: "Normal",
            })}
        />
        <Card
          name="Pastel de Frango"
          price="R$ 2,00"
          size="Normal"
          IconComponent={pastel}
          on:addToCart={() =>
            addToCart({
              name: "Pastel de Frango",
              price: "R$ 2,00",
              size: "Normal",
            })}
        />
        <Card
          name="Misto"
          price="R$ 2,00"
          size="Normal"
          IconComponent={pastel}
          on:addToCart={() =>
            addToCart({ name: "Misto", price: "R$ 2,00", size: "Normal" })}
        />
      </Row>
    </Column>
    <div class="column">
      <SelectedItems
        items={selectedItems}
        {removeItem}
        bind:responsavel
        bind:chavePix
      />
      <Row>
        <button class="save-file" on:click={() => generateImage()}>
          Salvar Pedido
        </button>
      </Row>
    </div>
  </Row>
</main>

<style>
  :global(body) {
    font-family: "Inter";
    margin: 0;
    padding: 0;
  }
  :global(input, button, select, textarea) {
    margin: 0;
  }
  main {
    text-align: center;
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .save-file {
    background-color: #4f44e0;
    color: white;
    padding: 8px;
    display: flex;
    font-size: 14px;
    font-weight: 500;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
  }

  .save-file:hover {
    background-color: #352da3;
  }

  .column {
    gap: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
