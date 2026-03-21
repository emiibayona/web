<template>
    <div class="w-full flex flex-col items-center justify-center gap-4">
        <div class="flip-container" :class="['hasDouble', { 'flip': registerMode }]">
            <div class="card relative">
                <div class="front">
                    <div class="flex flex-col items-center w-1/2 mt-4 mb-2">
                        <form class="w-full flex flex-col items-center gap-4">
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
                                    <InputField v-model="loginForm.password" @keyup.enter="" placeholder="********"
                                        type="password" />
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 items-center">
                                <Button class="active:animate-bounce" size="md" @click="handleLogin" :loading="loading"
                                    :disabled="fieldIsEmpty(loginForm.password) || fieldIsEmpty(loginForm.email)">Conectar</Button>
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
                <div class="back">
                    <form @submit.prevent="" class="w-full flex flex-col items-center gap-4">
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
                            <Button class="active:animate-bounce" color="#FF6F00" size="md" @click="handleRegister"
                                :loading="loading"
                                :disabled="fieldIsEmpty(loginForm.password) || fieldIsEmpty(loginForm.email) || fieldIsEmpty(loginForm.name) || fieldIsEmpty(loginForm.lastname)">Registrar</Button>

                        </div>
                    </form>
                </div>

            </div>
        </div>
        <Button @click="registerMode = !registerMode" class="active:animate-bounce">{{ textFlip }}</Button>
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

.flip-container {
    background-color: transparent;
    perspective: 1000px;
    position: relative;
    @include flex(column, flex-start, center);

    height: 50vh;
    width: 100%;

    &.flip {
        height: 70vh;

        .card {
            transform: rotateY(180deg);

            @include breakpoint(nm) {
                transform: rotateY(180deg);
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
    // aspect-ratio: 23 / 32;

    @include breakpoint(nm) {
        @include flex(row, flex-start, flex-start);
        // pointer-events: none;
    }

}

// .flip-container {


//     // &:not(.hasDouble):hover {
//     .card {
//         // &.in-shop {
//         //     transform: rotateY(0) translateY(-30px);

//         //     @include breakpoint(nm) {
//         //         transform: rotateY(0);
//         //     }
//         // }

//         // &:not(.in-shop) {
//         //     transform: rotateY(0);
//         // }
//     }

//     // }

//     &:hover {
//         // .card {
//         //     box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.5);
//         //     border-radius: 10px;
//         // }

//         // .shop {
//         //     opacity: 1;
//         //     bottom: -45px;

//         //     @include breakpoint(nm) {
//         //         bottom: 0px;
//         //     }
//         // }

//     }

//     &.active {
//         &.hasDouble:hover {
//             .card {
//                 &.in-shop {
//                     transform: rotateY(180deg) translateY(-30px);

//                     @include breakpoint(nm) {
//                         transform: rotateY(180deg);
//                     }
//                 }

//                 &:not(.in-shop) {
//                     transform: rotateY(180deg);

//                 }

//                 .quantity {
//                     transform: rotateY(-180deg);
//                     left: 30px;
//                 }
//             }
//         }
//     }
// }

.front,
.back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    // font-size: 5rem;
    // border-radius: 24px;
}

.back {
    transform: rotateY(180deg);
}
</style>