<template>
    <div class="flex items-center w-full max-w-md bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
        <textarea :placeholder="placeholder" :value="modelValue" @input="onInput"
            class="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent resize-none"
            :aria-label="placeholder" :disabled="disabled" v-bind="$attrs" />
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    debounce: { type: Number, default: 750 },
    placeholder: { type: [String, Number], default: 'Enter text...' },
    ariaLabel: { type: String, default: 'Textarea input' },
    disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const timer = ref(null)

function scheduleSubmit(value) {
    if (timer.value) clearTimeout(timer.value)
    timer.value = setTimeout(() => {
        emit('submit', value)
        timer.value = null
    }, props.debounce)
}

function onInput(event) {
    const value = event.target.value
    emit('update:modelValue', value)
    scheduleSubmit(value)
}

onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value)
})
</script>
