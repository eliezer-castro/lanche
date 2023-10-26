<!-- SelectedItems.svelte -->
<script lang="ts">
  export let items = [];
  export let removeItem;

  $: totalValue = items.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("R$ ", "")) * item.count,
    0
  );
  $: totalCount = items.reduce((sum, item) => sum + item.count, 0);

  function handleDetailChange(event, item, index) {
    if (!item.details) {
      item.details = [];
    }
    item.details[index] = event.target.value;
  }
</script>

<div class="selected-items">
  <div class="title-list">Lista de Produto</div>

  {#if items.length === 0}
    <div class="empty-message">Por favor, adicione um produto.</div>
  {:else}
    {#each items as item (item.name)}
      <div class="item">
        <div class="row">
          <div class="column">
            <div class="name">{item.name}</div>
            <div class="size">{item.size}</div>
          </div>
          <div class="row">
            <div>{item.count} x</div>
            <span style="width: 4px;" />
            <div>{item.price}</div>
            <span style="width: 8px;" />
            <button class="remove" on:click={() => removeItem(item)}
              >Remover</button
            >
          </div>
        </div>
        {#each Array(item.count).fill(0) as _, index}
          <div class="detail-input">
            <input
              value={(item.details && item.details[index]) || ""}
              on:input={(e) => handleDetailChange(e, item, index)}
              placeholder="Solicitante"
            />
          </div>
        {/each}
      </div>
    {/each}
    <div class="total row">
      <div>Total de itens: {totalCount}</div>
      <div>Valor total: R$ {totalValue.toFixed(2)}</div>
    </div>
  {/if}
</div>

<style>
  .selected-items {
    padding: 20px;

    max-width: 500px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  .item {
    border: 1px solid #eee;
    padding: 8px;
    margin-top: 10px;
    border-radius: 4px;
  }
  .name {
    font-size: 14;
    font-weight: 500;
  }
  .size {
    font-size: 12px;
    color: #595959;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    justify-content: space-between;
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }

  .remove {
    background-color: #fcecec;
    padding: 8px;
    display: flex;
    font-size: 12px;
    font-weight: 500;
    align-items: center;
    justify-content: center;
    border-radius: 256px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
  }

  .remove:hover {
    background-color: #e0e0e0;
  }
  .title-list {
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .empty-message {
    text-align: left;
    color: #888;
    font-size: 14px;
  }
  .total {
    margin-top: 14px;
    border-top: 1px solid #eee;
    padding-top: 8px;
    font-weight: 500;
  }

  .detail-input {
    margin-top: 6px;
    display: flex;
  }

  .detail-input input {
    font-size: 12px;
    height: 32px;
    padding: 4px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    width: 300px;
  }
  input:focus {
    border: 1px solid #4f44e0;
  }
</style>
