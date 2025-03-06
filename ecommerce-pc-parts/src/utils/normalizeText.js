export const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD') // Descomponer caracteres con tildes (por ejemplo, "á" se convierte en "a" + el acento)
      .replace(/[\u0300-\u036f]/g, ''); // Eliminar los signos diacríticos (tildes, etc.)
  };