import { onMounted } from "vue";

const useBeauty = (id, enabled, options = {}) => {
    let activeCard = null;
    let originalCard = null;
    let activeClone = null;
    let overlay = null;
    let app = null;

    function hightlightComponent() {
        if (!enabled || !activeCard) return;

        originalCard = activeCard;
        const rect = activeCard.getBoundingClientRect();



        const clone = activeCard.cloneNode(true);
        activeClone = clone;
        activeCard.style.visibility = 'hidden';

        Object.assign(clone.style, {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            // height: `${rect.height}px`,
            margin: '0',
            zIndex: '1000',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        });


        app.appendChild(clone);
        overlay.classList.add('active');

        requestAnimationFrame(() => {
            clone.style.top = '50%';
            clone.style.left = '50%';
            clone.style.transform = 'translate(-50%, -50%)';
            clone.style.width = options.width || clone.style.width;
            clone.style.height = options.height || clone.style.height;

        });

    }


    onMounted(() => {
        setTimeout(() => {
            if (!enabled) return;
            if (document) {
                activeCard = document.getElementById(id);
                overlay = document.getElementById('overlay');
                app = document.getElementById("app");

                overlay.addEventListener('click', () => {
                    if (activeClone && originalCard) {
                        const rect = originalCard.getBoundingClientRect();

                        // Volver a la posición de la original
                        activeClone.style.top = `${rect.top}px`;
                        activeClone.style.left = `${rect.left}px`;
                        activeClone.style.transform = 'translate(0, 0)';
                        activeClone.style.width = `${rect.width}px`;
                        // activeClone.style.height = `${rect.height}px`;


                        // Limpieza al terminar la animación
                        activeClone.addEventListener('transitionend', () => {
                            originalCard.style.visibility = 'visible';
                            activeClone.remove();
                            activeClone = null;
                            originalCard = null;
                        }, { once: true });
                        overlay.classList.remove('active');
                    }
                });
            }
        }, 1000)

    })

    return { hightlightComponent }
}

export default useBeauty;