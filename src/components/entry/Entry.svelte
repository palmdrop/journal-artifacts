<script lang="ts">
  import type { EntryData } from "../../data/get-data";

  export let entry: EntryData;
</script>

<section>
  <time class="datetime" datetime="{entry.datetime}" title="{entry.formattedDate}">
    <span class="year"       >{ entry.year                  }</span>
    <span class="month-day"  >{ entry.month }{ entry.day    }</span>
    <span class="hour-minute">{ entry.hour  }{ entry.minute }</span>
  </time>
  <div class="content">
    <p>
      <i>
      { entry.content }
      </i>
    </p>
  </div>
  <div class="note">
    <p>
      { entry.note }
    </p>
  </div>
</section>

<style>
  section {
    display: flex;
    justify-content: space-between;
  }

  section > * {
    flex-grow: 1;
    flex-basis: 0;
  }

  .datetime {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid white;
  }

  .datetime > span {
    background-color: black;
    color: white;
  }

  .content {
    border-bottom: 1px solid black;
    text-transform: lowercase;
  }

  .note {
    text-align: right;
    border-bottom: 1px solid black;
  }
</style>