import { selector } from "recoil";
import { selectedStandardState, standardsDataState } from "./atoms";

export const selectedStandardSelector = selector({
  key: "selectedStandardSelector",
  get: ({ get }) => {
    const selectedId = get(selectedStandardState);
    const standards = get(standardsDataState);
    return standards.find((standard) => standard.id === selectedId);
  },
});
