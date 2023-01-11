<script lang="ts">
  import type { EntryData } from "../../data/get-data";
  import SvelteMarkdown from "svelte-markdown";

  export let entry: EntryData;
  export let selected: boolean; 

  $: metadata = entry.metadata;
</script>

<section class:selected>
  <div class="datetime">
    <time datetime="{metadata.datetime}" title="{metadata.formattedDate}">
      <span class="year"       >{ metadata.year                  }</span>
      <span class="month-day"  >{ metadata.month }{ metadata.day    }</span>
      <span class="hour-minute">{ metadata.hour  }{ metadata.minute }</span>
    </time>
  </div>
  <div class="content">
    <SvelteMarkdown
      source={ entry.content }
    />
  </div>
  <div class="note">
    <p>
      { entry.note }
    </p>
  </div>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: 
      "datetime content"
      "datetime note";

    margin: 0.5em;

    padding: 1em;
    border: 1px solid rgb(0, 0, 0);
  }

  .selected {
    border: 1px solid rgb(148, 253, 0);
    outline: 5px solid rgb(148, 253, 0);
  }

  .datetime {
    grid-area: datetime;
    display: flex;

    justify-self: center;
    align-self: center;
  }

  time {
    display: flex;
    flex-direction: column;

    padding: 1em;
    color: black;
    border: 1px solid black;
  }

  .content {
    text-transform: lowercase;
    flex-grow: 1;
    flex-basis: 0;

    padding-left: 1rem;
    padding-top: 1rem;
    font-size: 1.5rem;

    grid-area: content;
  }

  .note {
    text-align: left;
    flex-grow: 1;
    flex-basis: 0;

    padding-left: 1em;
    padding-top: 1em;

    grid-area: note;

    opacity: 0.5;
  }

  /*
  .note p::before {
    content: "[ ";
  }

  .note p::after {
    content: " ]";
  }
  */
</style>