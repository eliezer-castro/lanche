<script lang="ts">
  export let isVisible = false;
  export let onClose = () => {};
</script>

{#if isVisible}
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Aviso</h2>
      <p>Por favor, selecione itens antes de salvar.</p>
      <button on:click={onClose}>Fechar</button>
    </div>
    <button
      class="overlay-close-button"
      on:click={onClose}
      aria-label="Fechar modal"
    />
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 400px;
    text-align: center;
  }

  .modal-content h2 {
    margin-top: 0;
  }

  .modal-content button {
    margin-top: 20px;
    padding: 10px 15px;
    border: none;
    background-color: #4f44e0;
    color: white;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.3s;
  }

  .modal-content button:hover {
    background-color: #352da3;
  }

  .overlay-close-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    z-index: -1;
  }
</style>
