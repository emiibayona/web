const useWhatsapp = () => {
  function parsePhone(phone) {
    if (phone.startsWith(0)) {
      return phone.replace("0", "598");
    }
    return phone;
  }
  function openWhatsApp(
    header,
    content,
    phone = import.meta.env.VITE_PHONE_CONTACT,
  ) {
    const fullyContent = `${header}${content ? "\n" + content : ''}`
    if (window && phone) {
      window.open(
        `https://wa.me/${parsePhone(phone)}?text=${encodeURIComponent(fullyContent)}`,
        "_blank",
      );
    }
  }
  return { openWhatsApp };
};

export default useWhatsapp;
