<template>
    <div :id="value.id" class="sealed-item nm:hover:drop-shadow-lg" :class="['seal-wrapper']" @click="openCard()">
        <div class="sealed-img">
            <img :src="value.image" />
        </div>
        <div class="sealed-item-info">
            <div class="titles">
                <span class="title">{{ value.name }}</span>
                <p class="description">{{ value.description }}</p>
            </div>
            <div class="info">
                <span v-if="value.stock" class="font-bold">Disponibles: <span class="font-normal"> {{ value.stock
                        }}</span></span>
                <span class="font-bold">Precio: <span class="font-normal"> {{ value.price }}</span></span>
                <Button v-if="!edit" :disabled="isSoldOut" :outlined="isSoldOut" @click.stop="addToCart">{{
                    isSoldOut ?
                        'Agotado' :
                        "Contactar"
                }}</Button>
            </div>
        </div>
    </div>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import Button from '../atomic/Button.vue';
import useWhatsapp from '@/composables/useWhatsapp';
import useDevices from '@/composables/useDevices';

const props = defineProps({
    value: {
        type: Object,
        required: true
    },
    edit: { type: Boolean, default: false },
    show: { type: Boolean, default: false },
    zoomeable: { type: Boolean, default: false },
});


const devices = useDevices();
const { openWhatsApp } = useWhatsapp()
const isSoldOut = computed(() => !props.value.stock || props.value.soldOut)
const opened = ref(false);



const addToCart = () => {
    if (props.show) return;
    openWhatsApp("Hola, me gustaria comprar el/los siguiente/s sellado/s", `${props.value.name}`)
}
const isZoomeable = computed(() => props.zoomeable && devices.width.value >= 1280);

let overlay = null;
let activeCard = null;
let originalCard = null;
let activeClone = null;
let app = null;

function openCard() {
    if (!isZoomeable.value) return;
    originalCard = activeCard;
    const rect = activeCard.getBoundingClientRect();

    const clone = activeCard.cloneNode(true);
    activeClone = clone;

    Object.assign(clone.style, {
        position: 'fixed',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: '0',
        zIndex: '1000',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    });

    activeCard.style.visibility = 'hidden';

    app.appendChild(clone);
    overlay.classList.add('active');

    requestAnimationFrame(() => {
        clone.style.top = '50%';
        clone.style.left = '50%';
        clone.style.transform = 'translate(-50%, -50%)';
        clone.style.width = '40vw';
    });
}


onMounted(() => {
    if (isZoomeable.value) {
        overlay = document.getElementById('overlay');
        activeCard = document.getElementById(props.value.id);
        app = document.getElementById("app");

        overlay.addEventListener('click', () => {
            if (activeClone && originalCard) {
                const rect = originalCard.getBoundingClientRect();

                // Volver a la posición de la original
                activeClone.style.top = `${rect.top}px`;
                activeClone.style.left = `${rect.left}px`;
                activeClone.style.transform = 'translate(0, 0)';
                activeClone.style.width = `${rect.width}px`;
                activeClone.style.height = `${rect.height}px`;

                overlay.classList.remove('active');

                // Limpieza al terminar la animación
                activeClone.addEventListener('transitionend', () => {
                    originalCard.style.visibility = 'visible';
                    activeClone.remove();
                    activeClone = null;
                    originalCard = null;
                }, { once: true });
            }
        });
    }
})
</script>

<style lang="scss" scoped>
.sealed-item {
    @include flex(row, flex-start, flex-start);
    gap: 12px;
    padding: 12px;
    height: clamp(150px, 250px, 250px);
    border-radius: 8px;
    width: 100%;

    background: #fff;

    @include breakpoint(nm) {
        @include flex(column, space-between, flex-start, 16px);
        height: auto;
        width: 100%;
    }

    .sealed-img {
        height: 100%;
        width: 25%;
        align-self: center;

        img {
            height: 100%;
            object-fit: contain;
        }

    }

    &-info {
        width: 75%;
        height: 100%;
        @include flex(row, space-between, flex-end);

        @include breakpoint(nm) {
            width: 100%;
        }

        .titles {
            height: 100%;
            width: 70%;
            @include flex(column, flex-start, flex-start);
            gap: 8px;

            .title {
                font-weight: bold;
                font-size: 20px;
            }

            .description {
                width: 100%;
                font-size: small;
                overflow-y: auto;
                scrollbar-width: none;
                cursor: row-resize;
            }
        }

        .info {
            @include flex(column, flex-start, flex-start, 8px);
            min-width: max-content;
        }
    }
}
</style>