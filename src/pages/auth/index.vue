<template>
    <div class="w-full flex flex-col items-center justify-center gap-4 mt-10">
        <span class="text-2xl font-semibold">
            Conéctate!!
        </span>

        <div class="flex flex-col items-center w-1/2 mt-4 mb-2">
            <span class="font-bold text-lg">
                Con tu email
            </span>
            <form @submit.prevent="" class="w-full flex flex-col items-center gap-4">
                <div class="w-full flex flex-col items-center">
                    <!-- <div class="w-1/2"> -->
                    <span> Email <span v-if="fieldIsEmpty(loginForm.email)"
                            class="font-bold text-xs text-red-600">(requerido)</span></span>
                    <InputField v-model="loginForm.email" @keyup.enter="" placeholder="k'rrik.son.of.yawgmoth@wotc.com"
                        type="text" />
                    <!-- </div> -->
                </div>
                <div class="w-full flex flex-col items-center">
                    <!-- <div class="w-1/2"> -->
                    <span>
                        Contraseña
                        <span v-if="fieldIsEmpty(loginForm.password)"
                            class="font-bold text-xs text-red-600">(requerido)</span>
                    </span>
                    <InputField v-model="loginForm.password" @keyup.enter="" placeholder="********" type="password" />
                </div>
                <!-- </div> -->
                <Button class="active:animate-bounce" size="lg" @click="handleLogin" :loading="loading"
                    :disabled="fieldIsEmpty(loginForm.password) || fieldIsEmpty(loginForm.email)">Conectar</Button>
            </form>
        </div>

        <span class="font-bold text-base mt-4">
            ó con...
        </span>
        <div class="min-w-[142px] active:scale-90 transition-all duration-300 ease-in-out p-2 rounded bg-gray-400 hover:bg-gray-500 hover:drop-shadow-lg cursor-pointer hover:scale-125 hover:text-white disabled"
            @click="handleLogin">
            <Loader v-if="loading" class="h-8" />
            <div v-else class="flex flex-row items-center justify-center gap-2">
                <span>Con Google</span>
                <img src="/images/google.png" class="drop-shadow-lg" />
            </div>
        </div>
    </div>
</template>
<script setup>
import Button from '@/components/atomic/Button.vue';
import InputField from '@/components/atomic/InputField.vue';
import Loader from '@/components/atomic/Loader.vue';
import { useAuth } from '@/composables/useAuth';
import { fieldIsEmpty } from '@/utils/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const { loginWithGoogle, loginWithLocal, loading, updateLoading } = useAuth();

const route = useRoute();
const loginForm = ref({
    email: "",
    password: ""
});
const handleLogin = () => {
    try {
        loginWithLocal({ tenant: 'geartown', ...loginForm.value }, window.location.origin + (route?.redirectedFrom?.fullPath || '/'));
        // loginWithGoogle('geartown', route?.query?.redirect || null);
    } catch (err) {
        updateLoading(false);
        console.error(err)
    }
};
</script>