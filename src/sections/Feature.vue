<template>
  <section class="flex flex-col md:items-baseline md:flex-row space-y-8 my-10">
    <div class="flex flex-col space-y-8 items-center md:items-start md:w-1/2">
      <div class="mx-4 md:mx-0">
        <h2
          class="font-bold text-3xl text-center md:text-4xl md:text-start my-6"
        >
          What's different about Manage?
        </h2>
        <p class="text-darkGrayishBlue max-w-prose mx-6 md:mx-0">
          Manage provides all the functionality your team needs, without the
          complexity. Our software is tailor-made for modern digital product
          teams.
        </p>
      </div>
    </div>
    <ol class="md:w-1/2">
      <li>
        <ListItem>
          <template #badge>01</template>
          <template #header>Track company-wide progress </template>
          <template #body
            >See how your day-to-day tasks fit into the wider vision. Go from
            tracking progress at the milestone level all the way down to the
            smallest of details. Never lose sight of the bigger picture again.
          </template>
        </ListItem>
      </li>
      <li>
        <ListItem>
          <template #badge>01</template>
          <template #header>Track company-wide progress </template>
          <template #body
            >See how your day-to-day tasks fit into the wider vision. Go from
            tracking progress at the milestone level all the way down to the
            smallest of details. Never lose sight of the bigger picture again.
          </template>
        </ListItem>
      </li>
      <li>
        <ListItem>
          <template #badge>01</template>
          <template #header>Track company-wide progress </template>
          <template #body
            >See how your day-to-day tasks fit into the wider vision. Go from
            tracking progress at the milestone level all the way down to the
            smallest of details. Never lose sight of the bigger picture again.
          </template>
        </ListItem>
      </li>
    </ol>
  </section>
</template>
<script setup>
import ListItem from "../components/ListItem.vue";
</script>
