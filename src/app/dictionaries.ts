import "server-only";

const getViDictionary = () =>
  import("./dictionaries/vi.json").then((module) => module.default);

export const getDictionary = async () => {
  return getViDictionary();
};
