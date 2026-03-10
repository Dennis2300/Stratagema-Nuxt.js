<template>
  <div class="markdown-text" v-html="renderedMarkdown" />
</template>

<script setup>
import { marked } from "marked";
import { computed } from "vue";

const props = defineProps({
  content: String,
});

const renderedMarkdown = computed(() => marked(props.content));
</script>

<style>
.markdown-text {
  line-height: 1.6;
}
.markdown-text p {
  margin-bottom: 1.2em;
}
</style>
