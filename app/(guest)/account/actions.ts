"use server";

import { adminAuth } from "@/lib/firebase-admin";
import { updateUser, getUserById } from "@/lib/firestore";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) throw new Error("Unauthorized");
  
  const decoded = await adminAuth.verifyIdToken(token);
  
  const firstName = formData.get("firstName") as string;
  const lastName  = formData.get("lastName") as string;
  const phone     = formData.get("phone") as string;

  const user = await getUserById(decoded.uid);

  const updates: any = {
    firstName,
    lastName,
    updatedAt: new Date().toISOString()
  };

  if (!user?.phone && phone) {
    updates.phone = phone;
  }

  await updateUser(decoded.uid, updates);

  revalidatePath("/account");
}
