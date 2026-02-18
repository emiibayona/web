import { ref, computed, watch } from "vue";
import { GAMES, RECIPIENTS_LISTS } from "@/utils/constants.js";
import useUser from "./useUser";
import { useToast } from "primevue/usetoast";
import useSets from "./mtg/useSets";

const cart = ref(
  Object.values(GAMES).reduce((acc, game) => ({ ...acc, [game]: [] }), {}),
);
const wishlist = ref(
  Object.values(GAMES).reduce((acc, game) => ({ ...acc, [game]: [] }), {}),
);

const useCarts = (
  game = GAMES.MAGIC,
  receptor = RECIPIENTS_LISTS.CART,
  init = true,
) => {
  const loading = ref(true);
  const { user } = useUser();
  const { sets } = useSets(game);
  const toast = useToast();

  const cartKey = computed(
    () => `${RECIPIENTS_LISTS.CART}_${user.value || "guest"}`,
  );
  const wishlistKey = computed(
    () => `${RECIPIENTS_LISTS.WISHLIST}_${user.value || "guest"}`,
  );

  const receptorBox = computed(() =>
    receptor === RECIPIENTS_LISTS.CART ? "carrito" : "wishlist",
  );

  function getCurrentRecipient() {
    if (receptor === RECIPIENTS_LISTS.CART) return cart.value[game];
    if (receptor === RECIPIENTS_LISTS.WISHLIST) return wishlist.value[game];
    throw new Error("Invalid receptor");
  }

  const getCart = (currentGame) =>
    JSON.parse(localStorage.getItem(cartKey.value) || "{}")[currentGame] || [];
  const getWishlist = (currentGame) =>
    JSON.parse(localStorage.getItem(wishlistKey.value) || "{}")[currentGame] ||
    [];

  const getAllCarts = () => {
    return Object.entries(GAMES).map(([name, value]) => {
      const values = getCart(value);
      return {
        name: value,
        values,
        count: calculateTotal(values),
      };
    });
  };

  const getAllWishlists = () => {
    return Object.entries(GAMES).map(([name, value]) => {
      const values = getWishlist(value);
      return {
        name: value,
        values,
        count: calculateTotal(values),
      };
    });
  };

  const allGamesCarts = ref(getAllCarts());
  const allGamesWishlists = ref(getAllWishlists());

  const load = () => {
    if (!init) return;
    loading.value = true;

    cart.value[game] = getCart(game);
    wishlist.value[game] = getWishlist(game);

    loading.value = false;
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

  const add = ({ item, quantity = 1, sealed = false }) => {
    let toastOpt = {
      severity: "success",
      summary: "Agregada!",
      detail: `Carta agregada correctamente al ${receptorBox.value}.`,
      life: 2000,
    };
    const recipient = getCurrentRecipient();

    const itemParsed = parseCard(item);
    const currentSet = sets.value.find((x) => x.code === itemParsed.set);
    const indexCard = recipient.findIndex((i) => i.name === itemParsed.name);

    debugger;
    if (indexCard !== -1) {
      const itCard = recipient[indexCard].sets.find(
        (x) =>
          x.set.code === itemParsed.set && x.treatment === itemParsed.treatment,
      );

      if (!itCard) {
        recipient[indexCard].sets.push({
          qty: quantity,
          set: currentSet,
          code: currentSet.code,
          treatment: itemParsed.treatment,
          maxQty: itemParsed.maxQty,
        });
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
        sets: [
          {
            qty: 1,
            set: currentSet,
            code: currentSet.code,
            treatment: itemParsed.treatment,
            maxQty: itemParsed.maxQty,
          },
        ],
      });
    }

    if (toastOpt) {
      toast.add(toastOpt);
    }
  };

  const remove = ({ item, quantity = 1, all = false, sealed = false }) => {
    let toastOpt = {
      severity: "success",
      summary: "Removida!",
      detail: `Todas las cartas de esa version fueron removidas.`,
      life: 2000,
    };
    const recipient = getCurrentRecipient();
    const itemParsed = parseCard(item);
    const indexCard = recipient.findIndex((i) => i.id === itemParsed.id);

    debugger;
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
      toast.add(toastOpt);
    }
  };

  function calculateTotal(arr) {
    return arr.reduce(
      (prev, curr) =>
        (prev += curr.sets.reduce(
          (prevSet, currSet) => (prevSet += currSet.qty),
          0,
        )),
      0,
    );
  }

  load();

  watch(
    cart,
    (newCart) => {
      if (init && !loading.value) {
        localStorage.setItem(cartKey.value, JSON.stringify(newCart));
        allGamesCarts.value = getAllCarts();
      }
    },
    { deep: true },
  );

  watch(
    wishlist,
    (newWishlist) => {
      if (init && !loading.value) {
        localStorage.setItem(wishlistKey.value, JSON.stringify(newWishlist));
        allGamesWishlists.value = getAllWishlists();
      }
    },
    { deep: true },
  );

  watch(
    () => [cartKey.value, wishlistKey.value],
    () => {
      load();
    },
  );

  return {
    wishlist,
    cart,
    allGamesCarts,
    allGamesWishlists,
    add,
    remove,
    calculateTotal,
    getCart,
    getWishlist,
    getCart,
    getWishlist,
  };
};

export default useCarts;
