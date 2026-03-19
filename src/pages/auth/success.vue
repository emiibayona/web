<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Loader from '@/components/atomic/Loader.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const txt = ref("Procesando inicio de sesión...");

onMounted(async () => {
    if (Object.values(route.query).length) {

        const token = route.query.token;
        const redirect = route.query.redirect;

        setTimeout(async () => { txt.value = "Validado, redirigiendo..." }, 1000);
        setTimeout(async () => {
            if (token) {
                auth.setSession(token);
                await auth.fetchUser();
                window.location.href = redirect;
            } else {
                router.push('/login?error=no_token');
            }
        }, 3000);
    }
});
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-4 mt-10">
        <!-- <div class="w-full "> -->
        <span class="text-2xl font-semibold flex flex-row w-full justify-center gap-2">
            {{ txt }}
            <Loader />
        </span>
    </div>
</template>