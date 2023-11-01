<script lang="ts">
  import PixIcon from "./icons/pix-icon.svelte";

  export let responsavel;
  export let chavePix;

  export let ticketElement;

  export let items = [];

  $: totalValue = items.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("R$ ", "")) * item.count,
    0
  );
  $: totalCount = items.reduce((sum, item) => sum + item.count, 0);
</script>

<section bind:this={ticketElement} class="ticket">
  <div class="content">
    <div class="header">
      <p class="title">Resumo do pedido</p>
      <p class="subtitle">Realizando em 31/10/2023 - 12:03</p>
    </div>
    <div class="c-pix">
      <div class="c-chave row">
        <p class="title">{responsavel}</p>
        <div class="row">
          <PixIcon />
          <p>&ensp;</p>
          <p class="subtitle">{chavePix}</p>
        </div>
      </div>
    </div>
    <div class="product">
      {#each items as item (item.name)}
        <div class="item">
          <div class="row">
            <div class="column">
              <p class="c-title-product">{item.name}</p>
            </div>
            <div class="column">
              <p class="c-price-product">{item.count}x R$ {item.price}</p>
            </div>
          </div>
          {#if item.details}
            <div class="people-list column">
              {#each item.details as detail}
                <div class="people column">
                  <p class="c-people-name">{detail.solicitante}</p>
                  {#if detail.observacao}
                    <p class="c-people-observation">{detail.observacao}</p>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
    <div class="price">
      <div class="row">
        <p class="price-label">Total</p>
        <p class="price-total">R$ {totalValue.toFixed(2)}</p>
      </div>
    </div>
  </div>
</section>

<style>
  .people {
    width: 100%;
    font-weight: 500;
  }

  .c-people-name {
    margin-top: 2px;
    font-size: 12px;
  }
  .c-people-observation {
    font-size: 12px;
    font-weight: 400;
    color: #888;
  }
  .c-title-product {
    font-size: 14px;
    font-weight: 500;
  }
  .people-list {
    margin-left: 8px;
    gap: 4px;
  }
  .c-price-product {
    font-size: 14px;
  }

  .price {
    margin-top: 8px;
    border-top: 1px solid #eee;
    padding: 8px 0;
  }
  .content {
    position: relative;
    width: 300px;
    padding: 20px;
    background-color: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .content::before {
    content: "";
    position: absolute;
    top: -11px;
    left: 0;
    right: 0;
    height: 12px;
    background-color: white;
    clip-path: polygon(
      -1% 100%,
      4% 0,
      9% 100%,
      14% 0,
      19% 100%,
      24% 0,
      29% 100%,
      34% 0,
      39% 100%,
      44% 0,
      49% 100%,
      54% 0,
      59% 100%,
      64% 0,
      69% 100%,
      74% 0,
      79% 100%,
      84% 0,
      89% 100%,
      95% 0,
      101% 100%
    );
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
  }
  * {
    padding: 0;
    margin: 0;
  }

  .ticket {
    display: block;
    padding: 20px;
    background-color: blueviolet;
  }
  .content {
    background-color: white;
  }

  .header {
    padding: 8px;
    border-bottom: 1px solid #eee;
  }
  .c-pix {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  .c-chave {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .c-chave p {
    font-size: 13px;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: rgb(26, 26, 26);
  }

  .subtitle {
    font-size: 12px;
    color: #888;
  }

  .product {
    padding-top: 8px;
  }

  .price-label {
    font-size: 14px;
    font-weight: 500;
    color: #010101;
  }
  .price-total {
    font-size: 14px;
    font-weight: 500;
    color: #010101;
  }
</style>
