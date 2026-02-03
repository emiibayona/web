<template>
    <div class="max-w-3xl mx-auto p-4 w-full">
        <h2 class="text-2xl font-semibold mb-4">Cart (<span>{{ resume.items }}</span>)</h2>

        <ul class="space-y-1">
            <li v-for="item in items" :key="item.id"
                class="bg-gt-yellow-100 bg-opacity-50 shadow rounded-lg px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div class="flex-1">
                    <span>
                        {{ item.name }}
                    </span>
                    <div class="flex items-start justify-between">
                        <!-- EDIT MODE -->
                        <div v-if="edit" class="flex items-center space-x-2">
                            <div class="flex items-center border rounded-md overflow-hidden">
                                <button @click="decrease(item)" class="px-3 py-1 text-sm">
                                    -
                                </button>
                                <div class="px-3 py-1 text-sm w-10 text-center">
                                    {{ item.qty }}
                                </div>
                                <button @click="increase(item)" class="px-3 py-1 text-sm">
                                    +
                                </button>
                            </div>

                            <button @click="removeItem(item)" class="text-red-500 text-sm">
                                Remove
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <!-- <div class="text-sm text-gray-700">Total: <span class="font-semibold">{{
                            formatCurrency(itemTotal(item)) }}</span></div> -->
                    </div>

                    <transition name="fade">
                        <div class="">
                            <div v-for="exp in item.expansions" :key="exp.id"
                                class="flex items-center justify-between w-full pl-2">
                                <div class="flex items-center gap-2" :class="{ 'max-w-[80%]': exp.price }">
                                    <span>{{ exp.qty }}</span>
                                    <span class="text-sm truncate">{{ exp.name }}</span>
                                    <!-- <div>
                                    </div> -->
                                </div>
                                <div v-if="exp.price" class="text-sm text-gray-600">
                                    {{ formatCurrency(exp.price) }}
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </li>
        </ul>

        <!-- <div class="mt-6 bg-white shadow rounded-lg p-4 flex items-center justify-between">
            <div class="text-lg font-medium">Subtotal</div>
            <div class="text-lg font-semibold">{{ formatCurrency(subtotal) }}</div>
        </div> -->
        <div v-if="items?.length" class="w-full flex mt-4">
            <button @click="console.log('Edit clicked')"
                class="px-4 py-2 rounded-md font-medium shadow-sm bg-gray-800 hover:bg-gray-700 active:bg-gray-900 text-white transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-600">
                Editar
            </button>
            <button @click="console.log(items)"
                class="ml-auto px-4 py-2 rounded-md font-medium shadow-sm bg-gt-moustard-500 hover:bg-gt-moustard-600 active:bg-gt-moustard-700 text-gray-800 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-gt-moustard-300">
                Confirmar compra
            </button>
        </div>

        <div v-if="items.length === 0" class="mt-6 text-center text-gray-500">
            Your cart is empty.
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

defineProps({
    edit: { type: Boolean, default: false }
})
const items = ref([]);
// const items = ref([
//     {
//         name: "Hexing Squelcher",
//         id: 1,
//         qty: 2,
//         expansions: [
//             { qty: 1, qtyAvailable: 2, id: "a", name: "Lorwyn Eclipsed", price: 2.5 },
//             { qty: 1, qtyAvailable: 2, id: "b", name: "Lorwyn Eclipsed Variants", price: 3.0 },
//         ],
//     },
//     {
//         id: 2,
//         name: "Necropotence",
//         expansions: [{ qty: 1, qtyAvailable: 2, id: "a", name: "Wilds of Eldraine Enchanting Tales", }],
//     },
// ]);

const increase = (item) => {
    item.qty++;
};
const decrease = (item) => {
    if (item.qty > 1) item.qty--;
};
const removeItem = (item) => {
    const idx = items.value.findIndex((i) => i.id === item.id);
    if (idx !== -1) items.value.splice(idx, 1);
};

const itemTotal = (item) => {
    return item.expansions.reduce((s, e) => s + e.price * e.qty, 0);
};

const subtotal = computed(() =>
    items.value.reduce((s, i) => s + itemTotal(i), 0),
);

const resume = computed(() => ({
    items: items.value.reduce((s, i) => s + i.expansions.reduce((ss, ee) => ss + ee.qty, 0), 0)
}))

const formatCurrency = (v) => {
    if (!v) return null;
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
    }).format(v);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
