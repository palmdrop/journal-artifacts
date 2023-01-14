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
    grid-template-rows: 1fr auto;
    grid-template-areas: 
      "datetime content"
      "datetime note";

    margin: 0.5em;

    padding: 2em;

    transition: 0.3s;

    position: relative;
  }

  .datetime {
    grid-area: datetime;
    display: flex;

    justify-self: center;
    align-self: center;

    background-color: var(--fg);
    color: var(--bg);

    font-family: var(--font-mono);
    margin-right: 2rem;
  }

  .selected .datetime {
    background-color: var(--accent);
    color: var(--fg);

    box-shadow: 0px 0px 30px 10px var(--accent);
  }

  time {
    display: flex;
    flex-direction: column;

    padding: 1em;
  }

  .content {
    text-transform: lowercase;
    flex-grow: 1;
    flex-basis: 0;

    font-size: 2rem;

    grid-area: content;

    text-shadow: 0px 0px 3px var(--bg);
  }

  .note {
    text-align: left;
    flex-grow: 1;
    flex-basis: 0;

    padding-top: 1em;

    grid-area: note;

    text-transform: lowercase;
    font-size: 1.1rem;
    font-family: var(--font-mono);
  }
</style>