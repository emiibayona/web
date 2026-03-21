import { ACTIVE_GAMES, RECIPIENTS_LISTS } from "./constants";

export function cleanOrUpdateCarts(email, { cart = false, wish = false, user = false }, val) {
    if (!sessionStorage || !localStorage) return;
    for (const game of ACTIVE_GAMES) {
        if (cart) {
            sessionStorage.setItem(`${game}_${RECIPIENTS_LISTS.CART}_${email || 'guest'}`, val);
        }
        if (wish) {
            sessionStorage.setItem(`${game}_${RECIPIENTS_LISTS.WISHLIST}_${email || 'guest'}`, val);
        }
        if (user) {
            localStorage.removeItem(`${game}_${RECIPIENTS_LISTS.CART}_${email || 'guest'}_ID`)
            localStorage.removeItem(`${game}_${RECIPIENTS_LISTS.WISHLIST}_${email || 'guest'}_ID`)
        }
    }
}