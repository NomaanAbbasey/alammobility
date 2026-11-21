const phone = process.env.NEXT_PUBLIC_BOOKING_PHONE?.trim();
const dialNumber = phone?.replace(/[^+\d]/g, "");
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export const bookingPhone = phone && dialNumber && /\d/.test(dialNumber)
  ? { label: phone, href: `tel:${dialNumber}` }
  : undefined;
export const contactEmail = email ? { label: email, href: `mailto:${email}` } : undefined;
