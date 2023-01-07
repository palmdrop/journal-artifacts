<script lang="ts">
  import type { EntryData } from "../../data/get-data";

  export let entry: EntryData;
</script>

<section>
  <h1>
    { entry.datetime }
  </h1>
  <p><i>
    { entry.content }
  </i></p>
  <div>
    <p>
      { entry.note }
    </p>
  </div>
</section>

<style>

</style>