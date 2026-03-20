import { defineStore } from "pinia";
import { ref } from "vue";
import { GAMES, RECIPIENTS_LISTS, ACTIVE_GAMES } from "@/utils/constants.js";
import CartService from "@/services/CartService";

export const useCartStore = defineStore("cart", () => {
    const cart = ref(
        ACTIVE_GAMES
            .reduce((acc, game) => ({ ...acc, [game]: [] }), {}),
    );
    const wishlist = ref(
        ACTIVE_GAMES
            .reduce((acc, game) => ({ ...acc, [game]: [] }), {}),
    );
    const isHydrated = ref(false);
    const loading = ref(false);

    // Guardamos la promesa para evitar colisiones de llamadas simultáneas
    let loadPromise = null;

    async function fetchCart({ email, tenant, force = false }) {
        if (!email) return;
        if (isHydrated.value && !force) return;
        if (loadPromise) return loadPromise;

        loadPromise = (async () => {
            loading.value = true;
            try {
                for (const game of ACTIVE_GAMES) {


                    const cartKey = `${game}_${RECIPIENTS_LISTS.CART}_${email || 'guest'}`
                    const wishKey = `${game}_${RECIPIENTS_LISTS.WISHLIST}_${email || 'guest'}`

                    const itemCart = JSON.parse(sessionStorage.getItem(cartKey) || `[]`);
                    const itemWhishlist = JSON.parse(sessionStorage.getItem(wishKey || `[]`));


                    if (!itemCart?.length) {
                        const responseCart = await CartService.fetch({
                            type: 'cart',
                            info: { email, tenant, game }
                        });

                        // Hidratamos el estado global
                        if (responseCart) {
                            cart.value[game] = JSON.parse(responseCart?.data || []);
                            localStorage.setItem(cartKey + '_ID', responseCart?.id)
                        }

                    } else {
                        cart.value[game] = itemCart;
                    }

                    if (!itemWhishlist?.length) {
                        const responseWish = await CartService.fetch({
                            type: 'wishlist',
                            info: { email, tenant, game }
                        });

                        // Hidratamos el estado global
                        if (responseWish) {
                            wishlist.value[game] = JSON.parse(responseWish?.data || []);
                            localStorage.setItem(wishKey + '_ID', responseWish?.id)
                        }

                    } else {
                        wishlist.value[game] = itemWhishlist;
                    }

                    isHydrated.value = true;
                }
            } catch (error) {
                console.error("Error al hidratar el carrito:", error);
            } finally {
                loading.value = false;
                loadPromise = null;
            }
        })();

        return loadPromise;
    }

    const updateCart = async (id, value) => {
        return await CartService.update(id, value)
    }

    async function updateLocal(email, game, type, newData) {
        const res = await updateCart(localStorage.getItem(`${game}_${RECIPIENTS_LISTS.CART}_${email || 'guest'}_ID`), { data: newData });
        if (type === RECIPIENTS_LISTS.CART)
            cart.value[game] = newData;
        else wishlist.value[game] = newData;
    }

    return {
        cart,
        wishlist,
        loading,
        isHydrated,
        fetchCart,
        updateLocal,
    };
});