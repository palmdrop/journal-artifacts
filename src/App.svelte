<script lang="ts">
  import { onMount } from 'svelte';
  import throttle from 'lodash.throttle';
  import Entry from './components/entry/Entry.svelte';
  import { getData, type Day, type EntryData } from './data/get-data';
    
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
  const animationScrollSpeed = 0.00000002;
  const animationTimeSpeed = 0.07;
  const minTimeDelta = 0.001;

  const getTimeFromIndex = (index: number) => {
    if(index < 0 || index >= entries.length) return 0;
    return new Date(
      entries[index].metadata.datetime
    ).getTime() * animationScrollSpeed;
  }

  // Initial time
  let time = -1;

  // The time goal is reactive, and depends on the current selected entry
  $: timeGoal = getTimeFromIndex(selectedIndex);

  // Used to determine if the goal has changed
  let previousTimeGoal = timeGoal;

  let fetchStatus: 'idle'  | 'pending' | 'successful' | 'failed' = 'idle';
  onMount(() => {
    // Fetches page data
    // pagination will be necessary as data grows!
    fetchStatus = 'pending';
    getData()
      .then(data => {
        entries = data.entries;
        timeline = data.timeline;
        fetchStatus = 'successful';
      })
      .then(() => {
        const index = Number(location.hash.slice(1));
        selectedIndex = index;
      })
      .catch(() => {
        selectedIndex = entries.length - 1;

        if(!entries) {
          fetchStatus = 'failed';
        }
      }).finally(() => {
        time = getTimeFromIndex(selectedIndex);
        timeGoal = time;
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
        // history.pushState(null, null, "#" + i);
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

<div class="app">
  <aside>
    <!--
    <Timeline
      { timeline }
      { selectedIndex }
    />
    -->
    { #if selectedIndex !== -1 }
      <time
        datetime="{entries[selectedIndex].metadata.datetime}"
      >{entries[selectedIndex].metadata.datetime.replace('T', ' ')}</time>
    { /if }
  </aside>
  <header>
    <h1>
      Journal artifacts
    </h1>
  </header>
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
    <span class="continued">***</span>
    { #if ['idle', 'pending'].includes(fetchStatus) }
      <span class="message">[Loading...]</span>
    { :else if fetchStatus === 'failed' }
      <span class="message">[Failed loading. Refresh to try again.]</span>
    { /if }
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
    <span class="continued">***</span>
  </main>
  <footer>
    <span>by:</span> 
    <a 
      href="https://palmdrop.site"
      target="_blank"
      rel="noreferrer noopener"
      draggable={false}
    >
      palmdrop
    </a>
    <span>font:</span>
    <a 
      href="https://velvetyne.fr/fonts/sligoil/"
      target="_blank"
      rel="noreferrer noopener"
      draggable={false}
    >
      Sligoil by Ariel Martín Pérez (Velvetyne Type Foundry)
    </a>
  </footer>
</div>

<style>
  :root {
    /*
    --bg: rgb(7, 15, 12);
    --fg: #e5eedc;
    --accent: #1cfb45;
    --highlight: #96edb9;
    */
    --bg: rgb(1, 1, 1);
    --fg: #cfd4cc;
    --accent: #35ef73;
    --highlight: #96edb9;

    --font-primary: Sligoil;
    --font-mono: Sligoil;

    --text-shadow: 
      0.06em 0.06em 0.08em var(--bg),
      -0.06em 0.06em 0.08em var(--bg),
      0.06em -0.06em 0.08em var(--bg),
      -0.06em -0.06em 0.08em var(--bg);
  }

  :global(em) {
    font-style: italic;
  }

  :global(strong) {
    font-weight: bold;
    text-transform: uppercase;
  }

  .app {
    font-family: var(--font-primary);
    font-size: clamp(0.75rem, 2vw, 1.35rem);
    font-weight: normal;

    background-color: var(--bg);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;

    background-color: var(--fg);
    color: var(--bg);
    width: 100%;

    padding: 0.3em;
    padding-left: 1em;
    box-shadow: 0px 0px 2em 2em var(--bg);
  }

  .continued {
    font-size: 3em;
    color: var(--fg);
    z-index: 2;

    padding: 2em 0em;

    text-shadow: var(--text-shadow);
  }

  .message {
    font-size: 2em;
    color: var(--fg);
    z-index: 2;

    text-shadow: var(--text-shadow);
  }

  h1 {
    font-size: 1.13em;
    text-align: left;
    font-style: normal;
  }

  main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding-top: calc(0.5 * var(--anchorOffset));
    padding-bottom: calc(0.5 * var(--anchorOffset));

    color: var(--fg);
    width: 100%;
    max-width: 1300px;
    min-height: 100vh;

    border-left: 1px solid var(--fg);
    border-right: 1px solid var(--fg);
  }

  .offset {
    margin-top: calc(var(--anchorOffset) * -1.0);
    padding-top: var(--anchorOffset);
  }

  ol {
    display: flex;
    flex-direction: column-reverse;

    z-index: 1;
  }

  aside {
    position: fixed;
    bottom: 0;
    right: 0;

    background-color: var(--fg);
    color: var(--bg);

    font-size: 1.13em;
    z-index: 4;
    text-align: right;

    box-shadow: 0px 0px 2em 2em var(--bg);

    width: 100%;
    padding: 0.3em;
    padding-right: 1em;

    font-family: var(--font-mono);
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

    min-width: calc(min(500px, 100vw - 2em));
    min-height: calc(min(1000px, 100vh));

    z-index: 0;
  }

  footer {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1em;

    width: 100%;
    padding-bottom: 5em;
    padding-top: 1em;
    padding-left: 1em;
    padding-right: 1em;
    color: var(--fg);

    z-index: 3;
    background-color: var(--bg);

    border-top: 1px solid var(--fg);
  }

  footer a {
    text-decoration: underline;
  }
</style>