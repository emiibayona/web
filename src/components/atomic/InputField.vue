<template>
    <div class="flex items-center w-full max-w-md bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
        <svg class="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>

        <input :type="type" :placeholder="placeholder" :value="modelValue" @input="onInput"
            @keydown.enter.prevent="onEnter"
            class="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            :aria-label="ariaLabel" />
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: { type: String, default: '' },
    debounce: { type: Number, default: 750 },
    placeholder: { type: String, default: 'Search...' },
    type: { type: String, default: 'search' },
    ariaLabel: { type: String, default: 'Search input' }
})

const emit = defineEmits(['update:modelValue', 'search'])

const timer = ref(null)

function scheduleSearch(value) {
    if (timer.value) clearTimeout(timer.value)
    timer.value = setTimeout(() => {
        emit('search', value)
        timer.value = null
    }, props.debounce)
}

function onInput(event) {
    const value = event.target.value
    emit('update:modelValue', value)
    scheduleSearch(value)
}

function onEnter() {
    if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
    }
    emit('search', props.modelValue)
}

onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value)
})
</script>