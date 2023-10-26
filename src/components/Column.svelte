<div class="column">
  <slot />
</div>

<style>
  .column {
    gap: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .column > * {
    flex: 1;
  }
</style>
