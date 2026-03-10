<template>
    <div>
        <h1 class="text-2xl font-bold mb-5">Panel de Admin > Ventas de Magic</h1>

        <!-- MODAL ZONE -->
        <AdminLogin @post-login="loadSales()" />
        <!-- MODAL ZONE -->

        <div v-if="adminIsLoggedIn">
            <Tabs :tabs="tabs" :active-tab="activeTab" @change="val => activeTab = val.index" id="tabs">
                <template #helper>
                    <InputField class="mb-1 ml-5" v-model="searchOrder"
                        placeholder="Busca por id, nombre de persona o numero" @input="loadSales" only-enter
                        :debounce="0" />
                </template>
                <div class="tab-content">
                    <Empty v-if="!fetching && !localSales?.length" class="self-center" />
                    <Loader v-if="fetching" class="self-center mt-10" />
                    <div v-for="(sale, index) in localSales" :key="index" class="flex flex-col gap-5 w-full">
                        <!-- {{ sale }} -->
                        <Compressor :icon="false" speedy :id="`compressor-${index}`">
                            <template #title>
                                <div class="flex flex-col w-full rounded-md p-3 hover:cursor-pointer"
                                    :class="[tabs[activeTab].bg]">
                                    <span class="font-bold">Orden de compra: <span class="font-normal"> {{ sale.id
                                            }}</span></span>
                                    <span class="font-bold">Nombre: <span class="font-normal"> {{ sale.name
                                            }}</span></span>
                                    <span class="font-bold fles flex-row">Telefono: <span class=" font-normal"> {{
                                        sale.contact
                                            }}</span> <span
                                            class="text-green-300 flex flex-row items-center gap-2 hover:cursor-alias max-w-min"
                                            @click.stop="goWpp(sale.contact)">Contactar <img src="/images/whatsapp.png"
                                                class="w-4 h-4" /></span></span>
                                    <span class="font-bold">Comentarios: <span class="font-normal"> {{ sale.comments
                                            }}</span></span>
                                </div>
                            </template>
                            <template #content>
                                <!-- :class=[tabs[activeTab].bg] -->
                                <div class="content rounded-md bg-opacity-50 mt-2">
                                    <!-- :class="[`bg-${card.sold || parseInt(card.sold) === parseInt(card.quantity) ? 'green-600' : 'red-600'}`]" -->
                                    <div v-for="(card, index_2) in sale.cart" class="content-cards p-4 bg-opacity-50"
                                        :class="[`bg-${card.sold || parseInt(card.sold) === parseInt(card.quantity) ? 'sold' : 'not-sold'}`]"
                                        :key="`card-${index_2}`">

                                        <div v-if="tabs[activeTab].value !== 'complete'" class="h-[150px] relative">
                                            <img :src="card.image" class="h-[150px] w-min object-contain" />
                                            <div v-if="card.treatment === 'foil'"
                                                class="absolute top-0 left-0 w-full h-full rainbow-bg z-10">
                                            </div>
                                        </div>

                                        <div class="flex flex-col gap-1">
                                            <div class="flex flex-col">
                                                <!-- INFO -->
                                                <span class="font-bold">{{ `Cantidad solicitada: ` }}<span
                                                        class="font-normal">{{ card.quantity }}</span></span>
                                                <span class="font-bold">{{ `${card.name.split('//')[0]} | ` }}<span
                                                        class="font-normal">{{ card?.set?.name }}</span></span>
                                                <span class="font-bold">{{
                                                    `Tratamiento: ` }}<span class="font-normal">{{ capi(card.treatment
                                                        === "" ?
                                                        "normal"
                                                        :
                                                        card.treatment) }}</span></span>
                                            </div>
                                            <div v-if="!soldIsBoolean(card.sold) && ['incomplete', 'pending'].includes(sale.status)"
                                                class=" flex flex-row gap-2 border-t-2 border-black w-full
                                                justify-between h-full items-center">
                                                <!-- SELECTOR -->
                                                <div class="flex flex-col gap-1">
                                                    <span class="font-bold text-lg">{{ `Agregadas para entrega: `
                                                    }}<span class="font-normal">{{ card.sold }}</span></span>
                                                    <span class=" flex flex-row gap-2 font-bold text-lg">{{ `Estado: `
                                                    }}<span class="font-normal"> <img
                                                                :src="`/images/${parseInt(card.sold) === parseInt(card.quantity) ? 'check-mark' : 'letter-x'}.png`"
                                                                class="w-6 h-6" /></span></span>

                                                </div>
                                                <div class="flex flex-col gap-1 mt-2" v-if="!loading">
                                                    <img src="/images/add.png" @click="changeSoldQty(card, 1)"
                                                        class="w-10 h-10 hover:cursor-pointer hover:scale-125 transition-transform duration-500" />
                                                    <img src="/images/minus.png" @click="changeSoldQty(card, -1)"
                                                        class="w-10 h-10 hover:cursor-pointer hover:scale-125 transition-transform duration-500" />
                                                </div>
                                                <Loader v-else />
                                            </div>
                                            <div v-else class="pt-5">
                                                <span v-if="card.sold" class="text-2xl font-bold">Carta vendida.</span>
                                                <span v-if="!card.sold" class="text-2xl font-bold">Carta no
                                                    vendida.</span>

                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-row justify-end p-4 gap-2 col-span-full w-full">

                                        <Button v-if="tabs[activeTab].value !== 'complete'" size="small"
                                            @click="confirmLocalOrder(sale, true)" :loading="loading">Cerrar
                                            orden</Button>
                                        <Button v-if="tabs[activeTab].value !== 'complete'" size="small"
                                            @click="setAllLikeSold(sale)" :loading="loading">Agregar todo</Button>
                                        <Button v-if="tabs[activeTab].value !== 'complete'" size="small"
                                            @click="setAllLikeSold(sale, true)" :loading="loading">Quitar todo</Button>
                                        <Button v-if="tabs[activeTab].button" size="small" :loading="loading"
                                            :disabled="!confirmButtonActive(sale.cart)" class="self-end"
                                            @click="confirmLocalOrder(sale)">{{
                                                tabs[activeTab].button }}</Button>
                                    </div>
                                </div>
                            </template>
                        </Compressor>
                    </div>
                </div>
            </Tabs>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import Button from '@/components/atomic/Button.vue';
import InputField from '@/components/atomic/InputField.vue';
import Tabs from "@/components/atomic/Tabs.vue";
import { useToast } from "primevue/usetoast";
import useSales from '@/composables/mtg/useSales';
import Compressor from '@/components/atomic/Compressor.vue';
import { capitalizeFirstLetter } from '@/utils/utils';
import useWhatsapp from '@/composables/useWhatsapp';
import AdminLogin from '@/components/admin/AdminLogin.vue';
import useUser from '@/composables/useUser';
import Loader from '@/components/atomic/Loader.vue';
import Empty from '@/components/atomic/Empty.vue';


const toast = useToast();
const { adminIsLoggedIn } = useUser();
const { fetchSales, sales, fetchSalesResumen, confirmOrder } = useSales();
const { openWhatsApp } = useWhatsapp()
const loading = ref(false);
const fetching = ref(true);
const searchOrder = ref("");

const localSales = ref([])
const orderResumen = ref([])

const getCount = (status) => orderResumen.value?.find(x => x.status === status)?.total || 0;

const activeTab = ref(0);
const tabs = computed(() => ([{ index: 0, value: 'pending', name: "Pendientes", bg: "bg-gt-dark-300", button: "Confirmar venta", count: getCount("pending") },
{ index: 1, value: 'incomplete', name: "Sin completar", bg: "bg-gt-dark-300", button: "Confirmar venta", count: getCount("incomplete") },
{ index: 2, value: 'complete', name: "Completadas", bg: "bg-gt-dark-300", button: null, count: getCount("complete") }]))

const confirmButtonActive = (row) => row.filter(x => !x.added).some(x => x.sold)
const soldIsBoolean = (field) => typeof field === 'boolean'
const capi = (str) => capitalizeFirstLetter(str);

function goWpp(phone) {
    openWhatsApp("Hola, te hablo por tu pedido", " ", phone)
}
async function init() {
    orderResumen.value = await fetchSalesResumen();
    await loadSales();
}
async function loadSales() {
    fetching.value = true;
    await fetchSales({ status: tabs.value[activeTab.value]?.value, search: searchOrder.value });
    fetching.value = false;
}
function changeSoldQty(card, qty) {
    if (card.sold === 0 && qty === -1) return;
    if (card.sold === card.quantity && qty === 1) return;
    card.sold += qty;
}
function setAllLikeSold(sale, remove = false) {
    if (remove) {
        sale.cart.forEach(x => x.sold = 0);
        return;
    }
    sale.cart.forEach(x => x.sold = x.quantity);
}
async function confirmLocalOrder(params, forceClose = false) {
    try {
        loading.value = true;
        const result = await confirmOrder(params, forceClose)
        if (result.status !== 500) {
            toast.removeAllGroups();
            toast.add({
                severity: "success",
                life: 2000,
                detail: "Moviendo orden a la lista correspondiente",
                summary: forceClose ? "Orden cerrada correctamente" : result.every(x => x.added) ? "Orden completada correctamente" : "Orden completada parcialmente"
            })
            setTimeout(async () => {
                loading.value = false;
                await init();
                document.getElementById("tabs")?.scrollIntoView({ behavior: "smooth" })
            }, 1000);
        } else loading.value = false
    } catch (error) {
        loading.value = false
        console.error(error)
    };
}


watch([activeTab], async () => {
    await loadSales()
})
watch(sales, () => {
    localSales.value = sales.value?.map((sal) => ({ ...sal, cart: (typeof sal.cart === 'string' ? JSON.parse(sal.cart) : sal.cart).map(x => ({ ...x, sold: x.sold || 0 })) }))
})
onMounted(async () => {
    orderResumen.value = await fetchSalesResumen();
})
</script>

<style lang="scss" scoped>
.tab-content {
    overflow-y: auto;
    @include flex(column, flex-start, flex-start);
    gap: 10px;
    width: 100%;


    @include breakpoint(hd1) {
        height: 450px;
    }

    @include breakpoint(fhd) {
        height: 600px;
    }

    @include breakpoint(fhd3) {
        height: 900px;
    }

}

.content {
    @include grid($columns: 2, $gap: 10px);
    width: 100%;
    justify-items: start;

    &-cards {
        width: 100%;
        @include grid($columns: 2, $gap: 15px);
        grid-template-columns: max-content auto;
        border-bottom: 1px solid black;
    }

}

.bg {
    &-sold {
        // bg-green-500
        // background-color: var(--color-green-500); /* oklch(72.3% 0.219 149.579) */
        // bg-green-600
        // background-color: var(--color-green-600); /* oklch(62.7% 0.194 149.214) */
        background: oklch(72.887% 0.21192 147.841 / 0.58);
    }

    &-not-sold {
        background-color: oklch(63.78% 0.23729 25.422 / 0.64);
        // bg-red-500
        /* oklch(63.7% 0.237 25.331) */
        // bg-red-600
        /* oklch(57.7% 0.245 27.325) */
    }
}
</style>