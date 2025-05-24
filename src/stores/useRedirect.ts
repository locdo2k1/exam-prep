import { defineStore } from "pinia";
import { state } from "./modules/redirect/state";

export const useRedirectStore = defineStore("redirect", {
  state,
  actions: {
    setRedirectUrl(url: string) {
      this.redirectUrl = url;
    },
    setPreviousPath(path: string) {
      this.previousPath = path;
    },
    clearRedirect() {
      this.redirectUrl = "";
      this.previousPath = "";
    },
  },
  getters: {
    getRedirectUrl: (state) => state.redirectUrl || "/",
    getPreviousPath: (state) => state.previousPath,
  },
});
