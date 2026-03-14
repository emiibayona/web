<template>
    <div class="h-full flex flex-col justify-between">
        <slot></slot>

        <footer class="footer">
            <div class="footer-content">
                <div class="grid  gap-5 grid-cols-1 nm:grid-cols-2 ">
                    <div class="h-full">
                        <div class="flex flex-col gap-4 justify-center h-full">
                            <a href="https://www.instagram.com/geartowntcg/" target="_blank"
                                class="flex flex-row items-center gap-2 animated"><img src="/images/instagram.png"
                                    class="w-10 h-10" /><span class="">Vísitanos en nuestro Instagram</span></a>
                            <span class="flex flex-row items-center gap-2 animated hover:cursor-pointer"
                                @click="toWpp"><img src="/images/whatsapp.png" class="w-10 h-10" /><span
                                    class="">Contáctanos por
                                    Whatsapp</span></span>
                            <!-- <a class="flex flex-row items-center gap-2 animated"
                            href="https://maps.app.goo.gl/MZcJUUJixqqfeK1V8" target="_blank"><img src="/images/map.png"
                                class="w-6 h-6" /><span class="">Nuestra ubicación</span></a> -->

                        </div>
                    </div>
                    <div class="h-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d363.3535472490016!2d-54.959908165730226!3d-34.90831793115661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95751bb0b2b57df9%3A0x1fbfbd9355fca9a3!2sGeartown!5e0!3m2!1ses!2suy!4v1773450422347!5m2!1ses!2suy"
                            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
                <p class="footer-text pt-4">
                    © <span id="year">2019-2026</span> Geartown TCG Club. Todos los derechos reservados.
                </p>
                <p class="footer-text small">
                    Created by <a href="https://linkedin.com/in/emiliano-bayona/" target="_blank"
                        rel="noopener noreferrer">Emiliano Bayona</a>
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup>
function toWpp() {
    window.open(`https://wa.me/${import.meta.env.VITE_CONTACT_PHONE}?text=Hola, vine a través de su web, quería hacer unas consultas!!!`, '_blank');
}
</script>

<style lang="scss" scoped>
.footer {
    background-color: #1a1a2e;
    color: #e0e0e0;
    padding: 2rem 1rem;
    border-top: 1px solid #16213e;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}

.footer-text {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    line-height: 1.6;

    &.small {
        font-size: 10px;
        line-height: 12px;
    }

    a {
        color: #00d4ff;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
            color: #00f0ff;
            text-decoration: underline;
        }
    }
}
</style>