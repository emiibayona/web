import { customRef, useTemplateRef } from "vue";

/**
 *
 * @param {string} templateRef used to know which is the referenced root element
 * @param {*} clicked the value to do the action to close or resize for example, {false} as default
 * @param {ref} target ref from vue to set the close value to resolve the click outside
 * @returns
 */
const useClickOutside = ({ templateRef, target, clicked = false }) => {
  const root = useTemplateRef(templateRef);
  function onDocClick(e) {
    if (!root.value || !e) return;
    if (!root.value.contains(e?.target)) target.value = clicked;
  }
  function setListener() {
    if (document) {
      document.addEventListener("click", onDocClick);
    }
  }

  return {
    setListener,
  };
};

export default useClickOutside;
