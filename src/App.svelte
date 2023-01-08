<script lang="ts">
  import { onMount } from 'svelte';
  import Entry from './components/entry/Entry.svelte';
  import Timeline from './components/timeline/Timeline.svelte';
  import { getDataLocalTest, type EntryData } from './data/get-data';

  let entries: EntryData[] = [];
  let numberOfDays: number = 0;
  let timeline: number[] = [];

  let selectedEntry: EntryData | undefined = undefined;

  onMount(() => {
    getDataLocalTest()
      .then(data => {
        entries = data.entries;
        numberOfDays = data.numberOfDays;
        timeline = data.timeline;
      });
  });
</script>

<aside>
  <Timeline
    { timeline }
    selectedDay={selectedEntry ? selectedEntry.dayIndex : undefined}
  />
</aside>
<main>
  <ol>
    { #each entries as entry, i }
    <li id={"" + entry.dayIndex + "-" + i}>
      <a 
        id="{entry.metadata.datetime}"
        href="#{entry.metadata.datetime}"
        draggable="false"
        on:click={() => {
          selectedEntry = entry;
        }}
      >
        <Entry
          { entry }  
        />
      </a>
    </li>
    { /each }
  </ol>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: #ececec;
  }

  ol {
    max-width: 700px;
    /*
    list-style: decimal-leading-zero;
    */
  }

  aside {
    display: flex;
    background-color: #ececec;

    position: fixed;
  }

  a:focus {
    outline: 1px solid black;
  }
</style>