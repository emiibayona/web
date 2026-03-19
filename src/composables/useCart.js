import { computed, watch } from "vue";
import { useCartStore } from "@/stores/cart";
import { useAuth } from "./useAuth";
import { useToast } from "primevue/usetoast";
import { ACTIVE_GAMES, GAMES, RECIPIENTS_LISTS } from "@/utils/constants.js";
import useSets from "./mtg/useSets";
import { cleanOrUpdateCarts } from "@/utils/cartUtils";

const useCarts = (game = GAMES.MAGIC, receptor = RECIPIENTS_LISTS.CART) => {
  const store = useCartStore();
  const { user: loggedUser, loginWithGoogle } = useAuth();
  const { sets } = useSets(game);
  const toast = useToast();

  // Getters reactivos al Store de Pinia
  const cart = computed(() => store.cart[game]);
  const wishlist = computed(() => store.wishlist[game]);
  const loading = computed(() => store.loading);

  const currentRecipient = computed(() =>
    receptor === RECIPIENTS_LISTS.CART ? store.cart[game] : store.wishlist[game]
  );

  const receptorBox = computed(() =>
    receptor === RECIPIENTS_LISTS.CART ? "carrito" : "wishlist",
  );
  // Inicialización controlada
  const init = async () => {
    if (!store.isHydrated && !store.loading) {
      await store.fetchCart({
        email: loggedUser.value?.email,
        tenant: "geartown",
      });
    }
  };

  const parseCard = (card) => {
    return {
      id: card.cardId || card.id,
      quantity: card.quantity,
      name: card.name,
      condition: card.condition,
      treatment: card.treatment,
      set: card?.card?.set || card?.set,
      maxQty: card.maxQty || card.quantity,
    };
  };

  const add = ({ item, quantity = 1, sealed = false, alert = true }) => {
    if (!loggedUser.value) {
      loginWithGoogle();
      return;
    }
    const recipient = [...currentRecipient.value]; // Clonamos para mantener inmutabilidad
    let toastOpt = {
      severity: "success",
      summary: "Agregada!",
      detail: `Carta agregada correctamente al ${receptorBox.value}.`,
      data: {
        image: item?.card?.image_uris?.small || item?.card?.image_uris?.normal,
      },
      life: 2000,
    };

    const itemParsed = parseCard(item);
    const currentSet = sets.value.find((x) => x.code === itemParsed.set);
    const indexCard = recipient.findIndex((i) => i.name === itemParsed.name);

    const newCard = {
      cardId: itemParsed.id,
      qty: quantity,
      set: currentSet,
      code: currentSet.code,
      treatment: itemParsed.treatment,
      maxQty: itemParsed.maxQty,
      image: item?.image?.faceUp,
    };

    if (indexCard !== -1) {
      const itCard = recipient[indexCard].sets.find(
        (x) =>
          x.set.code === itemParsed.set && x.treatment === itemParsed.treatment,
      );

      if (!itCard) {
        recipient[indexCard].sets.push(newCard);
      } else {
        if (itCard.qty < itCard.maxQty) {
          itCard.qty += quantity;
        } else {
          toastOpt = {
            severity: "error",
            summary: "Maxima cantidad alcanzada",
            detail: `No existen mas de ${itemParsed.maxQty} copias de esa version.`,
            life: 3000,
          };
        }
      }
    } else {
      recipient.push({
        ...itemParsed,
        sets: [{ ...newCard, qty: 1 }],
      });
    }

    if (toastOpt && alert) {
      toast.removeAllGroups();
      toast.add(toastOpt);
    }

    store.updateLocal(loggedUser.value?.email, game, receptor, recipient);
  };

  const remove = ({ item, quantity = 1, all = false, sealed = false }) => {
    const recipient = [...currentRecipient.value]; // Clonamos para mantener inmutabilidad
    let toastOpt = {
      severity: "success",
      summary: "Removida!",
      detail: `Todas las cartas de esa version fueron removidas.`,
      life: 2000,
    };

    const itemParsed = parseCard(item);
    const indexCard = recipient.findIndex((i) => i.id === itemParsed.id);

    if (indexCard !== -1) {
      const setIndex = recipient[indexCard].sets.findIndex(
        (x) =>
          x.code === itemParsed.set && x.treatment === itemParsed.treatment,
      );
      if (all) {
        recipient[indexCard].sets.splice(setIndex, 1);
        toastOpt.detail = `Todas las cartas de esa version fueron removidas.`;
      } else {
        if (setIndex !== -1) {
          const it = recipient[indexCard].sets[setIndex];
          it.qty -= quantity;

          toastOpt.detail = `${quantity} carta removida de esa version.`;

          if (it.qty <= 0) {
            recipient[indexCard].sets.splice(setIndex, 1);
          }
        }
      }
      if (!recipient[indexCard].sets.length) {
        recipient.splice(indexCard, 1);
      }
    }

    if (toastOpt) {
      toast.removeAllGroups();
      toast.add(toastOpt);
    }
    store.updateLocal(loggedUser.value?.email, game, receptor, recipient);
  };

  const cleanCart = () => {
    currentRecipient.value.splice(0); // Clonamos para mantener inmutabilidad
    store.updateLocal(loggedUser.value?.email, game, receptor, currentRecipient.value.splice(0));
  };
  const calculateTotal = (arr) => {
    if (!Array.isArray(arr)) return 0;
    return arr?.reduce((acc, curr) => acc + curr?.sets?.reduce((s, c) => s + c?.qty, 0), 0);
  };

  // Watcher para persistencia local automática
  watch(() => store.cart, (newVal) => {
    cleanOrUpdateCarts(loggedUser.value?.email, { cart: true }, JSON.stringify(newVal[game]))
  }, { deep: true });

  watch(() => store.wishlist, (newVal) => {
    cleanOrUpdateCarts(loggedUser.value?.email, { wish: true }, JSON.stringify(newVal[game]))
  }, { deep: true });

  // Ejecutamos la lógica de carga al usar el composable
  init();

  return {
    cart,
    wishlist,
    loading,
    add,
    remove,
    cleanCart,
    calculateTotal,
    allGamesCarts: computed(() => [{ name: game, values: store.cart?.[game], count: calculateTotal(store.cart?.[game]) }]),
    allGamesWishlists: computed(() => [{ name: game, values: store.wishlist?.[game], count: calculateTotal(store.wishlist?.[game]) }]),
    init,
  };
};

export default useCarts;