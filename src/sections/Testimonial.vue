<template>
  <section class="my-10 flex flex-col justify-center">
    <h2 class="font-bold text-center text-4xl my-4">
      What's Different About Manage?
    </h2>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-x-4 gap-y-16 md:flex-row mt-16"
    >
      <Card>
        <template #img
          ><img class="" src="../assets/img/avatar-anisha.png" alt="anisha"
        /></template>
        <template #name> Anisha Li </template>
        <template #quote
          >“Manage has supercharged our team’s workflow. The ability to maintain
          visibility on larger milestones at all times keeps everyone
          motivated.”
        </template>
      </Card>

      <Card>
        <template #img
          ><img class="" src="../assets/img/avatar-ali.png" alt="ali"
        /></template>
        <template #name> Ali Bravo </template>
        <template #quote
          >“We have been able to cancel so many other subscriptions since using
          Manage. There is no more cross-channel confusion and everyone is much
          more focused.”
        </template>
      </Card>

      <Card>
        <template #img>
          <img class="" src="../assets/img/avatar-richard.png" alt="richard" />
        </template>
        <template #name> Richard Watts </template>
        <template #quote
          >“Manage has supercharged our team’s workflow. The ability to maintain
          visibility on larger milestones at all times keeps everyone
          motivated.”
        </template>
      </Card>
    </div>
    <MainButton class="my-8 mx-auto w-fit bg-brightRed text-white"
      >Get Started</MainButton
    >
  </section>
</template>
<script setup>
import Card from "../components/Card.vue";
import MainButton from "../components/MainButton.vue";
</script>
