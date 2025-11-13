"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function syncUser() {
  try {
    const user = await currentUser();
    if (!user) return;

    // check if user already exists
    let existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (existingUser) return existingUser;

    // create new user
    existingUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
        phone: user.phoneNumbers?.[0]?.phoneNumber ?? undefined,
      },
    });

    return existingUser;
  } catch (error) {
    console.error("Error in syncUser server action:", error);
    throw error; // re-throw so calling code can handle it if needed
  }
}
