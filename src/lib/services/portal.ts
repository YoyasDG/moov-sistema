import "server-only";

import { prisma } from "@/lib/prisma";

export async function getTutorPortalData(userId: string) {
  const [students, notifications] = await Promise.all([
    prisma.student.findMany({
      where: {
        primaryTutorId: userId,
        deletedAt: null,
      },
      include: {
        group: true,
        payments: {
          where: { deletedAt: null },
          orderBy: { dueDate: "desc" },
          take: 8,
        },
        enrollments: {
          where: { deletedAt: null },
          orderBy: { expiresAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.notification.findMany({
      where: {
        audience: { in: ["TUTOR", "ALL"] },
        status: "SENT",
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return { students, notifications };
}
