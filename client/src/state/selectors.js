import { selector } from "recoil";
import {
  selectedStandardState,
  standardsDataState,
  coursesFilterState,
} from "./atoms";

export const selectedStandardSelector = selector({
  key: "selectedStandardSelector",
  get: ({ get }) => {
    const selectedId = get(selectedStandardState);
    const standards = get(standardsDataState);
    return standards.find((standard) => standard.id === selectedId);
  },
});

export const filteredCoursesSelector = selector({
  key: "filteredCoursesSelector",
  get: ({ get }) => {
    const courses = get(standardsDataState);
    const filters = get(coursesFilterState);

    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesPrice =
        filters.price === "all" ||
        (filters.price === "free" && course.price === 0) ||
        (filters.price === "paid" && course.price > 0) ||
        (filters.price === "under100" && course.price < 100) ||
        (filters.price === "over100" && course.price >= 100);

      return matchesSearch && matchesPrice;
    });
  },
});
