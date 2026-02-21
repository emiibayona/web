<template>
    <div class="flex items-center w-full max-w-md bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
        <textarea :placeholder="placeholder" :value="modelValue" @input="onInput"
            class="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent resize-none"
            :aria-label="ariaLabel" :disabled="disabled" v-bind="$attrs" />
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
<!-- <template>
    <div class="flex items-center w-full max-w-md bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
        <svg v-if="type === 'search'" class="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none"
            aria-hidden="true">
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>

        <input :type="type" :placeholder="placeholder" :value="modelValue" @input="onInput"
            @keydown.enter.prevent="onEnter"
            class="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            :aria-label="ariaLabel" v-bind="$attrs" />
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    debounce: { type: Number, default: 750 },
    placeholder: { type: [String, Number], default: 'Search...' },
    type: { type: String, default: 'search' },
    ariaLabel: { type: String, default: 'Search input' },
    disabled: { type: Boolean, default: false }
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
</script> -->
