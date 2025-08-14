<template>
  <footer class="bg-veryDarkBlue p-10 text-white">
    <div
      class="container mx-auto my-2 flex justify-between flex-col-reverse md:flex-row space-x-6 space-y-8"
    >
      <!-- Logo and social links container -->
      <div
        class="flex flex-col-reverse items-center space-y-12 space-y-reverse mt-12"
      >
        <div class="md:hidden">Copyright © 2022, All Rights Reserved</div>
        <!-- Logo -->
        <div>
          <img class="h-8" src="../assets/img/logo-white.svg" alt="" />
        </div>
        <!-- Social Links Container -->
        <div class="flex justify-center space-x-4">
          <!-- Link 1 -->
          <a href="#">
            <img class="w-8" src="../assets/img/icon-facebook.svg" alt="" />
          </a>
          <!-- Link 2 -->
          <a href="#">
            <img class="w-8" src="../assets/img/icon-youtube.svg" alt="" />
          </a>
          <!-- Link 3 -->
          <a href="#">
            <img class="w-8" src="../assets/img/icon-twitter.svg" alt="" />
          </a>
          <!-- Link 4 -->
          <a href="#">
            <img class="w-8" src="../assets/img/icon-pinterest.svg" alt="" />
          </a>
          <!-- Link 5 -->
          <a href="#">
            <img class="w-8" src="../assets/img/icon-instagram.svg" alt="" />
          </a>
        </div>
      </div>
      <!-- List Container -->
      <div class="flex flex-row space-x-10 justify-around">
        <ul>
          <li class="hover:text-brightRed text-lg">
            <a href="#">Home</a>
          </li>
          <li class="hover:text-brightRed text-lg">
            <a href="#">Pricing</a>
          </li>
          <li class="hover:text-brightRed text-lg">
            <a href="#">Products</a>
          </li>
          <li class="hover:text-brightRed text-lg">
            <a href="#">About</a>
          </li>
        </ul>
        <ul>
          <li class="hover:text-brightRed text-lg">
            <a href="#">Careers</a>
          </li>
          <li class="hover:text-brightRed text-lg">
            <a href="#">Community</a>
          </li>
          <li class="hover:text-brightRed text-lg">
            <a href="#">Privacy Policy</a>
          </li>
        </ul>
      </div>

      <!-- Input Container -->
      <div>
        <form>
          <div
            class="flex flex-col xs:flex-row justify-between md:justify-center items-center space-x-2 space-y-2 md:space-y-0"
          >
            <input
              type="text"
              class="rounded-full p-4 active:hover:border-darkBlue grow"
              placeholder="Updated in your inbox"
            />
            <MainButton class="shrink-0 w-fit bg-brightRed text-white"
              >Go</MainButton
            >
          </div>
        </form>
        <div class="hidden md:block mt-5">
          Copyright © 2022, All Rights Reserved
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
import MainButton from "../components/MainButton.vue";
</script>
