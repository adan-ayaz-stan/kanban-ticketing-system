const { atom } = require("recoil");

export const taskDetailsModalAtom = atom({
  key: "task-details-modal-atom",
  default: {
    modalOpen: false,
    task: {},
    taskAssignee: {},
  },
});
