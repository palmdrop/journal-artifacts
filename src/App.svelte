<script lang="ts">
  import { onMount } from 'svelte';
  import throttle from 'lodash.throttle';
  import Entry from './components/entry/Entry.svelte';
  import Timeline from './components/timeline/Timeline.svelte';
  import { getDataLocalTest, type Day, type EntryData } from './data/get-data';

  let entries: EntryData[] = [];
  let timeline: Day[] = [];

  const entryElements: HTMLElement[] = Array<HTMLElement>(entries.length);

  onMount(() => {
    // Fetches page data
    // TODO: pagination will be necessary as data grows!
    getDataLocalTest()
      .then(data => {
        entries = data.entries;
        timeline = data.timeline;
      });

    // Listens to hash changes elsewhere (such as the timeline) and updates the index accordingly 
    const onHashChange = () => {
      try {
        const index = Number(location.hash.slice(1));
        selectedIndex = index;
      } catch (error) {
        return;
      }
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    }
  });

  let selectedIndex = -1;
  const anchorOffset = 0.4;
  const anchorSelectionDistance = 30;

  // Updates the index and the URL hash on scroll
  // TODO: to avoid flickering, favor the element in the MOVEMENT direction! i.e do not flicker back to previous element
  const onScroll = throttle(() => {
    const top = window.pageYOffset;
    for(let i = 0; i < entryElements.length; i++) {
      const element = entryElements[i];
      const distance = Math.abs(top - element.offsetTop);
      if(distance < anchorSelectionDistance && selectedIndex !== i) {
        selectedIndex = i;
        history.pushState(null, null, "#" + i);
        break;
      }
    }
  }, 5);
</script>

<svelte:window
  on:scroll={onScroll}
/>

<aside>
  <Timeline
    { timeline }
    { selectedIndex }
  />
</aside>
<main
  style="
    --anchorOffset: {100 * anchorOffset}vh;
  "
>
  <ol>
    { #each entries as entry, i (entry.metadata.datetime)}
    <li 
      bind:this={entryElements[i]}
      id="{"" + i}"
      class="offset"
    >
      <a 
        href="#{i}"
        draggable="false"
      >
        <Entry
          { entry }  
          selected={selectedIndex === i}
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

  .offset {
    margin-top: calc(var(--anchorOffset) * -1.0);
    padding-top: var(--anchorOffset);
  }

  ol {
    max-width: 700px;
    display: flex;
    flex-direction: column-reverse;
  }

  aside {
    display: flex;
    background-color: #ececec;

    position: fixed;
  }

  a:focus {
    outline: unset;
  }
</style>