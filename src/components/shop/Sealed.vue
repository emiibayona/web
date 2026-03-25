<template>
    <div :id="value.id" class="sealed-item nm:hover:drop-shadow-lg" :class="['seal-wrapper']"
        @click="hightlightComponent()">
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
import { computed, ref } from 'vue';
import Button from '../atomic/Button.vue';
import useWhatsapp from '@/composables/useWhatsapp';
import useDevices from '@/composables/useDevices';
import useBeauty from '@/composables/useBeauty';

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

const { hightlightComponent } = useBeauty(props?.value?.id, isZoomeable.value, { width: '40vw' })

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