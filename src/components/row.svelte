<div class="row">
  <slot />
</div>

<style>
  .row {
    gap: 16px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    /* width: 100%; */
  }

  .row > * {
    flex: 1;
  }
</style>
