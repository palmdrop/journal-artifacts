<script lang="ts">
  import { onMount } from 'svelte';
  import throttle from 'lodash.throttle';
  import Entry from './components/entry/Entry.svelte';
  import Timeline from './components/timeline/Timeline.svelte';
  import { getDataLocalTest, type Day, type EntryData } from './data/get-data';
    
  import core from './assets/substrate/core-full.json';
  import ProgramRenderer from './modules/substrates/src/components/substrate/ProgramRenderer.svelte';
  import type { EncodedProgram } from './modules/substrates/src/stores/programStore';

  const program = core as unknown as EncodedProgram;

  let entries: EntryData[] = [];
  let timeline: Day[] = [];

  const entryElements: HTMLElement[] = Array<HTMLElement>(entries.length);

  let selectedIndex = -1;
  const anchorOffset = 0.4;
  const anchorSelectionDistance = 20;

  // For animation
  const animationScrollSpeed = 0.2;
  const animationTimeSpeed = 0.07;
  const minTimeDelta = 0.001;

  // Initial time
  let time = -1;

  // The time goal is reactive, and depends on the current selected entry
  $: timeGoal = selectedIndex * animationScrollSpeed;

  // Used to determine if the goal has changed
  let previousTimeGoal = timeGoal;

  onMount(() => {
    // Fetches page data
    // TODO: pagination will be necessary as data grows!
    getDataLocalTest()
      .then(data => {
        entries = data.entries;
        timeline = data.timeline;
      });

    try {
      const index = Number(location.hash.slice(1));
      selectedIndex = index;
    } catch (error) {
      selectedIndex = entries.length - 1;
    }

    time = selectedIndex * animationScrollSpeed;
    timeGoal = time;

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

  // Updates the index and the URL hash on scroll
  let previousTop = 0;
  const onScroll = throttle(() => {
    const top = window.pageYOffset;
    // true = down, false = up
    const direction = (top - previousTop) > 0;
    for(
      let i = (direction ? 0 : entryElements.length - 1); 
      (direction ? i < entryElements.length : i >= 0); 
      (direction ? i++ : i--)
    ) {
      const element = entryElements[i];
      const distance = Math.abs(top - element.offsetTop);
      if(distance < anchorSelectionDistance && selectedIndex !== i) {
        selectedIndex = i;
        history.pushState(null, null, "#" + i);
        break;
      }
    }

    previousTop = top;
  }, 5);


  const lerp = (a: number, b: number, t: number) => {
    return a * (1.0 - t) + b * t;
  }

  let animationFrame: number | undefined = undefined;
  $: {
    if(
      timeGoal !== previousTimeGoal && 
      selectedIndex !== -1
    ) {
      // console.log(timeGoal, previousTimeGoal, selectedIndex);
      if(typeof animationFrame === 'number') {
        cancelAnimationFrame(animationFrame);
      }

      const animate = () => {
        const previousTime = time;
        time = lerp(time, timeGoal, animationTimeSpeed);

        const timeDelta = Math.abs(time - previousTime);
        if(timeDelta < minTimeDelta) {
          cancelAnimationFrame(animationFrame);
          return;
        } 

        animationFrame = requestAnimationFrame(animate);
      }

      animationFrame = requestAnimationFrame(animate);

      previousTimeGoal = timeGoal;
    }

  }
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
  <div class="render-core">
    <ProgramRenderer 
      programData={program}
      animate={true}
      uniformOverrides={{
        time,
        timeScale: 0.0
      }}
    />
  </div>
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
  :root {
    --bg: rgb(7, 15, 12);
    --fg: #e5eedc;
    --accent: #1cfb45;
    --highlight: #96edb9;

    --font-primary: monospace;
    --font-mono: monospace;
  }

  main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: var(--bg);

    padding-top: var(--anchorOffset);
    padding-bottom: calc(91vh - var(--anchorOffset));

    color: var(--fg);

    font-family: var(--font-primary);
  }

  .offset {
    margin-top: calc(var(--anchorOffset) * -1.0);
    padding-top: var(--anchorOffset);
  }

  ol {
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
    max-width: 1000px;

    z-index: 1;
  }

  aside {
    display: flex;
    background-color: var(--bg);

    position: fixed;
    bottom: 0;
    left: 0;

    z-index: 100;
    box-shadow: 0px 0px 50px 50px var(--bg);
  }

  a:focus {
    outline: unset;
  }

  .render-core {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    height: 80vh;
    width: 40vh;

    z-index: 0;
  }

  :global(em) {
    font-style: italic;
  }
</style>