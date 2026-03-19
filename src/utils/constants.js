export const GAMES = Object.freeze({
  MAGIC: "magic",
  POKEMON: "pokemon",
  YUGIOH: "yugioh",
  RIFTBOUND: "riftbound",
});

export const ACTIVE_GAMES = Object.values(GAMES).filter(x => x === "magic")

export const NAVIGATION = Object.freeze({
  HOME: { path: "/", name: "Inicio", home: true },
  MAGIC: {
    key: "magic",
    path: "magic",
    name: "Magic: The Gathering",
    value: "magic",
    logo: "https://cojhmla8jrdbluto.public.blob.vercel-storage.com/images/logos/magic.png",
    bg: {
      src: "https://images.ctfassets.net/s5n2t79q9icq/5Zat5j3qjx5diCvkurjKJG/6b3fa29fcd881e4080fd44a9db863bd4/fbnjsdoepqbueupnejiadvsd_1920x700.jpg?q=80",
      position: "top",
    },
  },
  YUGIOH: {
    key: "yugioh",
    path: "yugioh",
    name: "Yu-Gi-Oh!",
    value: "yugioh",
    logo: "https://cojhmla8jrdbluto.public.blob.vercel-storage.com/images/logos/yugioh3.png",
    bg: {
      src: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/08/yugioh-1.jpg?w=1200&h=675&fit=crop",
      position: "center",
    },
  },
  POKEMON: {
    key: "pokemon",
    path: "pokemon",
    name: "Pokemon",
    value: "pokemon",
    logo: "https://cojhmla8jrdbluto.public.blob.vercel-storage.com/images/logos/pokemon.png",
    bg: {
      src: "https://champions.pokemon.com/_images/global/header/header-lg.jpg",
      position: "top",
    },
  },
  RIFTBOUND: {
    key: "riftbound",
    path: "riftbound",
    name: "Riftbound",
    value: "riftbound",
    logo: "https://cojhmla8jrdbluto.public.blob.vercel-storage.com/images/logos/riftbound2.png",
    bg: { src: "/images/riftbound/rift-banner.png", position: "top" },
  },
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
  VUE_AUTH_APP_API_URL: import.meta.env.VITE_AUTH_API_URL,
  VUE_APP_API_URL: import.meta.env.VITE_API_URL,
  VUE_APP_API_NAME: "api/",
});
export const ApiURL = `${ApiConfig.VUE_APP_API_URL}/${ApiConfig.VUE_APP_API_NAME}`;
export const AuthApiURL = `${ApiConfig.VUE_AUTH_APP_API_URL}/${ApiConfig.VUE_APP_API_NAME}`;
