<template>
    <div class="decoration-wrapper">
        <div class="images-wrapper">
            <img v-for="src in [1, 2, 3]" :key="index" :src="`/images/${game}/${src}.png`" class="images-content" />
            <div v-if="logo" class="images-wrapper-logo">
                <img :src="logo" class="image-logo" />
            </div>
        </div>
        <div class="bar">
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

defineProps({ game: { type: String, default: "magic" }, logo: { type: String, default: null } })


onMounted(() => {
    const wrapper = document.querySelector('.images-wrapper');
    const images = Array.from(wrapper.querySelectorAll('.images-content'));

    function shuffleAndRestart() {
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }
        images.forEach(img => {
            wrapper.appendChild(img);
            img.style.animation = 'none';
            img.offsetHeight;
            img.style.animation = '';
        });
    }
    setInterval(shuffleAndRestart, 14000);
    shuffleAndRestart();
})
</script>

<style lang="scss" scoped>
.decoration-wrapper {
    width: 100%;
    height: 125px;
    @include flex(column, flex-start, flex-start);
    position: relative;
    overflow: hidden;

    .bar {
        width: 100%;
        height: 20%;
        position: absolute;
        bottom: 0;
        // background: rgba(0, 0, 0, 0.8);
        background: #B88B3C;
        z-index: 0;
        animation: barOpening 1s ease-out;
        animation-fill-mode: forwards;
    }

    @keyframes barOpening {
        0% {
            width: 0%;
            height: 0%;
        }

        100% {
            width: 100%;
            height: 20%;
        }

    }

    .images-wrapper {

        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
        bottom: 0;

        // display: flex;
        // justify-content: center;
        // align-items: center;
        // min-height: 150px;
        // /* Ajusta según tus imágenes */

        @include flex(row, center, center);
        gap: 10px;

        &-logo {
            width: 0%;
            @include flex(row, center, center);
            height: 100%;
            // transform: translateY(0) translateX(-100%);
            animation: logoSlide 1.5s ease-out;
            opacity: 0;
            // position: absolute;
            // left: 0;
            animation-fill-mode: forwards;

            .image-logo {
                align-self: center;
                height: 120%;
                // top: 50%;
            }
        }

        .images-content {
            // box-shadow: 2px 5px 15px rgba(0, 0, 0, 0.4);
            // border-radius: 4px;
            // border: 1px solid rgba(255, 255, 255, 0.1);
            @include flex(row, center, center);
            height: 100%;
            width: 150px;
            object-fit: contain;
            // width: 40px;
            // background: rgba(255, 0, 0, 0.3);


            position: absolute;
            left: 0;
            // top: 50%;
            transform: translateY(0) translateX(-200px);
            /* Empiezan fuera */
            opacity: 0;
            /* La animación ahora dura un ciclo largo y se queda al final */
            animation: slideAndStay 10s ease-out;
            // animation-fill-mode: both;


            &:nth-child(1) {
                --dest: 0px;
                animation-delay: 0s;
                --dest-out: -calc(--dest * 4);
                // background: rgba(255, 0, 0, 0.3);
            }

            &:nth-child(2) {
                --dest: 90px;
                animation-delay: 2s;
                --dest-out: -calc(--dest * 4);
                // background: rgba(255, 0, 255, 0.3);
            }

            &:nth-child(3) {
                --dest: 180px;
                --dest-out: ;
                animation-delay: 4s;
                --dest-out: -calc(--dest * 4);
                // background: rgba(255, 255, 0, 0.3);
            }
        }
    }

    @keyframes logoSlide {
        0% {
            // justify-content: flex-start;

            width: 0%;
            // transform: translateY(0) translateX(-200px);
            opacity: 0;

            // .image-logo {
            height: 0;
            // }
        }

        100% {
            width: 100%;
            // transform: translateY(0) translateX(50%);
            opacity: 1;

            // img {
            height: 100%;
            // }
        }
    }

    @keyframes slideAndStay {
        0% {
            transform: translateY(0) translateX(-200px);
            opacity: 0;
        }

        10% {
            transform: translateY(0) translateX(var(--dest));
            opacity: 1;
        }

        /* Entra */
        80% {
            transform: translateY(0) translateX(var(--dest));
            opacity: 1;
        }

        /* Se queda quieta */
        90% {
            transform: translateY(0) translateX(var(--dest));
            opacity: 0;
        }

        /* Sale por la derecha */
        100% {
            transform: translateY(0) translateX(var(--dest-out));
            opacity: 0;
        }

        /* Reset */
    }
}
</style>
