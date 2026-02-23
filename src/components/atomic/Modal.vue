<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="modelValue" class="modal-overlay" @click.self="close">
                <div class="modal-content">
                    <header class="modal-header">
                        <h3 class="font-bold">{{ title }}</h3>
                        <button v-if="!closeDisabled" class="close-btn" @click="close">&times;</button>
                    </header>

                    <main class="modal-body">
                        <slot></slot>
                    </main>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    modelValue: Boolean,
    title: {
        type: String,
        default: 'Aviso'
    },
    closeDisabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

// Función interna para cerrar
const close = () => {
    if (props.closeDisabled) return;
    emit('update:modelValue', false);
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
}

.modal-content {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    min-width: 400px;
    max-width: 90%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
}

.modal-header h3 {
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
}

/* Animación suave */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>