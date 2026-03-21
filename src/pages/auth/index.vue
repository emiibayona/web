<template>
    <div class="w-full flex flex-col items-center justify-center gap-4">
        <div class="flip-container" :class="['hasDouble', { 'flip': registerMode, 'mobile': isMobile }]">
            <div class="card relative">
                <div class="front">
                    <div class="flex flex-col items-center w-1/2 mt-4 mb-2" :class="{ 'w-full': isMobile }">
                        <form @submit.prevent="handleLogin" class="w-full flex flex-col items-center gap-4"
                            @keydown.enter="handleLogin">
                            <div class="w-full flex justify-center">
                                <div class="w-[400px] flex flex-col items-start" :class="{ 'w-full': isMobile }">
                                    <span class="text-lg"> Email <span v-if="fieldIsEmpty(loginForm.email)"
                                            class="font-bold text-xs text-red-600">(requerido)</span></span>
                                    <InputField v-model="loginForm.email" @keyup.enter=""
                                        placeholder="k'rrik.son.of.yawgmoth@wotc.com" type="text" />
                                </div>
                            </div>
                            <div class="w-full flex justify-center">
                                <div class="w-[400px] flex flex-col items-start" :class="{ 'w-full': isMobile }">
                                    <span class="text-lg">
                                        Contraseña
                                        <span v-if="fieldIsEmpty(loginForm.password)"
                                            class="font-bold text-xs text-red-600">(requerido)</span>
                                    </span>
                                    <InputField v-model="loginForm.password" placeholder="********" type="password" />
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 items-center">
                                <Button size="lg" @click="handleLogin" @keyup.enter="handleLogin" :loading="loading"
                                    type="submit" :disabled="!canLogin">Conectar</Button>
                            </div>
                        </form>


                        <div v-if="googleEnabled">
                            <div class="min-w-[142px] active:scale-90 transition-all duration-300 ease-in-out p-2 rounded bg-gray-400 hover:bg-gray-500 hover:drop-shadow-lg cursor-pointer hover:scale-125 hover:text-white disabled"
                                @click="handleLogin">
                                <Loader v-if="loading" class="h-8" />
                                <div v-else class="flex flex-row items-center justify-center gap-2">
                                    <span>Con Google</span>
                                    <img src="/images/google.png" class="drop-shadow-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="back" :class="{ 'w-full': isMobile }">
                    <form @submit.prevent="handleRegister" @keydown.enter="handleRegister"
                        class="w-full flex flex-col items-center gap-4">
                        <div class="w-full flex justify-center">
                            <div class="w-[400px] flex flex-col items-start" :class="{ 'w-full': isMobile }">
                                <span class="text-lg">Nombre <span v-if="fieldIsEmpty(loginForm.name)"
                                        class="font-bold text-xs text-red-600">(requerido)</span></span>
                                <InputField v-model="loginForm.name" @keyup.enter="" placeholder="Jace" type="text" />
                            </div>
                        </div>
                        <div class="w-full flex justify-center">
                            <div class="w-[400px] flex flex-col items-start" :class="{ 'w-full': isMobile }">
                                <span class="text-lg">Apellido <span v-if="fieldIsEmpty(loginForm.lastname)"
                                        class="font-bold text-xs text-red-600">(requerido)</span></span>
                                <InputField v-model="loginForm.lastname" @keyup.enter="" placeholder="Beleren"
                                    type="text" />
                            </div>
                        </div>
                        <div class="w-full flex justify-center">
                            <div class="w-[400px] flex flex-col items-start" :class="{ 'w-full': isMobile }">
                                <span class="text-lg">Email <span v-if="fieldIsEmpty(loginForm.email)"
                                        class="font-bold text-xs text-red-600">(requerido)</span></span>
                                <InputField v-model="loginForm.email" @keyup.enter=""
                                    placeholder="k'rrik.son.of.yawgmoth@wotc.com" type="text" />
                            </div>
                        </div>
                        <div class="w-full flex justify-center">
                            <div class="w-[400px] flex flex-col items-start" :class="{ 'w-full': isMobile }">
                                <span class="text-lg">
                                    Contraseña
                                    <span v-if="fieldIsEmpty(loginForm.password)"
                                        class="font-bold text-xs text-red-600">(requerido)</span>
                                </span>
                                <InputField v-model="loginForm.password" @keyup.enter="" placeholder="********"
                                    type="password" />
                            </div>
                        </div>
                        <div class="w-full flex justify-center">
                            <div class="w-[400px] flex flex-col items-start" :class="{ 'w-full': isMobile }">
                                <span class="text-lg">
                                    Logo
                                </span>
                                <div class="bg-gt-dark-300 h-16 w-full flex flex-row items-center justify-center">
                                    <input type="file" accept="image/*" id="imagepicker" />
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <Button color="#FF6F00" size="lg" @click="handleRegister" :loading="loading"
                                :disabled="!canRegister">Registrar</Button>

                        </div>
                    </form>
                </div>

            </div>
        </div>
        <Button @click="registerMode = !registerMode">{{ textFlip }}</Button>
    </div>

</template>
<script setup>
import Button from '@/components/atomic/Button.vue';
import InputField from '@/components/atomic/InputField.vue';
import Loader from '@/components/atomic/Loader.vue';
import { useAuth } from '@/composables/useAuth';
import useDevices from '@/composables/useDevices';
import useFile from '@/composables/useFile';
import { fieldIsEmpty } from '@/utils/utils';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const { loginWithGoogle, loginWithLocal, loading, updateLoading, register } = useAuth();
const { uploadImage } = useFile();
const { isMobile } = useDevices();

const route = useRoute();
const loginForm = ref({
    email: "",
    password: "",
    name: "",
    lastname: ""
});
const registerMode = ref(false);
const textFlip = computed(() => `${!registerMode.value ? 'Puedes registrarte aquí' : '¿Tienes una cuenta? Conéctate'}`)
const googleEnabled = computed(() => !import.meta.env.VITE_GOOGLE_ENABLED)
const canLogin = computed(() => !fieldIsEmpty(loginForm.value.password) && !fieldIsEmpty(loginForm.value.email))
const canRegister = computed(() =>
    !fieldIsEmpty(loginForm.value.password) &&
    !fieldIsEmpty(loginForm.value.email) &&
    !fieldIsEmpty(loginForm.value.name) &&
    !fieldIsEmpty(loginForm.value.lastname)
)
const handleLogin = () => {
    if (!registerMode.value && canLogin.value) {
        try {
            loginWithLocal({ tenant: 'geartown', ...loginForm.value }, window.location.origin + (route?.redirectedFrom?.fullPath || '/'));
            if (googleEnabled.value) {
                loginWithGoogle('geartown', route?.query?.redirect || null);
            }
        } catch (err) {
            updateLoading(false);
            console.error(err);
        }
    }
};
const handleRegister = async () => {
    if (registerMode.value && canRegister.value) {
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
}
</script>

<style lang="scss" scoped>
.disabled {
    opacity: 0.5;
    pointer-events: none;
}

button:active {
    will-change: transform;
    transition: all 0.7s;
    transform: scale(1.2);
}

.flip-container {
    background-color: transparent;
    perspective: 1000px;
    position: relative;
    @include flex(column, flex-start, center);
    transition: all 0.7s;

    height: 50vh;
    width: 100%;

    &.flip {
        height: 65vh;

        .card {
            transform: rotateX(180deg);

            @include breakpoint(nm) {
                transform: rotateX(180deg);
            }

        }
    }
}

.card {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: all 0.7s;
    transform-style: preserve-3d;

    perspective: 1000px;

    @include breakpoint(nm) {
        @include flex(row, flex-start, flex-start);
    }

}

.front,
.back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back {
    transform: rotateX(180deg);
}
</style>