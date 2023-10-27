<!-- SelectedItems.svelte -->
<script lang="ts">
  import PixIcon from "./icons/pix-icon.svelte";
  import Row from "./row.svelte";
  import Modal from "../components/Modal.svelte";
  export let items = [];
  export let removeItem;
  let isModalVisible;

  let pixKey = "";

  const messageText = `Olá! Aqui está a lista de pedidos atualizada para sua revisão. Por favor, verifique os itens listados e confirme se tudo está correto. Obrigado!`;

  async function shareToSlack(dataUrl) {
    const token = "xoxb-573526686480-6096992548550-DhDJznqh4UFMHsRKZLnKzTu0";
    const channel = "CGY7TC8F7";

    const blob = await (await fetch(dataUrl)).blob();

    const formData = new FormData();
    formData.append("token", token);
    formData.append("channels", channel);
    formData.append("file", blob);

    fetch("https://slack.com/api/files.upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (!data.ok) {
          throw new Error(data.error);
        }
        const payload = {
          channel: channel,
          text: messageText,
          token: token,
        };

        const response = await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const jsonData = await response.json();

        if (!jsonData.ok) {
          throw new Error(jsonData.error);
        }
      })
      .catch((error) => {
        console.error("Erro ao comunicar com o Slack:", error);
      });
  }

  import html2canvas from "html2canvas";

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

  async function generateImage(shareToSlackFlag = false) {
    if (items.length === 0) {
      isModalVisible = true;
      return;
    }

    const selectedItemsElement = document.querySelector(
      ".selected-items"
    ) as HTMLElement;
    if (selectedItemsElement) {
      const canvas = await html2canvas(selectedItemsElement);
      const imgURL = canvas.toDataURL("image/png");

      if (shareToSlackFlag) {
        shareToSlack(imgURL);
      } else {
        let link = document.createElement("a");
        link.download = `listaPedidos_${getFormattedDate()}.png`;
        link.href = imgURL;
        link.click();
      }
    }
  }

  const solicitantes = [
    "Eliezer Castro",
    "João Tavares",
    "Thiago Paiva",
    "Aelmo Lustosa",
    "Augusto Batista",
    "Gabriel Silva",
    "Jayrson Parana",
    "Sheldon Pereira",
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
    <div class="pix-input">
      <select id="tipo-pix">
        <option value=""> Chave Pix</option>
        <option value="CPF">CPF</option>
        <option value="Telefone">Telefone</option>
        <option value="E-mail">E-mail</option>
      </select>
      <input type="text" id="chave-pix" placeholder="Digite a chave PIX" />
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
              value={(item.details && item.details[index].solicitante) || ""}
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
              value={(item.details && item.details[index].observacao) || ""}
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
<Row>
  <button class="save-file" on:click={() => generateImage(false)}>
    Salvar Pedido
  </button>
  <button class="shared-slack" on:click={() => generateImage(true)}>
    Compartilhar no Slack
  </button>
</Row>

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

  .shared-slack {
    background-color: #4a154b;
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
  .shared-slack:hover {
    background-color: #390f3a;
  }
</style>
