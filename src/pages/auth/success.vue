<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Loader from '@/components/atomic/Loader.vue';
import useDevices from '@/composables/useDevices';

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const txt = ref("Procesando inicio de sesión...");
const { isMobile } = useDevices();

onMounted(async () => {
    if (Object.values(route.query).length) {
        auth.updateLoading(true);
        const token = route.query.token;
        const timestamp = route.query.timestamp;
        const redirect = route.query.redirect;

        setTimeout(async () => { txt.value = "Validado, redirigiendo..." }, 1000);
        setTimeout(async () => {
            if (token) {
                auth.setSession({ token, timestamp });
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
        <span class="text-2xl font-semibold flex flex-row w-full justify-center gap-2" :class="{ 'text-sm': isMobile }">
            {{ txt }}
            <Loader />
        </span>
    </div>
</template>