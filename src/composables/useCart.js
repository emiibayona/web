import { computed, ref, watch } from "vue";
import { useCartStore } from "@/stores/cart";
import { useAuth } from "./useAuth";
import { useToast } from "primevue/usetoast";
import { ACTIVE_GAMES, GAMES, RECIPIENTS_LISTS } from "@/utils/constants.js";
import useSets from "./mtg/useSets";
import { cleanOrUpdateCarts } from "@/utils/cartUtils";
import { useRoute, useRouter } from "vue-router";

const useCarts = (game = GAMES.MAGIC, receptor = RECIPIENTS_LISTS.CART) => {
  const store = useCartStore();
  const { user: loggedUser } = useAuth();
  const { sets } = useSets(game);
  const toast = useToast();
  const route = useRoute();
  const router = useRouter()

  // Gettrs reactivos al Store de Pinia
  const cart = computed(() => store.cart[game]);
  const wishlist = computed(() => store.wishlist[game]);
  const loading = computed(() => store.loading);
  const localLoading = ref(false);

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

  const addYugioh = ({ item, quantity, alert }, recipient, toastOpt) => {
    const newCard = {
      id: item.id,
      qty: quantity,
      name: item.name,
      price: item.price || item?.card_prices[0]?.tcgplayer_price,
      // code: currentSet.code,
      // treatment: itemParsed.treatment,
      maxQty: 9999999,
      image: item?.image?.faceUp || item?.image,
    };
    const indexCard = recipient.findIndex((i) => i.id === item.id);
    if (indexCard !== -1) {
      const itCard = recipient[indexCard];
      itCard.qty += quantity;
    } else {
      recipient.push({
        ...newCard,
        qty: 1
      });
    }

    if (toastOpt && alert) {
      toast.removeAllGroups();
      toast.add({
        ...toastOpt,
        data: {
          image: newCard?.image
        }
      });
    }
  }
  const addMagic = ({ item, quantity, alert }, recipient, toastOpt) => {
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
  }

  const add = ({ item, quantity = 1, alert = true }) => {
    localLoading.value = true;
    if (!loggedUser.value) {
      router.push({ name: "Login" })
      return;
    }
    // debugger;
    const recipient = [...currentRecipient.value]; // Clonamos para mantener inmutabilidad
    let toastOpt = {
      severity: "success",
      summary: "Agregada!",
      detail: `Carta agregada correctamente al ${receptorBox.value}.`,
      data: {
        image: item?.card?.image_uris?.small || item?.card?.image_uris?.normal || item?.image,
      },
      life: 2000,
    };
    switch (game) {
      case GAMES.MAGIC:
        addMagic({ item, quantity, alert }, recipient, toastOpt)
        break;
      case GAMES.YUGIOH:
        addYugioh({ item, quantity, alert }, recipient, toastOpt)
        break;
    }

    store.updateLocal(loggedUser.value?.email, game, receptor, recipient);
    localLoading.value = false;
  };

  const removeYugioh = ({ item, quantity, all, sealed }, recipient, toastOpt) => {
    debugger;
    const indexCard = recipient.findIndex((i) => i.id === item.id);

    if (indexCard !== -1) {
      if (all) {
        recipient.splice(indexCard, 1);
        toastOpt.detail = `Todas las cartas de esa version fueron removidas.`;
      } else {
        const it = recipient[indexCard];
        it.qty -= quantity;

        toastOpt.detail = `${quantity} carta removida`;
        toastOpt.data = {
          image: item?.image?.faceUp || item?.image,
        }
        if (it.qty <= 0) {
          recipient.splice(indexCard, 1);
        }
      }

    }
  }

  const removeMagic = ({ item, quantity, all, sealed }, recipient, toastOpt) => {
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
  }
  const remove = ({ item, quantity = 1, all = false, sealed = false }) => {
    try {


      localLoading.value = true;
      const recipient = [...currentRecipient.value]; // Clonamos para mantener inmutabilidad
      let toastOpt = {
        severity: "success",
        summary: "Removida!",
        detail: `Todas las cartas de esa version fueron removidas.`,
        life: 2000,
      };

      switch (game) {
        case GAMES.MAGIC:
          removeMagic({ item, quantity, all }, recipient, toastOpt)
          break;
        case GAMES.YUGIOH:
          removeYugioh({ item, quantity, all }, recipient, toastOpt)
          break;
      }

      store.updateLocal(loggedUser.value?.email, game, receptor, recipient);

      if (toastOpt) {
        toast.removeAllGroups();
        toast.add(toastOpt);
      }
      localLoading.value = false;
    } catch (error) {
      console.error(error);
      localLoading.value = false;
    }
  };

  const cleanCart = () => {
    currentRecipient.value.splice(0); // Clonamos para mantener inmutabilidad
    store.updateLocal(loggedUser.value?.email, game, receptor, currentRecipient.value.splice(0));
  };

  const calculateTotal = (arr) => {
    if (!Array.isArray(arr)) return 0;

    return arr.reduce((acc, item) => {
      const setsQty = Array.isArray(item.sets)
        ? item.sets.reduce((sum, set) => sum + (Number(set?.qty) || 0), 0)
        : (Number(item?.qty) || 0);

      return acc + setsQty;
    }, 0);
  };

  const allGamesCarts = computed(() => {
    const res = [];
    for (const element of Object.values(GAMES)) {
      res.push({ name: element, values: store.cart?.[element], count: calculateTotal(store.cart?.[element]) })
    }
    return res.filter(x => x.count);
  });
  const allGamesWishlists = computed(() => {
    const res = [];
    for (const element of Object.values(GAMES)) {
      res.push({ name: element, values: store.wishlist?.[element], count: calculateTotal(store.wishlist?.[element]) })
    }
    return res.filter(x => x.count);
  });

  // Watcher para persistencia local automática
  watch(() => store.cart, (newVal) => {
    if (store.isHydrated) {
      console.log("NEW VAL: CART", game, newVal)
      for (const element of Object.values(GAMES)) {
        cleanOrUpdateCarts(loggedUser.value?.email, { cart: true, game: element }, JSON.stringify(newVal[element]))
      }
    }
  }, { deep: true });

  watch(() => store.wishlist, (newVal) => {
    if (store.isHydrated) {
      for (const element of Object.values(GAMES)) {
        cleanOrUpdateCarts(loggedUser.value?.email, { wish: true, game: element }, JSON.stringify(newVal[element]))
      }
    }
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
    allGamesCarts,
    allGamesWishlists,
    init,
    localLoading
  };
};

export default useCarts;