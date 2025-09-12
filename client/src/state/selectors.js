import { selector } from "recoil";
import {
  selectedStandardState,
  standardsDataState,
  coursesState,
  filtersState,
  cartState,
  userState,
} from "./atoms";

export const selectedStandardSelector = selector({
  key: "selectedStandardSelector",
  get: ({ get }) => {
    const selectedId = get(selectedStandardState);
    const standards = get(standardsDataState);
    return standards.find((standard) => standard._id === selectedId);
  },
});

export const filteredCoursesSelector = selector({
  key: "filteredCoursesSelector",
  get: ({ get }) => {
    const { courses } = get(coursesState);
    const filters = get(filtersState);

    let filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === "all" || course.category === filters.category;
      const matchesLevel =
        filters.level === "all" || course.level === filters.level;
      const matchesInstructor =
        filters.instructor === "all" ||
        course.instructor === filters.instructor;

      const matchesPrice =
        filters.price === "all" ||
        (filters.price === "free" && course.price === 0) ||
        (filters.price === "paid" && course.price > 0) ||
        (filters.price === "under50" && course.price < 50) ||
        (filters.price === "50-100" &&
          course.price >= 50 &&
          course.price <= 100) ||
        (filters.price === "over100" && course.price > 100);

      const matchesRating =
        filters.rating === "all" || course.rating >= parseFloat(filters.rating);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel &&
        matchesPrice &&
        matchesRating &&
        matchesInstructor
      );
    });

    // Apply sorting
    switch (filters.sortBy) {
      case "popular":
        filtered.sort((a, b) => b.students - a.students);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
        break;
      default:
        break;
    }

    return filtered;
  },
});

export const cartTotalSelector = selector({
  key: "cartTotalSelector",
  get: ({ get }) => {
    const cart = get(cartState);
    const subtotal = cart.items.reduce((total, item) => total + item.price, 0);
    return subtotal - cart.discount;
  },
});

export const cartItemCountSelector = selector({
  key: "cartItemCountSelector",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.items.length;
  },
});

export const isAuthenticatedSelector = selector({
  key: "isAuthenticatedSelector",
  get: ({ get }) => {
    const user = get(userState);
    return user.isAuthenticated;
  },
});
