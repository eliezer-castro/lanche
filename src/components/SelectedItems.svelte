<script lang="ts">
  import Modal from "../components/Modal.svelte";
  export let items = [];
  export let removeItem;
  let isModalVisible;

  export let responsavel = "";
  export let chavePix = "";

  const solicitantes = [
    "Aelmo Lustosa",
    "Augusto Batista",
    "Eduardo Vinhal",
    "Eliezer Castro",
    "Ézio Gomes",
    "Gabriel Silva",
    "Jayrson Parana",
    "João Tavares",
    "Sheldon Pereira",
    "Thiago Paiva",
    "Valdisnei Nilo",
  ];
  $: totalValue = items.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("R$ ", "")) * item.count,
    0
  );
  $: totalCount = items.reduce((sum, item) => sum + item.count, 0);

  function handleDetailChange(event, item, index, type) {
    if (!item.details) {
      item.details = [];
    }
    if (!item.details[index]) {
      item.details[index] = { solicitante: "", observacao: "" };
    }
    if (type === "solicitante") {
      item.details[index].solicitante = event.target.value;
    } else if (type === "observacao") {
      item.details[index].observacao = event.target.value;
    }
  }
</script>

<div class="selected-items">
  <Modal
    bind:isVisible={isModalVisible}
    onClose={() => (isModalVisible = false)}
  />
  <div class="title-list">Lista de Produto</div>

  {#if items.length === 0}
    <div class="empty-message">Por favor, adicione um produto.</div>
  {:else}
    <input
      class="responsavel"
      bind:value={responsavel}
      placeholder="Resposável"
    />

    <div class="pix-input">
      <select id="tipo-pix">
        <option value=""> Chave Pix</option>
        <option value="CPF">CPF</option>
        <option value="Telefone">Telefone</option>
        <option value="E-mail">E-mail</option>
      </select>
      <input
        type="text"
        id="chave-pix"
        bind:value={chavePix}
        placeholder="Digite a chave PIX"
      />
    </div>
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
            <select
              value={item.details && item.details[index]
                ? item.details[index].solicitante
                : ""}
              on:change={(e) =>
                handleDetailChange(e, item, index, "solicitante")}
            >
              <option value="">Solicitante</option>
              {#each solicitantes as solicitante}
                <option value={solicitante}>{solicitante}</option>
              {/each}
            </select>
            <input
              type="text"
              placeholder="Observação"
              value={item.details && item.details[index]
                ? item.details[index].observacao
                : ""}
              on:input={(e) => handleDetailChange(e, item, index, "observacao")}
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

    width: 500px;
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

  .pix-input {
    display: flex;
    align-items: center;
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

  select,
  input {
    font-size: 13px;
    height: 32px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  select {
    width: 30%;
    margin-right: 2%;
  }
  input {
    width: 70%;
  }
  .responsavel {
    width: 100%;
    margin-top: 12px;
    margin-bottom: 12px;
  }
</style>
