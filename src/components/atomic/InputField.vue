<template>
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
            :aria-label="ariaLabel" ref="inputRef" v-bind="$attrs" />
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    debounce: { type: Number, default: 750 },
    placeholder: { type: [String, Number], default: 'Search...' },
    type: { type: String, default: "search" },
    ariaLabel: { type: String, default: 'Search input' },
    disabled: { type: Boolean, default: false },
    onlyEnter: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', "input"])

const timer = ref(null);
const inputRef = ref(null);

const typesToIgnoreOnOnlyEnter = ['deleteContentBackward', "deleteContentForward", 'insertText', undefined];

function scheduleSearch(value, type) {
    if (props.onlyEnter && typesToIgnoreOnOnlyEnter.includes(type)) return;
    if (timer.value) clearTimeout(timer.value)
    timer.value = setTimeout(() => {
        emit("input", value)
        timer.value = null
    }, props.debounce)
}

function onInput(event) {
    const value = event.target.value
    emit('update:modelValue', props.type === 'number' ? parseInt(value) : value)
    scheduleSearch(value, event.inputType)
}

function onEnter() {
    if (!props.onlyEnter) return;
    if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
    }
    emit("input", props.modelValue)
}

onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value)
})

defineExpose({
    inputElement: inputRef
});
</script>