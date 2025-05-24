import type { RedirectState } from "./types";

export const state = (): RedirectState => ({
  redirectUrl: "",
  previousPath: "",
});
