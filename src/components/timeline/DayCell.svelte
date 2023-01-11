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
    border: 1px solid black;
    margin: 0.1rem;
  }

  .day {
    display: block;
    width: 100%;
    height: 100%;

    background-color: black;
    opacity: var(--opacity);
  }

  .selected {
    background-color: green;
  }
</style>