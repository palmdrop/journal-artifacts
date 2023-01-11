<script lang="ts">
  import type { Day } from "../../data/get-data";
  import DayCell from "./DayCell.svelte";

  export let timeline: Day[];
  export let selectedIndex: number;

  let selectedDay: number = -1;
  let datetime: string = "";
  $: {
    selectedDay = -1;
    datetime = "";

    for(let i = 0; i < timeline.length; i++) {
      const day = timeline[i];
      if(day.entryIndices.includes(selectedIndex)) {
        selectedDay = i;
        datetime = day.datetime;
        break;
      }
    }
  }
</script>

<div class="timeline">
  <ol>
    {#each timeline as day, i (i) }
      <DayCell
        { day }
        selected={selectedDay === i}
      />
    {/each}
  </ol>
  { #if datetime.length !== 0 }
  <time>
    { datetime }
  </time> 
  { /if }
</div>

<style>
  .timeline {
    border: 1px solid black;

    padding: 1em;
  }

  ol {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
</style>