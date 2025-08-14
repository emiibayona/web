<template>
  <div class="my-6">
    <!-- Header -->
    <div
      class="flex items-center md:items-start bg-brightRedSupLight font-bold text-gray-800 md:text-black md:bg-white rounded-s-full md:max-w-1/2 min-w-fit"
    >
      <div class="flex md:block rounded-full text-white bg-brightRed py-2 px-4">
        <slot name="badge"></slot>
      </div>
      <div class="ml-3 md:flex md:flex-col">
        <h3 class="min-w-fit text-xl"><slot name="header"></slot></h3>
        <p class="hidden md:block text-darkGrayishBlue mt-4">
          <slot name="body"></slot>
        </p>
      </div>
    </div>
    <!-- body -->
    <p class="md:hidden text-darkGrayishBlue max-w-prose mx-2">
      <slot name="body"></slot>
    </p>
  </div>
</template>
