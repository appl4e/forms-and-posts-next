// This file implements the Singleton pattern for the PrismaClient.
// This is essential in Next.js development (hot-reloading) to prevent
// generating a new PrismaClient instance with every file save, which
// can lead to excessive database connections.
import { PrismaClient } from "@/generated/prisma";

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}
// 1. Check if a global instance exists (it exists after the first hot reload)
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	// In production, we always create a fresh instance.
	prisma = new PrismaClient();
} else {
	// In development, we use the global instance to prevent multiple connections.
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

export const db = prisma;
