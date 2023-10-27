<script lang="ts">
  import Row from "./row.svelte";
  import Modal from "../components/Modal.svelte";
  export let items = [];
  export let removeItem;
  let isModalVisible;

  let responsavel = "";
  let chavePix = "";

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

  async function generateImage() {
    const selectedItemsElement = document.querySelector(
      ".selected-items"
    ) as HTMLElement;
    if (selectedItemsElement) {
      const canvas = await html2canvas(selectedItemsElement);
      const imgURL = canvas.toDataURL("image/png");

      let link = document.createElement("a");
      link.download = `listaPedidos_${getFormattedDate()}.png`;
      link.href = imgURL;
      link.click();
    }
  }

  import { jsPDF } from "jspdf";

  function generatePDFReport() {
    if (items.length === 0) {
      isModalVisible = true;
      return;
    }
    const doc = new jsPDF();

    doc.setFillColor(220, 20, 60); // Vermelho
    doc.rect(0, 0, 220, 30, "F");
    doc.setTextColor(255, 255, 255); // Branco
    doc.setFontSize(18);
    doc.text("Lista de Pedidos", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Preto
    doc.text(`Responsável: ${responsavel}`, 20, 40);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Preto

    let yPos = 60;

    doc.setFontSize(12);
    doc.text(`Pix: ${chavePix}`, 20, 50);
    yPos += 10;

    items.forEach((item, index) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Preto
      const itemText = `${item.name} - ${item.size} - ${item.count} x ${item.price}`;
      doc.text(itemText, 20, yPos);
      yPos += 10;

      if (item.details) {
        item.details.forEach((detail) => {
          doc.setFontSize(10);
          const solicitante = `${detail.solicitante}`;
          doc.text(solicitante, 30, yPos);
          yPos += 8;

          if (detail.observacao && detail.observacao.trim() !== "") {
            const observacao = `Observação: ${detail.observacao}`;
            doc.text(observacao, 30, yPos);
            yPos += 10;
          }
        });
      }

      // Linha de Separação
      doc.setDrawColor(220, 220, 220); // Cinza claro
      doc.line(20, yPos, 190, yPos);
      yPos += 5;
    });

    // Totais
    yPos += 10;
    doc.setFontSize(14);
    const totalCountText = `Total de itens: ${totalCount}`;
    const totalValueText = `Valor total: R$ ${totalValue.toFixed(2)}`;
    doc.text(totalCountText, 20, yPos);
    yPos += 10;
    doc.text(totalValueText, 20, yPos);

    // Rodapé Estilizado

    doc.save(`listaPedidos_${getFormattedDate()}.pdf`);
  }

  const solicitantes = [
    "Aelmo Lustosa",
    "Augusto Batista",
    "Eliezer Castro",
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
  <button class="save-file" on:click={() => generateImage()}>
    Salvar Pedido
  </button>
  <button class="pdf-generate" on:click={() => generatePDFReport()}>
    Gerar PDF
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
  .responsavel {
    width: 100%;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .save-file,
  .pdf-generate {
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
  .pdf-generate {
    background-color: #595959;
  }

  .save-file:hover {
    background-color: #352da3;
  }
</style>
