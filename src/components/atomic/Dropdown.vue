<template>
    <div class="dropdown" ref="root">
        <button class="toggle" @click="open = !open">
            {{ selectedLabel }}
            <span class="caret">▾</span>
        </button>

        <div v-if="open" class="menu">
            <template v-if="grouped">
                <div v-for="(group, gi) in normItems" :key="gi" class="group">
                    <div v-for="it in group" :key="it.value" class="item" @click="select(it)">{{ it.label }}</div>
                    <hr v-if="gi < normItems.length - 1" />
                </div>
            </template>

            <template v-else>
                <div v-for="it in normItems" :key="it.value" class="item" @click="select(it)">{{ it.label }}</div>
            </template>
        </div>
    </div>
</template>

<script setup>
import useClickOutside from '@/composables/useClickOutside';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: [String, Number, Object],
    items: { type: Array, default: () => [] },
    grouped: Boolean,
    placeholder: { type: String, default: 'Select' }
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false);
const { setListener } = useClickOutside({ templateRef: "root", target: open, clicked: false });
const normalize = v => (typeof v === 'string' || typeof v === 'number') ? { label: String(v), value: v } : v

const normItems = computed(() => {
    if (props.grouped && props.items.every(x => Array.isArray(x))) return props.items.map(g => (g || []).map(normalize))
    return (props.items || []).map(normalize)
})

const flat = computed(() => (props.grouped ? normItems.value.flat() : normItems.value))

const selected = computed(() => flat.value.find(i => i.value === props.modelValue))
const selectedLabel = computed(() => selected.value?.label || props.placeholder)

function select(it) {
    emit('update:modelValue', it.value)
    open.value = false
}


onMounted(() => setListener())
onBeforeUnmount(() => setListener())
</script>

<style scoped lang="scss">
:root {
    --gt-navy: #0b2340;
    --gt-orange: #ff7a18;
    --gt-muted: #f3f4f6;
    --gt-border: #e6e9ef;
    --gt-text: #102a43;
}

.dropdown {
    position: relative;
    display: inline-block;
    font-family: Inter, system-ui, Arial;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    background: #FFEDB8;
}

.toggle {
    background: linear-gradient(180deg, var(--gt-muted), #fff);
    color: var(--gt-text);
    border: 1px solid var(--gt-border);
    padding: 8px 12px;
    min-width: 140px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    width: 100%;

    :hover {
        border-radius: 6px;
    }
}

.caret {
    margin-left: 8px;
    opacity: 0.7;
}

.menu {
    position: absolute;
    margin-top: 6px;
    background: white;
    border: 1px solid var(--gt-border);
    box-shadow: 0 6px 18px rgba(11, 35, 64, 0.12);
    border-radius: 8px;
    min-width: 180px;
    z-index: 20;
    overflow: hidden;
    width: 100%;
}

.item {
    padding: 8px 12px;
    cursor: pointer;
    color: var(--gt-text);
}

.item:hover {
    background: linear-gradient(90deg, rgba(255, 122, 24, 0.06), rgba(11, 35, 64, 0.02));
    color: var(--gt-navy);
}

.group+hr,
hr {
    border: 0;
    height: 1px;
    background: var(--gt-border);
    margin: 6px 0;
}
</style>