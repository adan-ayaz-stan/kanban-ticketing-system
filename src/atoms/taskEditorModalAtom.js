import { atom } from "recoil";

export const taskEditorModalAtom = atom({
  key: "task-editor-modal-atom",
  default: {
    modalOpen: false,
    task: {},
  },
});
