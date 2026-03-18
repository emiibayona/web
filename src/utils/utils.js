export function capitalizeFirstLetter(string) {
  if (!string) return string; // Handle empty or null strings safely
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export const fieldIsEmpty = (field) =>
  field === "" || field === null || field === undefined;

export const parseList = (inputText) => {
  return inputText
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      // 1. Buscamos la cantidad (primer número)
      const qtyMatch = line.match(/^(\d+)/);
      const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : undefined;

      // 2. Buscamos el Set entre paréntesis (ej: 40K)
      const setMatch = line.match(/\((.*?)\)/);
      const set = setMatch ? setMatch[1] : undefined;

      // 3. Buscamos el número de coleccionista (el número después del set)
      // Puede ser un número simple o un formato como TMP-294
      const collectorMatch = line.match(/\)\s+([\d\w-]+)/);
      const collectorNumber = collectorMatch ? collectorMatch[1] : undefined;

      // 4. Buscamos el tratamiento especial entre asteriscos (F, E, etc.)
      const treatmentMatch = line.match(/\*(.*?)\*/);
      let treatment = "";
      if (treatmentMatch) {
        const t = treatmentMatch[1].toUpperCase();
        treatment = t === "F" ? "foil" : t === "E" ? "etched" : t;
      }

      // 5. El nombre es lo que queda entre la cantidad y el paréntesis del set
      const nameMatch = line.match(/^\d+\s+(.*?)\s+\(/);
      const name = nameMatch ? nameMatch[1].trim() : undefined;

      return {
        quantity,
        name,
        set: set?.toLowerCase(),
        collectorNumber,
        treatment,
      };
    });
};

export const assembleList = (parsedList) => {
  return parsedList.map(
    ({ quantity, name, set, collectorNumber, treatment }) => {
      let line = "";
      if (quantity !== undefined) line += quantity + " ";
      if (name) line += name + " ";
      if (set) line += `(${set.toUpperCase()}) `;
      if (collectorNumber) line += collectorNumber + " ";
      if (treatment) line += `*${treatment.charAt(0).toUpperCase()}*`;
      return line.trim();
    },
  );
};
