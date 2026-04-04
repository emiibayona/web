<template>
    <div class="ab-wrapper" :class="[size, { bgDark }]" @click="path ? router.push(cleanedPath) : null">
        <div class="content">
            <span v-if="text">{{ text }}</span>
            <img v-if="img" class="img-logo" :src="img" alt="Logo Geartown" />
        </div>
        <!-- </div> -->
        <div v-if="bg?.src" class="bg-img"
            :style="{ backgroundImage: `url(${bg.src})`, backgroundPosition: `${bg.position || 'center'}` }"></div>
        <div class="bg-overlay" :class="[{ bgDark }]"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
const props = defineProps({
    text: {
        type: String,
        default: null,
    },
    img: {
        type: String,
        default: null,
    },
    bg: {
        type: Object,
        default:
            { src: null, position: "center" },
    },
    bgDark: { type: Boolean, default: true },
    size: {
        type: String,
        default: 'normal',
        validator: (value) => ["normal", "big", "bigXL", "bigXXL"].includes(value)
    },
    path: {
        type: String,
        default: null,
    },
});
const route = useRoute();
const router = useRouter();

const cleanedPath = computed(() => {
    if (!props.path) return props.path;
    return route.fullPath + (route.fullPath.endsWith('/') || props.path.endsWith('/') ? '' : '/') + props.path
})
</script>

<style lang="scss" scoped>
@property --angle {
    syntax: '<angle>';
    initial-value: 90deg;
    inherits: false;
}

.ab-wrapper {

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    // max-width: 300px;

    height: 100px;
    border-radius: 10px;
    position: relative;


    transition: all 3s ease-in;
    cursor: pointer;

    &.big {
        height: 200px;
    }

    &.bigXL {
        height: 275px;
    }

    &.bigXXL {
        height: 375px;
    }



    .content {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        padding: 0 30px;
        font-size: 1.5rem;


        .img-logo {
            height: 70%;
            width: auto;
            max-width: 200px;
            transition: transform 0.5s ease-in;
            will-change: transform;

            @include breakpoint(nm) {
                max-width: 100px;
            }

            object-fit: contain;
        }

        span {
            transition: all 0.5s linear;
            font-size: 22px;
            line-height: 26px;
            color: white;
            font-weight: bold;
        }
    }

    .bg-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        z-index: 1;
        --angle: 90deg;

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 10px;
        mask-image: linear-gradient(var(--angle), #fff, #00000000);
        -webkit-mask-image: linear-gradient(var(--angle), #fff, #00000000);
        mask-size: 100% 100%;

        padding: 10px;
        will-change: --angle;
        transition: --angle 0.5s ease-in;
    }

    .bg-overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 0;
        transition: background-color 0.5s ease-in;

        &.bgDark {
            background-color: rgba(0, 0, 0, 1);
        }
    }

    &:hover {
        .bg-overlay {
            background-color: #000;
        }

        .bg-img {
            --angle: 270deg;
        }

        &.bgDark {
            .bg-img {
                --angle: 180deg;
            }
        }

        .content {
            .img-logo {
                transform: scale(1.3);
            }

            span {
                font-size: 30px;
                line-height: 32px;
                transition: all 0.5s ease-in;
                // transform: translateX(10px);
                text-shadow:
                    1px 1px 2px black,
                    0 0 1em white,
                    0 0 0.2em white;
            }
        }

        &.home {
            .content {
                .img-logo {
                    transform: scale(1.3);
                }
            }
        }
    }

}
</style>