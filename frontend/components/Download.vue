<template>
  <li>
    <a :href="download.pdfUrl" target="_blank">
      <h2>{{download.title.substr(0,1)}}</h2>
      <h3>{{download.title}}</h3>
    </a>
  </li>
</template>

<script>
export default {
  name: "Download",
  props: ["download"]
};
</script>

<style scoped>
</style>
