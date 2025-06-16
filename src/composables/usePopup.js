import { ref } from 'vue';

const isPopupVisible = ref(false);

export function usePopup() {
  const showPopup = () => {
    isPopupVisible.value = true;
  };

  const hidePopup = () => {
    isPopupVisible.value = false;
  };

  return { isPopupVisible, showPopup, hidePopup };
}
