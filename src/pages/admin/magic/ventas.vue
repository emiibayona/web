<template>
    <div>
        <h1 class="text-2xl font-bold mb-5">Panel de Admin > Ventas de Magic</h1>

        <!-- MODAL ZONE -->
        <AdminLogin @post-login="loadSales()" />
        <!-- MODAL ZONE -->

        <div v-if="adminIsLoggedIn">
            <Tabs :tabs="tabs" :active-tab="activeTab" @change="val => activeTab = val.index" id="tabs">
                <div class="tab-content">
                    <div class="w-full pb-2 sticky top-0 bg-site">
                        <!-- <form @submit.prevent=""> -->
                        <InputField v-model="searchOrder" placeholder="Busca por id, nombre de persona o numero"
                            @input="loadSales" only-enter :debounce="0" />
                        <!-- </form> -->
                    </div>
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
                                    <span class="font-bold">Orden de compra: <span class="font-normal"> {{
                                        Date(sale.createdAt)
                                            }}</span></span>
                                </div>
                            </template>
                            <template #content>
                                <!-- <div v-if="index === activeAccordeon"> -->
                                <div class="content rounded-md bg-opacity-50" :class=[tabs[activeTab].bg]>
                                    <div v-for="(card, index_2) in sale.cart" class="content-cards p-4 "
                                        :key="`card-${index_2}`">

                                        <img v-if="tabs[activeTab].value !== 'complete'" :src="card.image"
                                            class="h-[200px] w-auto" />
                                        <div class="flex flex-col gap-2 justify-center">
                                            <span>{{ `${card.quantity}x | ${card.name.split('//')[0]}` }}</span>
                                            <span class="ml-6">{{ `Tratamiento: ${capi(card.treatment === "" ? "normal"
                                                :
                                                card.treatment)}` }}</span>
                                            <span class="ml-6">
                                                {{ `SET: ${card?.set?.name}` }}
                                            </span>
                                        </div>
                                        <div class="flex flex-row items-center gap-2 max-w-[60px]"
                                            v-if="tabs[activeTab].value !== 'complete' && !card.added">
                                            <InputField v-model="card.sold" :placeholder="0" type="number"
                                                class="max-w-[40px] max-h-[20px] mr-4" :debounce="0"
                                                :max="parseInt(card.quantity)" :min="0" />

                                            <img :src="`/images/check${parseInt(card.sold) === parseInt(card.quantity) ? '' : '-progress'}.png`"
                                                class="w-6 h-6"
                                                :class="[`bg-${parseInt(card.sold) === parseInt(card.quantity) ? 'green-600' : 'red-600'}`]" />
                                        </div>
                                        <div class="flex flex-row items-center gap-2" v-else>
                                            <span>Pedidas {{ card.quantity }}</span>|
                                            <span>Vendidas {{ card.sold }}</span>
                                        </div>
                                    </div>

                                    <div class="flex flex-row justify-end p-4 gap-2 col-span-full w-full">
                                        <Button v-if="tabs[activeTab].value !== 'complete'" size="small"
                                            @click="confirmLocalOrder(sale, true)" :loading="loading">Cerrar
                                            orden</Button>
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


const toast = useToast();
const { adminIsLoggedIn } = useUser();
const { fetchSales, sales, fetchSalesResumen, confirmOrder } = useSales();
const { openWhatsApp } = useWhatsapp()
const loading = ref(false);
const searchOrder = ref("");

const localSales = ref([])
const orderResumen = ref([])

const getCount = (status) => orderResumen.value?.find(x => x.status === status)?.total || 0;

const activeTab = ref(0);
const tabs = computed(() => ([{ index: 0, value: 'pending', name: "Pendientes", bg: "bg-gt-dark-300", button: "Confirmar venta", count: getCount("pending") },
{ index: 1, value: 'incomplete', name: "Sin completar", bg: "bg-red-900", button: "Confirmar venta", count: getCount("incomplete") },
{ index: 2, value: 'complete', name: "Completadas", bg: "bg-green-900", button: null, count: getCount("complete") }]))

const confirmButtonActive = (row) => row.filter(x => !x.added).some(x => x.sold)

const capi = (str) => capitalizeFirstLetter(str);

function goWpp(phone) {
    openWhatsApp("Hola, te hablo por tu pedido", " ", phone)
}
async function init() {
    orderResumen.value = await fetchSalesResumen();
    await loadSales();
}
async function loadSales() {
    await fetchSales({ status: tabs.value[activeTab.value]?.value, search: searchOrder.value });
}
async function confirmLocalOrder(params, forceClose = false) {
    loading.value = true;
    const result = await confirmOrder(params, forceClose)
    if (result) {
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
    }
}


watch([activeTab], async () => {
    await loadSales()
})
watch(sales, () => {
    localSales.value = sales.value?.map((sal) => ({ ...sal, cart: JSON.parse(sal.cart).map(x => ({ ...x, sold: x.sold || 0 })) }))
})
</script>

<style lang="scss" scoped>
.tab-content {
    overflow-y: auto;
    @include flex(column, flex-start, flex-start);
    gap: 10px;
    width: 100%;


    @include breakpoint(hd1) {
        height: 400px;
    }

    @include breakpoint(fhd) {
        height: 600px;
    }

    @include breakpoint(fhd3) {
        height: 900px;
    }

}

.content {
    @include grid($columns: 3, $gap: 10px);
    width: 100%;
    justify-items: start;

    &-cards {
        width: 100%;
        @include grid($columns: 3, $gap: 10px);
        grid-template-columns: max-content auto 150px;
        border-bottom: 1px solid black;
    }

}
</style>