<template>
    {{ cart }}
    <div v-for="(cart, index) in values" :key="`${cart.name}-${index}`" :class="{ 'min-h-[300px]': isMobile }">
        <div class="flex flex-col px-2 nm:px-10"
            :class="[{ 'pb-4': wishlist }, { 'py-4': !cart.count }, { 'border-b-2 border-black': index + 1 !== values.length }]">
            <span class="font-bold mb-2 text-xl">{{ capi(cart.name) }} (<span class="font-normal">{{ cart.count
            }}</span>) <Button v-if="cart.count" size="xsmall" @click="clean">Remover todo</Button></span>
            <div class="flex flex-col gap-2 pl-2 overflow-auto" :class="[{ 'cart-count-body': cart.count }]">
                <MiniCartCard v-for="(item, index_2) in cart.values" :key="`${cart.name}-${index}-${index_2}`"
                    :item="item" @add="add" @remove="remove" @remove-wishlist="removeWishlist" edit
                    :from-wishlist="wishlist" />
                <div v-if="!cart?.values?.length" class="font-bold mt-5 ml-5" :class="{ 'text-sm': isMobile }">
                    <span>
                        {{ `No hay nada en tu ${wishlist ? 'wishlist' : 'carrito'}, ` }}
                        <span class="text-blue-700 underline decoration-blue-700 cursor-pointer"
                            @click="router.push(`/${cart.name}/singles`)">
                            ve por tus cartas ...
                        </span>
                    </span>
                </div>
            </div>
            <Button v-if="!wishlist && cart.count" class="self-end my-5" size="small"
                @click="openConfirmationModal(cart)">{{
                    `Comprar carrito de
                ${capi(cart.name)}`
                }}</Button>
            <Button v-if="wishlist && cart.count && false" size="small" disabled class="self-end my-5">
                Mover lista al carrito (en desarrollo)
            </Button>
        </div>
        <Modal v-model="showModal" :title="!showOrderConfirmed ? 'Confirmar carrito' : 'Carrito enviado'"
            :close-disabled="loading || showOrderConfirmed">
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
                        :disabled="fieldIsEmpty(information.contact) || fieldIsEmpty(information.name)"
                        :loading="loading">
                        Confirmar
                    </Button>
                </div>
            </form>
            <div v-else class="flex flex-col gap-4 max-w-[440px]">
                <p>
                    {{ `Se abrirá automaticamente una conversación con la tienda.\n
                    En caso de no disponer de WhatsApp Web, contactate con nosotros a traves del numero` }}
                    <span class="font-bold">{{
                        contactPhone }}</span>
                </p>
                <Button @click="() => { showModal = false; showOrderConfirmed = false; router.push('/') }" size="small"
                    class="self-end">Entendido</button>
            </div>

        </Modal>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import useCarts from '@/composables/useCart';
import MiniCartCard from './MiniCartCard.vue';
import { GAMES, RECIPIENTS_LISTS } from '@/utils/constants';
import { capitalizeFirstLetter, fieldIsEmpty } from '@/utils/utils';
import Button from '@/components/atomic/Button.vue';
import useWhatsapp from '@/composables/useWhatsapp';
import Modal from '@/components/atomic/Modal.vue';
import InputField from '@/components/atomic/InputField.vue';
import Textarea from '@/components/atomic/Textarea.vue';
import useSales from '@/composables/mtg/useSales';
import { useRouter } from 'vue-router';
import useDevices from '@/composables/useDevices';

const props = defineProps({ values: { type: Array, default: () => [] }, wishlist: { type: Boolean, default: false } })
const { add, remove, cleanCart } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.CART);
const { remove: removeWishlist, cleanCart: cleanWishlist } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.WISHLIST);
const capi = (str) => capitalizeFirstLetter(str);
const { openWhatsApp } = useWhatsapp();
const { createOrder } = useSales();
const currentCart = ref(null);
const showModal = ref(false);
const information = ref({ name: '', contact: '', comments: '' })
const loading = ref(false)
const showOrderConfirmed = ref(false)
const contactPhone = ref(import.meta.env.VITE_PHONE_CONTACT)
const router = useRouter();
const { isMobile } = useDevices();


function openConfirmationModal(cart) {
    currentCart.value = cart;
    showModal.value = true;
}
function clean() {
    if (props.wishlist) {
        cleanWishlist();
    } else {
        cleanCart();
    }
}
async function orderConfirmed() {
    loading.value = true;
    const res = await createOrder({ ...currentCart.value, form: information.value });
    if (res.status !== 500) {
        setTimeout(() => {
            showOrderConfirmed.value = true;
            loading.value = false;
            openWhatsApp("Hola, realice una compra por la web, te envio la informacion", `Código de compra: *${res.id}* \n\nGracias!`)
            cleanCart();
        }, 2000)
    } else loading.value = false;
}

watch(showModal, () => {
    if (!showModal.value) {
        information.value = { name: '', contact: '', comments: '' }
    }
})
</script>

<style lang="scss" scoped>
.cart-count-body {
    height: 400px;

    @include breakpoint(fhd2) {
        height: 500px;
    }

    @include breakpoint(fhd3) {
        height: 600px;
    }
}
</style>