import { describe, expect, it } from "vitest";
import { WHATSAPP_NUMBER, getWhatsAppLink } from "../../shared/contact";

describe("contact links", () => {
  it("builds the configured WhatsApp handoff URL", () => {
    const link = getWhatsAppLink("Hello from a consultation request");

    expect(WHATSAPP_NUMBER).toBe("8801960481983");
    expect(link).toBe(
      "https://wa.me/8801960481983?text=Hello%20from%20a%20consultation%20request",
    );
  });
});
