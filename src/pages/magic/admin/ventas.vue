<template>
    <div>
        <h1 class="text-2xl font-bold mb-5">Panel de Ventas</h1>
        <!-- <button @click="showModal = true">Abrir Modal</button> -->
        <Modal v-model="showModal" title="PANEL DE ADMIN" close-disabled>
            <p class="mb-1">Coloca la contraseña para acceder</p>

            <form @submit.prevent="goVentas">
                <InputField v-model="password" @keyup.enter="goVentas" placeholder="Ingrese la contraseña"
                    type="password" />
                <div class="flex flex-row justify-between mt-2">
                    <Button @click="goHome" size="xsmall" :disabled="loading">Volver inicio</button>
                    <Button @clic.stop="goVentas" size="xsmall"
                        :disabled="passwordIsEmpty || loading">Confirmar</button>
                </div>
            </form>

        </Modal>

        <div v-if="logInfo.logged">
            <Tabs :tabs="tabs" :active-tab="activeTab" @change="val => activeTab = val.index">
                <div v-for="(sale, index) in localSales" :key="index" class="flex flex-col gap-5">
                    <!-- {{ sale }} -->
                    <Compressor :icon="false" speedy>
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
                            <!-- <div v-if="index === activeAccordeon"> -->
                            <div class="content w-full flex flex-col gap-2 mt-2">
                                <div v-for="(card, index_2) in sale.cart"
                                    class="flex flex-row gap-10 items-center h-[30px]" :key="`card-${index_2}`">

                                    <span>{{ `${card.quantity}x | ${card.name} | SET: ${card?.set?.name} |
                                        Tratamiento: ${capi(card.treatment === "" ? "normal" : card.treatment)}`
                                    }}</span>
                                    <div class="flex flex-row items-center gap-2 max-w-[60px]"
                                        v-if="tabs[activeTab].value !== 'complete'">
                                        <InputField v-model="card.sold" :placeholder="0" type="number"
                                            class="max-w-[40px] max-h-[20px] mr-4" :debounce="0"
                                            :max="parseInt(card.quantity)" />

                                        <img :src="`/images/check${parseInt(card.sold) === parseInt(card.quantity) ? '' : '-progress'}.png`"
                                            class="w-6 h-6" />
                                    </div>
                                    <div class="flex flex-row items-center gap-2" v-else>
                                        <span>Pedidas {{ card.quantity }}</span>|
                                        <span>Vendidas {{ card.sold }}</span>

                                    </div>
                                </div>
                                <Button v-if="tabs[activeTab].button" size="small" class="self-end">{{
                                    tabs[activeTab].button }}</Button>
                            </div>
                            <!-- </div> -->
                        </template>
                    </Compressor>
                </div>
            </Tabs>

        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import Modal from '@/components/atomic/Modal.vue';
import Button from '@/components/atomic/Button.vue';
import InputField from '@/components/atomic/InputField.vue';
import Tabs from "@/components/atomic/Tabs.vue";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import useSales from '@/composables/mtg/useSales';
import Compressor from '@/components/atomic/Compressor.vue';
import { capitalizeFirstLetter } from '@/utils/utils';
import useWhatsapp from '@/composables/useWhatsapp';

const router = useRouter();
const toast = useToast();
const { fetchSales, sales, fetchSalesResumen } = useSales();
const { openWhatsApp } = useWhatsapp()
const showModal = ref(false);
const loading = ref(false);
const password = ref(null);
const magicKey = "magic_admin_available";
const logInfo = ref({ logged: false });

const localSales = ref([])
const orderResumen = ref([])

const getCount = (status) => orderResumen.value?.find(x => x.status === status)?.total || 0;

const tabs = computed(() => ([{ index: 0, value: 'pending', name: "Pendientes", bg: "bg-gt-dark-300", button: "Confirmar venta", count: getCount("pending") },
{ index: 1, value: 'incomplete', name: "Sin completar", bg: "bg-red-900", button: "Confirmar venta", count: getCount("incomplete") },
{ index: 2, value: 'complete', name: "Completadas", bg: "bg-green-900", button: null, count: getCount("complete") }]))
const activeTab = ref(0);

const passwordIsEmpty = computed(() => password.value === null || password.value === '')

const capi = (str) => capitalizeFirstLetter(str);
async function goVentas() {
    loading.value = true;
    setTimeout(async () => {
        if (passwordIsEmpty.value) return;
        if (password.value === import.meta.env.VITE_ADMIN_PASSWORD) {
            toast.add({
                severity: "success",
                summary: "Contraseña exitosa, redirigiendo",
                life: 1800,
            })
            await loadSales(tabs.value[activeTab.value]?.value);
            setTimeout(() => {
                showModal.value = false;
                loading.value = false;
                logInfo.value = { logged: true, time: new Date() };
                localStorage.setItem(magicKey, JSON.stringify(logInfo.value));
            }, 2000);
        } else {
            toast.add({
                severity: "error",
                summary: "Contraseña erronea, vuelva a intentarlo",
                life: 2000,
            })
            password.value = null;
            loading.value = false;
        }
    }, 250);
}
function goHome() {
    router.push("/");
}
function goWpp(phone) {

    openWhatsApp("Hola, te hablo por tu pedido", " ", phone)
}
async function loadSales(status) {
    await fetchSales({ status });
}

onMounted(async () => {
    logInfo.value = JSON.parse(localStorage.getItem(magicKey) || '{}');
    orderResumen.value = await fetchSalesResumen();
    if (logInfo.value.logged) {
        const diff = Math.floor((new Date().getTime() - new Date(logInfo.value.time).getTime()) / (1000 * 60));
        if (diff >= 240) {
            logInfo.value = { ...logInfo.value, logged: false };
            toast.add({
                severity: "warn",
                summary: "Sesión caducada, reconectar",
                life: 2000,
            });
            setTimeout(() => {
                showModal.value = true;
                localStorage.setItem(magicKey, JSON.stringify(logInfo.value));
            }, 1000);
        } else {

            await loadSales(tabs.value[activeTab.value]?.value);
        }
    } else {
        showModal.value = true;
    }
})

watch(activeTab, async () => {
    await loadSales(tabs.value[activeTab.value]?.value)
})
watch(sales, () => {
    localSales.value = sales.value?.map((sal) => ({ ...sal, cart: JSON.parse(sal.cart).map(x => ({ ...x, sold: x.sold || 0 })) }))
})
</script>

<style lang="scss" scoped></style>