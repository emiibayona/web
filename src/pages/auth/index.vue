<template>
    <div class="w-full flex flex-col items-center justify-center gap-4 mt-10">
        <span class="text-2xl font-semibold">
            {{ registerMode ? 'Regístrate' : 'Conéctate' }}!!!
        </span>

        <div v-if="!registerMode" class="flex flex-col items-center w-1/2 mt-4 mb-2">
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
                <div class="flex flex-row gap-2 items-center">
                    <Button class="active:animate-bounce" size="lg" @click="handleLogin" :loading="loading"
                        :disabled="fieldIsEmpty(loginForm.password) || fieldIsEmpty(loginForm.email)">Conectar</Button>
                    ó
                    <Button class="active:animate-bounce" size="lg" @click="registerMode = !registerMode"
                        :loading="loading">Registrarte</Button>
                </div>
            </form>

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
        <div v-else class="flex flex-col items-center w-1/2 mt-4 mb-2">
            <form @submit.prevent="" class="w-full flex flex-col items-center gap-4">
                <div class="w-full flex flex-col items-center">
                    <!-- <div class="w-1/2"> -->
                    <span> Nombre <span v-if="fieldIsEmpty(loginForm.name)"
                            class="font-bold text-xs text-red-600">(requerido)</span></span>
                    <InputField v-model="loginForm.name" @keyup.enter="" placeholder="Jace" type="text" />
                    <!-- </div> -->
                </div>
                <div class="w-full flex flex-col items-center">
                    <!-- <div class="w-1/2"> -->
                    <span> Apellido <span v-if="fieldIsEmpty(loginForm.lastname)"
                            class="font-bold text-xs text-red-600">(requerido)</span></span>
                    <InputField v-model="loginForm.lastname" @keyup.enter="" placeholder="Beleren" type="text" />
                    <!-- </div> -->
                </div>
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
                <div class="w-1/2">
                    <div class="bg-gt-dark-300 h-16 w-full flex flex-row items-center justify-center">
                        <input type="file" accept="image/*" id="imagepicker" />
                    </div>
                </div>
                <!-- </div> -->
                <div class="flex flex-row gap-2 items-center">
                    <Button class="active:animate-bounce" size="lg" @click="handleRegister" :loading="loading"
                        :disabled="fieldIsEmpty(loginForm.password) || fieldIsEmpty(loginForm.email) || fieldIsEmpty(loginForm.name) || fieldIsEmpty(loginForm.lastname)">Registrar</Button>

                </div>
            </form>
        </div>


    </div>
</template>
<script setup>
import Button from '@/components/atomic/Button.vue';
import InputField from '@/components/atomic/InputField.vue';
import Loader from '@/components/atomic/Loader.vue';
import { useAuth } from '@/composables/useAuth';
import useFile from '@/composables/useFile';
import { fieldIsEmpty } from '@/utils/utils';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const { loginWithGoogle, loginWithLocal, loading, updateLoading, register } = useAuth();
const { uploadImage } = useFile();

const route = useRoute();
const loginForm = ref({
    email: "",
    password: "",
    name: "",
    lastname: ""
});
const registerMode = ref(false);
const googleEnabled = computed(() => import.meta.env.VITE_GOOGLE_ENABLED)
const handleLogin = () => {
    try {
        loginWithLocal({ tenant: 'geartown', ...loginForm.value }, window.location.origin + (route?.redirectedFrom?.fullPath || '/'));
        if (googleEnabled.value) {
            loginWithGoogle('geartown', route?.query?.redirect || null);
        }
    } catch (err) {
        updateLoading(false);
        console.error(err);
    }
};
const handleRegister = async () => {
    try {
        const data = loginForm.value;

        const elem = document?.getElementById("imagepicker");
        const filesToUpload = elem?.files?.length;
        let imageUrl = null
        if (filesToUpload) {
            const form = new FormData();
            form.append("file", elem.files[0])
            imageUrl = await uploadImage(form);
        }

        await register({
            username: `${data.name} ${data.lastname}`,
            email: data.email,
            password_hash: data.password,
            password: data.password,
            type: "USER",
            tenant: "geartown",
            userInfo: {
                name: data.name,
                lastname: data.lastname,
                picture: imageUrl
            }
        })
    } catch (err) {
        updateLoading(false);
        console.error(err);
    }
}
</script>

<style lang="scss" scoped>
.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>