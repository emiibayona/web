<script setup>
import Loader from '@/components/atomic/Loader.vue';
import { useAuth } from '@/composables/useAuth';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const { loginWithGoogle } = useAuth();
const loading = ref(false);
const route = useRoute();
const handleLogin = () => {
    loading.value = true;
    loginWithGoogle('geartown', route?.query?.redirect || null);

};
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-4 mt-10">
        <span class="text-2xl font-semibold">
            Para entrar a esa seccion, debes conectarte.
        </span>

        <div class="min-w-[142px] active:scale-90 transition-all duration-300 ease-in-out p-2 rounded bg-gray-400 hover:bg-gray-500 hover:drop-shadow-lg cursor-pointer hover:scale-125 hover:text-white"
            @click="handleLogin">
            <Loader v-if="loading" class="h-8" />
            <div v-else class="flex flex-row items-center justify-center gap-2">
                <span>Con Google</span>
                <img src="/images/google.png" class="drop-shadow-lg" />
            </div>
        </div>
    </div>
</template>