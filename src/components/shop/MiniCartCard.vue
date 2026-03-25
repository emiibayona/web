<template>
    <li
        class="bg-gt-yellow-100 bg-opacity-50 shadow rounded-lg px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="flex  gap-2 truncate" :class="{ 'flex-row': !item?.sets, 'flex-col': item?.sets }">
            <span class="font-medium truncate" :class="{ 'w-full': !item?.sets, }"><span v-if="!item?.sets"
                    class="font-bold">{{ `(${item.qty}) `
                    }}</span>{{
                        itemName }}
                <img v-if="!item?.sets" :src="item.image" class="h-[100px] w-fit" />

            </span>
            <div v-if="!item.sets" class="flex items-end justify-end justify-self-end gap-2 ml-2"
                :class="{ 'disabled': loading }">
                <div class="flex items-start justify-between">
                    <!-- EDIT MODE -->
                    <div v-if="edit && !fromWishlist" class="flex items-center space-x-2">
                        <div class="flex flex-row gap-1">
                            <!-- <span class="flex flex-col items-center text-xs pr-2">
                                <span>Max.</span>
                                {{ value.maxQty }}
                            </span> -->
                            <Button @click="$emit('add', { item: { ...item }, quantity: 1 })" size="fit">+1</Button>
                            <Button @click="$emit('remove', { item: { ...item }, quantity: 1 })" size="fit">
                                -1
                            </Button>
                        </div>
                        <Button v-if="edit" @click="$emit('remove', { item: { ...item, }, all: true })" size="fit"
                            color="#D9B14F">
                            <img src="/images/trash.png" class="trash-icon" />
                        </Button>
                    </div>
                    <div v-else>
                        <Button v-if="fromWishlist" @click="$emit('remove-wishlist', { item: { ...item }, all: true })"
                            size="fit" color="#D9B14F">
                            <img src="/images/trash.png" class="trash-icon" />
                        </Button>
                    </div>
                </div>
            </div>
            <div v-for="value in item.sets" :key="`${value.set.code}`"
                class="flex items-center justify-between gap-2 ml-2">
                <!-- mb-2 ml-2 -->
                <div class="flex gap-2 truncate">
                    <span class="text-sm text-gray-600">x{{ value.qty }}</span>
                    <!-- <div class="flex flex-row items-center gap-1"> -->
                    <div v-if="value.treatment" class="relative h-7 min-w-[16px]">
                        <div class="rainbow-bg absolute top-0 w-full h-full"> </div>
                        <span
                            class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[12px] font-bold ">
                            {{ value.treatment === "foil" ? "F" : value.treatment === "etched" ? "E" : "" }}
                        </span>
                    </div>
                    <!-- </div> -->
                    <span class="text-sm text-gray-600 truncate">{{ value.set.name }}</span>
                </div>
                <div class="flex items-start justify-between" :class="{ 'disabled': loading }">
                    <!-- EDIT MODE -->
                    <div v-if="edit && !fromWishlist" class="flex items-center space-x-2">
                        <div class="flex flex-row gap-1">
                            <span class="flex flex-col items-center text-xs pr-2">
                                <span>Max.</span>
                                {{ value.maxQty }}
                            </span>
                            <Button v-if="value.maxQty > value.qty"
                                @click="$emit('add', { item: { ...item, set: value.set.code }, quantity: 1 })"
                                size="fit">+1</Button>
                            <Button @click="$emit('remove', { item: { ...item, set: value.set.code }, quantity: 1 })"
                                size="fit">
                                -1
                            </Button>
                        </div>
                        <Button v-if="edit"
                            @click="$emit('remove', { item: { ...item, set: value.set.code }, all: true })" size="fit"
                            color="#D9B14F">
                            <img src="/images/trash.png" class="trash-icon" />
                        </Button>
                    </div>
                    <div v-else>
                        <Button v-if="fromWishlist"
                            @click="$emit('remove-wishlist', { item: { ...item, set: value.set.code }, all: true })"
                            size="fit" color="#D9B14F">
                            <img src="/images/trash.png" class="trash-icon" />
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    </li>
</template>

<script setup>
import { computed } from 'vue';
import Button from '../atomic/Button.vue';

defineEmits(["remove", "add", "remove-wishlist"])
const props = defineProps({
    edit: { type: Boolean, default: false },
    fromWishlist: { type: Boolean, default: false },
    item: { type: Object, default: () => { } },
    loading: { type: Boolean, default: false },

})
const itemName = computed(() => props?.item?.name?.split("//")[0])
</script>

<style lang="scss" scoped>
.trash-icon {
    height: -webkit-fill-available;
}

.disabled {
    pointer-events: none;
    opacity: 0.8;
}
</style>