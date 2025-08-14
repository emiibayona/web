<template>
  <div class="p-6 relative bg-zinc-100 rounded text-darkGrayishBlue max-w-md">
    <div
      class="rounded-full absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 w-24"
    >
      <slot name="img"></slot>
    </div>
    <div class="mt-16">
      <h3 class="text-md text-black font-bold text-center">
        <slot name="name"></slot>
      </h3>
      <p>
        <slot name="quote"></slot>
      </p>
    </div>
  </div>
</template>
