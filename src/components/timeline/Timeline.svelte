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
  <time class="date">
    { datetime }
  </time> 
  { /if }
</div>

<style>
  .timeline {
    padding: 1em;
  }

  ol {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    width: 170px;
    height: 170px;

    padding: 0.4rem;
  }

  .date {
    display: block;
    padding: 0.3rem;
    margin: 0.5rem;
    font-size: 1.5rem;
    font-family: var(--font-mono);

    background-color: var(--fg);
    color: var(--bg);

    text-align: center;
  }
</style>