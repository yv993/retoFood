"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import {
  updateOrderStatus,
  updateReservationStatus,
  updateCateringStatus,
  updateNewsletterStatus,
  updateGiftCardStatus,
  type OrderStatus,
  type ReservationStatus,
  type InquiryStatus,
  type GiftCardStatus,
  type NewsletterSignup,
} from "@/lib/db";
import {
  sendOrderStatusEmail,
  sendReservationStatusEmail,
  sendCateringStatusEmail,
} from "@/lib/notify";

export async function updateStatus(formData: FormData) {
  if (!(await isAdmin())) return;

  const model = String(formData.get("model") ?? "");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!model || !id || !status) return;

  switch (model) {
    case "orders": {
      const rec = await updateOrderStatus(id, status as OrderStatus);
      if (rec) await sendOrderStatusEmail(rec);
      break;
    }
    case "reservations": {
      const rec = await updateReservationStatus(id, status as ReservationStatus);
      if (rec) await sendReservationStatusEmail(rec);
      break;
    }
    case "catering": {
      const rec = await updateCateringStatus(id, status as InquiryStatus);
      if (rec) await sendCateringStatusEmail(rec);
      break;
    }
    case "newsletter":
      await updateNewsletterStatus(id, status as NewsletterSignup["status"]);
      break;
    case "gift-cards":
      await updateGiftCardStatus(id, status as GiftCardStatus);
      break;
    default:
      return;
  }

  revalidatePath(`/admin/${model}`);
  revalidatePath(`/admin/${model}/${id}`);
  revalidatePath("/admin");
}
