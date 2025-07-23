import { PrismaClient, ProjectStatus } from '@prisma/client';
const prisma = new PrismaClient();

export const employeeService = {
  
  getSettings: async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId },include: { company: true }, });
    if (!user) return null;
    return {
      fullName: user.name,
      email: user.email,
      countryCode: user.countrycode || '',
      contact: user.contact|| '',
      company: user.company?.name ?? '',
      notifications: user.notifications || { dailyReports: false, stressAlerts: false },
    };
  },
  updateSettings: async (userId: number, updates: any) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: updates.fullName,
        email: updates.email,
        countrycode: updates.countryCode,
        contact: updates.contact,
        notifications: updates.notifications,
      },
    });
  },

  getWorkSummary: async (userId: number, period: 'day' | 'week' | 'month') => {
    // Calculate start date based on period
    let startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);

    // Fetch sessions for the user in the period
    const sessions = await prisma.workSession.findMany({
      where: {
        userId,
        startTime: { gte: startDate }
      }
    });


    // Group by day
    const summaryMap: Record<string, { hours: number; productivity: number[] }> = {};
    sessions.forEach(session => {
      const date = session.startTime.toISOString().split('T')[0];
      const duration = session.endTime && session.startTime
        ? (session.endTime.getTime() - session.startTime.getTime()) / 3600000
        : 0;
      if (!summaryMap[date]) summaryMap[date] = { hours: 0, productivity: [] };
      summaryMap[date].hours += duration;
      // Calculate productivity percentage for this session
      const total = session.productive + session.unproductive + session.undefined || 1;
      const productivity = (session.productive / total) * 100;
      summaryMap[date].productivity.push(productivity);
    });

    // Convert to array
    return Object.entries(summaryMap).map(([date, { hours, productivity }]) => ({
      date,
      hours: Number(hours.toFixed(2)),
      productivity: Math.round(
        productivity.reduce((a, b) => a + b, 0) / (productivity.length || 1)
      ),
    })).sort((a, b) => a.date.localeCompare(b.date));
  },

  getProjectsByEmployee: async (employeeId: number) => {
    return prisma.projectAssignment.findMany({
      where: { userId: employeeId },
      select: {
        id: true,
        projectName: true,
        status: true,
        githubLink: true,
      }
    });
  },

  submitProject: async (projectId: number, githubLink: string) => {
    return prisma.projectAssignment.update({
      where: { id: projectId },
      data: {
        status: ProjectStatus.completed,
        githubLink
      }
    });
  }

};