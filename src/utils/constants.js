export const GAMES = Object.freeze({
  MAGIC: "magic",
  POKEMON: "pokemon",
  YUGIOH: "yugioh",
});

export const NAVIGATION = Object.freeze({
  HOME: { path: "/", name: "Inicio", home: true },
  MAGIC: { path: "/magic", name: "Magic: The Gathering", value: "magic" },
  YUGIOH: { path: "/yugioh", name: "Yu-Gi-Oh!", value: "yugioh" },
  POKEMON: { path: "/pokemon", name: "Pokemon", value: "pokemon" },
  DIGIMON: { path: "/digimon", name: "Digimon", value: "digimon" },
  ABOUT: { path: "/about", name: "Sobre nosotros" },
});

export const RECIPIENTS_LISTS = Object.freeze({
  CART: "cart",
  WISHLIST: "wishlist",
});

export const MTG = Object.freeze({
  COLORS: {
    WHITE: "W",
    BLUE: "U",
    BLACK: "B",
    GREEN: "G",
    RED: "R",
    COLORLESS: "CLS",
  },
});
export const ApiConfig = Object.freeze({
  VUE_APP_API_URL: import.meta.env.VITE_API_URL,
  VUE_APP_API_NAME: "api/",
});
export const ApiURL = `${ApiConfig.VUE_APP_API_URL}/${ApiConfig.VUE_APP_API_NAME}`;
