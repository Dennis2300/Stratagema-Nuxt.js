<template>
  <section class="bg-secondary">
    <l-trefoil
      size="40"
      stroke="4"
      stroke-length="0.15"
      bg-opacity="0.1"
      speed="1.4"
      color="black"
    ></l-trefoil>
    <h1>Stratagema</h1>
  </section>
</template>

<script setup>
import { trefoil } from "ldrs";
trefoil.register();
</script>
