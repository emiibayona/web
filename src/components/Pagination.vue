<!-- <template>
    <div v-if="total.length > 1" class="pagination" :class="{ loading }">
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            < </button>

                <span v-for="(page, index) in total" :key="index + page">
                    <button :class="{ active: currentPage === page }" @click="goToPage(page)">
                        {{ page }}
                    </button>
                </span>

                <button :disabled="currentPage === total" @click="goToPage(currentPage + 1)">
                    >
                </button>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
const emits = defineEmits(["page-changed"]);
const props = defineProps({
    page: { type: Number, default: 1 },
    total: { type: Number, default: 0 },
    limit: { type: Number, default: 5 },
    loading: { type: Boolean, default: false }
});
const currentPage = ref(1);
const total = computed(() => {
    const limitPage = 3;
    const total = Math.ceil(props.total / props.limit);
    const res = [1]
    if (currentPage.value > 3) {
        res.push("...")
    }

    // array.forEach(element => {
    const arr = [0, 1, 2, 3];
    // });
    arr.forEach(x => res.push(x + 2));
    // currentPage.value + 3
    res.push("...");
    res.push(total)
    return res;
});

const goToPage = (page) => {
    if (props.loading) return;
    if (page < 1 || page > total.value) return;
    currentPage.value = page;
    emits("page-changed", {
        page: currentPage.value,
        offset: (page - 1) * props.limit,
        limit: props.limit,
    });
};
</script>

<style lang="scss" scoped>
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;

    &.loading {
        cursor: not-allowed;
    }
}

button {
    width: 30px;
    padding: 5px;
}

button.active {
    font-weight: bold;
    background-color: #FFA000;
    color: white;
    border-radius: 4px;
}

button:hover {
    font-weight: bold;

    &:disabled {
        font-weight: normal;
    }
}
</style> -->

<template>
    <nav v-if="total > limit" class="flex items-center justify-center space-x-2 py-10 z-[200]">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2D2D2D] text-white transition-colors hover:bg-[#3D3D3D] disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <template v-for="(page, index) in displayedPages" :key="index">
            <span v-if="page === '...'" class="px-2 text-white">...</span>

            <button v-else @click="changePage(page)" :class="[
                'h-10 w-10 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                    ? 'bg-[#1A1A1A] text-white border border-gray-600'
                    : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
            ]">
                {{ page }}
            </button>
        </template>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === total"
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2D2D2D] text-white transition-colors hover:bg-[#3D3D3D] disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: { type: Number, required: true },
    total: { type: Number, required: true },
    limit: { type: Number, default: 5 },
    siblingCount: { type: Number, default: 1 }, // How many pages to show around current
    loading: { type: Boolean, default: false }
});

const emit = defineEmits(['update:currentPage']);

const changePage = (page) => {
    if (props.loading) return;
    if (page >= 1 && page <= props.total) {
        emit('update:currentPage', page);
        // emit('page-changed', {
        //     page,
        //     offset: (page - 1) * props.limit,
        //     limit: props.limit,
        // })
    }
};

const displayedPages = computed(() => {
    const total = Math.ceil(props.total / props.limit);
    const current = props.currentPage;
    const sibling = props.siblingCount;

    // If total pages are small, show all of them
    if (total <= 5 + sibling * 2) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(current - sibling, 1);
    const rightSiblingIndex = Math.min(current + sibling, total);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < total - 1;

    if (!showLeftDots && showRightDots) {
        let leftItemCount = 3 + 2 * sibling;
        let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        return [...leftRange, "...", total];
    }

    if (showLeftDots && !showRightDots) {
        let rightItemCount = 3 + 2 * sibling;
        let rightRange = Array.from({ length: rightItemCount }, (_, i) => total - rightItemCount + i + 1);
        return [1, "...", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
        let middleRange = Array.from(
            { length: rightSiblingIndex - leftSiblingIndex + 1 },
            (_, i) => leftSiblingIndex + i
        );
        return [1, "...", ...middleRange, "...", total];
    }
});
</script>