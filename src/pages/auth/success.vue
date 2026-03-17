<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const router = useRouter();
const auth = useAuth();

onMounted(async () => {
    const token = route.query.token;
    if (token) {
        auth.setSession(token);
        await auth.fetchProfile(); // Cargamos los datos del usuario inmediatamente
        router.push('/'); 
    } else {
        router.push('/login?error=no_token');
    }
});
</script>

<template>
    <div>Procesando inicio de sesión...</div>
</template>