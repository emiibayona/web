<template>

    <!-- <button @click="showModal = true">Abrir Modal</button> -->
    <Modal v-model="showModal" title="PANEL DE ADMIN" close-disabled>
        <p class="mb-1">Coloca la contraseña para acceder</p>
        <!-- <form> -->
        <form @submit.prevent="">
            <InputField v-model="password" @input="login" placeholder="Ingrese la contraseña" type="password"
                only-enter />
            <div class="flex flex-row justify-between mt-2">
                <Button @click="goHome" size="xsmall" :disabled="loading">Volver inicio</button>
                <Button @click.stop="login" size="xsmall" :disabled="passwordIsEmpty || loading">Confirmar</button>
            </div>
        </form>
    </Modal>

</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import Modal from '@/components/atomic/Modal.vue';
import Button from '@/components/atomic/Button.vue';
import InputField from '@/components/atomic/InputField.vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import useUser from '@/composables/useUser';

const { adminUser,
    checkAdminPassword,
    setAdmin,
    adminIsLoggedIn, } = useUser();
const router = useRouter();
const toast = useToast();
const showModal = ref(false);
const loading = ref(false);
const password = ref(null);
const logInfo = ref(null);
const passwordIsEmpty = computed(() => password.value === null || password.value === '')
const emit = defineEmits(['post-login']);

async function login() {
    loading.value = true;
    setTimeout(async () => {
        if (passwordIsEmpty.value) return;
        if (checkAdminPassword(password.value)) {
            toast.removeAllGroups();
            toast.add({
                severity: "success",
                summary: "Contraseña exitosa",
                detail: "...redirigiendo",
                life: 1800,
            })
            setTimeout(() => {
                showModal.value = false;
                loading.value = false;
                logInfo.value = { logged: true, time: new Date() };
                setAdmin(logInfo.value);
                emit('post-login')
                localStorage.setItem("admin-browser", true)
            }, 2000);
        } else {
            toast.removeAllGroups();
            toast.add({
                severity: "error",
                summary: "Contraseña erronea",
                detail: "...vuelva a intentarlo",
                life: 2000,
            })
            password.value = null;
            loading.value = false;
        }
    }, 250);
}
function goHome() {
    router.push("/");
}

function initModal() {
    if (!adminIsLoggedIn.value) {
        setTimeout(() => {
            showModal.value = true;
        }, 1000);
    } else {
        emit('post-login')
    }
}

watch(adminIsLoggedIn, () => {
    initModal();
})
onMounted(() => {
    initModal();
});
</script>

<style lang="scss" scoped></style>