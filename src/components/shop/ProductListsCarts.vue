<template>
    <div v-for="(cart, index) in values" :key="`${cart.name}-${index}`">
        <div v-if="cart.count" class="flex flex-col border-b-2 border-black px-10" :class="[{ 'pb-4': wishlist }]">
            <span class="font-bold mb-2 text-xl">{{ capi(cart.name) }} (<span class="font-normal">{{ cart.count
                    }}</span>)</span>
            <div class="flex flex-col gap-2 pl-2">
                <MiniCartCard v-for="(item, index_2) in cart.values" :key="`${cart.name}-${index}-${index_2}`"
                    :item="item" @add="add" @remove="remove" edit :from-wishlist="wishlist" />
            </div>
            <Button v-if="!wishlist" class="self-end my-5" size="small" @click="openConfirmationModal(cart)">{{
                `Comprar carrito de
                ${capi(cart.name)}`
            }}</Button>
        </div>
        <Modal v-model="showModal" title="Confirmar carrito" :close-disabled="showOrderConfirmed">
            <form @submit.prevent="" v-if="!showOrderConfirmed">
                <div>
                    <span> Ingresa tu nombre <span v-if="fieldIsEmpty(information.name)"
                            class="font-bold text-xs text-red-600">(requerido)</span></span>
                    <InputField v-model="information.name" @keyup.enter="" placeholder="Jace Beleren" type="text" />
                </div>
                <div>
                    <span>
                        Celular de contacto
                        <span v-if="fieldIsEmpty(information.contact)"
                            class="font-bold text-xs text-red-600">(requerido)</span>
                    </span>
                    <InputField v-model="information.contact" @keyup.enter="" placeholder="09...." type="text" />
                </div>
                <div>
                    <span>
                        Comentarios al pedido
                    </span>
                    <Textarea v-model="information.comments" @keyup.enter=""
                        placeholder="Ingrese su comentario..."></Textarea>
                </div>

                <div class="flex flex-row justify-end mt-2">
                    <Button @click="orderConfirmed" size="small"
                        :disabled="fieldIsEmpty(information.contact) || fieldIsEmpty(information.name)">Confirmar</button>
                </div>
            </form>
            <div v-else class="flex flex-col">
                <p>
                    Se abrirá automaticamente una conversación con la tienda.
                    En caso de no disponer de WhatsApp Web, contactate con ellos a traves del <span class="font-bold">{{
                        contactPhone }}</span>
                </p>
                <Button @click="() => { showModal = false; showOrderConfirmed = false }" size="small"
                    class="align-end">Entendido</button>
            </div>

        </Modal>
    </div>
</template>

<script setup>
import useCarts from '@/composables/useCart';
import MiniCartCard from './MiniCartCard.vue';
import { GAMES, RECIPIENTS_LISTS } from '@/utils/constants';
import { capitalizeFirstLetter } from '@/utils/utils';
import Button from '@/components/atomic/Button.vue';
import useWhatsapp from '@/composables/useWhatsapp';
import Modal from '../atomic/Modal.vue';
import InputField from '../atomic/InputField.vue';
import { ref, watch } from 'vue';
import Textarea from '../atomic/Textarea.vue';
import useSales from '@/composables/mtg/useSales';

defineProps({ values: { type: Array, default: () => [] }, wishlist: { type: Boolean, default: false } })
const { add, remove, cleanCart } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.CART);
const capi = (str) => capitalizeFirstLetter(str);
const { openWhatsApp } = useWhatsapp();
const { createOrder } = useSales();
const currentCart = ref(null);
const showModal = ref(false);
const information = ref({ name: '', contact: '', comments: '' })
const loading = ref(false)
const showOrderConfirmed = ref(false)
// const name = ref('')
const contactPhone = ref(import.meta.env.VITE_PHONE_CONTACT)

const fieldIsEmpty = (field) => field === '' || field === null;

function openConfirmationModal(cart) {
    currentCart.value = cart;
    showModal.value = true;
}

async function orderConfirmed() {
    loading.value = true;
    const res = await createOrder({ ...currentCart.value, form: information.value });
    setTimeout(() => {
        showOrderConfirmed.value = true;
        loading.value = false;
        openWhatsApp("Hola, realice una compra por la web, te envio la informacion", `Código de compra: *${res.id}* \n\nGracias!`)
    }, 2000)
    // TODO: 
    // Clean cart
    cleanCart();
}

watch(showModal, () => {
    if (!showModal.value) {
        information.value = { name: '', contact: '', comments: '' }
    }
})
</script>

<style lang="scss" scoped></style>