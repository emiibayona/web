import { GAMES } from "@/utils/constants";
import { capitalizeFirstLetter } from "@/utils/utils";
import { computed } from "vue";

const useAdmin = () => {
    const pagesByGame = {
        magic: [
            { path: "magic/collection", button: "Colección" },
            { path: "magic/ventas", button: "Ventas de singles" },
            { path: "magic/sellado?game=magic", button: "Panel de Sellados" },
            { path: "magic/binders", button: "Panel de Binders" }
        ],
        pokemon: [{ path: "pokemon/sellado?game=pokemon", button: "Panel de Sellados" }],
        yugioh: [
            { path: "yugioh/sellado?game=yugioh", button: "Panel de Sellados" },
            { path: "yugioh/ventas", button: "Ventas de singles" }
        ],
        riftbound: [{ path: "riftbound/sellado?game=riftbound", button: "Panel de Sellados" }]
    }

    const actionsByGame = computed(() => {
        const games = Object.values(GAMES).map((x, index) => {
            const pages = pagesByGame[x] || []
            return {
                index,
                game: x,
                name: x,
                pages,
                count: pages.length
            }
        })
        return games;
    })

    const games = computed(() => Object.values(GAMES).map(x => ({ button: capitalizeFirstLetter(x), game: x, path: `admin/${x}` })))

    return { pagesByGame, actionsByGame, games };

}

export default useAdmin;