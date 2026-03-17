<script setup>
import { useAuth } from '@/composables/useAuth';

const { loginWithGoogle } = useAuth();

const handleLogin = () => {
    // Aquí pasas el slug del tenant actual (ej. 'geartown')
    loginWithGoogle('geartown');
};
</script>

<template>
    <button @click="handleLogin">Entrar con Google</button>
</template>