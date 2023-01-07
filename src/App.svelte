<script lang="ts">
  import { onMount } from 'svelte';
  import Entry from './components/entry/Entry.svelte';
  import { getDataLocalTest, type EntryData } from './data/get-data';

  let entries: EntryData[] = [];

  onMount(() => {
    getDataLocalTest()
      .then(entriesData => {
        entries = entriesData;
      });
  });
</script>

<ol>
  { #each entries as entry }
  <li>
    <Entry
      { entry }  
    />
  </li>
  { /each }
</ol>

<style>
  ol {
    list-style: none;
  }
</style>