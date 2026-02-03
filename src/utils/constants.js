export const GAMES = Object.freeze({
  MAGIC: "magic",
  POKEMON: "pokemon",
  YUGIOH: "yugioh",
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
  //   VUE_APP_API_URL: "https://artile.api.plantabaja.vip",
  VUE_APP_API_URL: "http://localhost:8081",
  VUE_APP_API_NAME: "api/",
});
export const ApiURL = `${ApiConfig.VUE_APP_API_URL}/${ApiConfig.VUE_APP_API_NAME}`;
