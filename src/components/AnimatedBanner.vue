<template>
    <div class="ab-wrapper" :class="{ big }"
        @click="path ? router.push(route.fullPath + (route.fullPath.endsWith('/') ? '' : '/') + path) : null">
        <div class="content">
            <span v-if="text">{{ text }}</span>
            <img v-if="img" class="img-logo" :src="img" alt="Right Image" />
        </div>
        <!-- </div> -->
        <div v-if="bg" class="bg-img" :style="{ backgroundImage: `url(${bg})` }"></div>
        <div class="bg-overlay"></div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
defineProps({
    text: {
        type: String,
        default: null,
    },
    img: {
        type: String,
        default: null,
    },
    bg: {
        type: String,
        default:
            "null",
    },
    big: {
        type: Boolean,
        default: false,
    },
    path: {
        type: String,
        default: null,
    },
});
const route = useRoute();
const router = useRouter();
</script>

<style lang="scss" scoped>
.ab-wrapper {
    --angle: 45deg;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    // max-width: 300px;

    height: 100px;
    border-radius: 10px;
    position: relative;


    transition: all 3s ease-in-out;
    cursor: pointer;

    &.big {
        height: 200px;
    }

    &:hover {
        .bg-img {
            animation: rotateMask 1.5s linear forwards;
            filter: brightness(1.2);
            transition: filter 0.5s ease-in-out;
        }

        .content {
            .img-logo {
                transform: scale(1.3);
                transition: transform 0.5s ease-in-out;
            }

            span {
                font-size: 1.8rem;
                transition: all 0.5s ease-in-out;
                transform: translateX(10px);
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
            object-fit: contain;
        }

        span {
            font-size: 1.4rem;
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

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 10px;
        mask-image: linear-gradient(var(--angle), #fff, #0000);
        -webkit-mask-image: linear-gradient(var(--angle), #fff, #0000);
        mask-size: 100% 100%;

        padding: 10px;
    }

    .bg-overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background-color: black;
        z-index: 0;
    }

    @keyframes rotateMask {
        from {
            mask-size: 100% 100%;
        }

        to {
            mask-size: 200% 100%;
        }
    }
}
</style>