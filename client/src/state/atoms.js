import { atom } from "recoil";

export const selectedStandardState = atom({
  key: "selectedStandardState",
  default: 1,
});

export const mobileMenuState = atom({
  key: "mobileMenuState",
  default: false,
});

export const standardsDataState = atom({
  key: "standardsDataState",
  default: [
    {
      id: 1,
      title: "Standard One",
      description:
        "Standard 1 is a foundation Standard that reflects 7 important concepts...",
    },
    {
      id: 2,
      title: "Standard Two",
      description:
        "Standard 2 is a foundation Standard that reflects 7 important concepts...",
    },
    {
      id: 3,
      title: "Standard Three",
      description:
        "Standard 3 is a foundation Standard that reflects 7 important concepts...",
    },
    {
      id: 4,
      title: "Standard Four",
      description:
        "Standard 4 is a foundation Standard that reflects 7 important concepts...",
    },
    {
      id: 5,
      title: "Standard Five",
      description:
        "Standard 5 is a foundation Standard that reflects 7 important concepts...",
    },
    {
      id: 6,
      title: "Standard Six",
      description:
        "Standard 6 is a foundation Standard that reflects 7 important concepts...",
    },
    {
      id: 7,
      title: "Standard Seven",
      description:
        "Standard 7 is a foundation Standard that reflects 7 important concepts...",
    },
    {
      id: 8,
      title: "Standard Eight",
      description:
        "Standard 8 is a foundation Standard that reflects 7 important concepts...",
    },
  ],
});
