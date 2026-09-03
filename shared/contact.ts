export const WHATSAPP_NUMBER = "8801960481983";
export const WHATSAPP_MESSAGE = "Hello Heaven Furniture Mart, I'd like to discuss a project.";

export function getWhatsAppLink(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
