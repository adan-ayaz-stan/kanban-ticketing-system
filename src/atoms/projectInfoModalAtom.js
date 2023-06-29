import { atom } from "recoil";

export const projectInfoModalAtom = atom({
  key: "project-info-modal-atom",
  default: {
    project: {},
    modalOpen: false,
  },
});
