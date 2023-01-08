<script lang="ts">
  export let timeline: number[];
  export let selectedDay: number | undefined = undefined;
</script>

<div class="timeline">
  {#each timeline as count, i (i) }
    <div 
      class="day {selectedDay === i ? 'selected' : ''}"
      style="
        opacity: {Math.min(count / 10.0, 1)};
      "
    >
    </div>
  {/each}
</div>

<style>
  .timeline {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    border: 1px solid black;

    padding: 1em;
  }

  .day {
    width: 1rem;
    height: 1rem;
    margin: 0.1rem;
    border: 1px solid black;
    background-color: black;
  }

  .day.selected {
    background-color: green;
  }
</style>