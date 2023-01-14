<script lang="ts">
  import type { Day } from "../../data/get-data";

  export let selected: boolean;
  export let day: Day;

  $: ({ 
    entryIndices, 
    datetime,
    count 
  } = day);

  const maxCount = 5;
</script>

<time 
  title={datetime} 
  datetime={datetime}
  style="
    --opacity: {Math.min(count / maxCount, 1)};
  "
  class:selected
  class:non-empty={day.count > 0}
>
  { #if count }
    <a 
      href="#{entryIndices[0]}"
      class="day"
      class:selected
    >
    </a>
  { :else }
    <span class="day" class:selected />
  { /if }
</time>

<style>
  time {
    margin: 0.1rem;
  }

  .non-empty {
    /*
    border: 1px solid var(--fg);
    */
  }

  .day {
    display: block;
    width: 100%;
    height: 100%;

    background-color: var(--fg);
    opacity: var(--opacity);
  }

  time.selected {
    border: unset;
  }

  a.selected {
    background-color: var(--accent);
    box-shadow: 0px 0px 20px 10px var(--accent);
  }
</style>