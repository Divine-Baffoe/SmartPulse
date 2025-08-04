import { PrismaClient, ProjectStatus } from '@prisma/client';
const prisma = new PrismaClient();

type SubmittedProject = {
  id: number;
  projectName: string;
  user: {
    name: string;
  };
};

export const employeeService = {


     
  getUserStats: async (userId: number, period: 'day' | 'week' | 'month') => {
    // Calculate start date based on period
    const startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);

    // Fetch sessions
    const sessions = await prisma.workSession.findMany({
      where: { userId, startTime: { gte: startDate } },
    });

    // Calculate productivity
    const productivity = sessions.reduce(
      (acc, session) => ({
        productive: acc.productive + session.productive,
        unproductive: acc.unproductive + session.unproductive,
        undefined: acc.undefined + session.undefined,
      }),
      { productive: 0, unproductive: 0, undefined: 0 }
    );
    const total = Object.values(productivity).reduce((sum, val) => sum + val, 0) || 1;

    // Calculate hours worked
    const hoursWorked = sessions.reduce((sum, session) => {
      const durationMs = session.endTime ? session.endTime.getTime() - session.startTime.getTime() : 0;
      return sum + durationMs / 3600000;
    }, 0);

    // Calculate idle time
    const idleTime = sessions.reduce((sum, session) => sum + session.idleTime / 60, 0);

    // Calculate top apps
    const topApps = sessions
      .flatMap(session => session.appsUsed as { name: string; duration: number }[])
      .reduce((acc, { name, duration }) => {
        acc[name] = (acc[name] || 0) + duration;
        return acc;
      }, {} as Record<string, number>);
    const totalAppDuration = Object.values(topApps).reduce((sum, val) => sum + val, 0) || 1;

    // Calculate top websites
    const topWebsites = sessions
      .flatMap(session => session.websitesUsed as { name: string; duration: number }[])
      .reduce((acc, { name, duration }) => {
        acc[name] = (acc[name] || 0) + duration;
        return acc;
      }, {} as Record<string, number>);
    const totalWebsiteDuration = Object.values(topWebsites).reduce((sum, val) => sum + val, 0) || 1;

    // Calculate activity history
    const activityHistoryMap: Record<
      string,
      { productive: number; unproductive: number; undefined: number }
    > = {};
    sessions.forEach(session => {
      const date = session.startTime.toISOString().split('T')[0];
      if (!activityHistoryMap[date]) {
        activityHistoryMap[date] = { productive: 0, unproductive: 0, undefined: 0 };
      }
      activityHistoryMap[date].productive += session.productive;
      activityHistoryMap[date].unproductive += session.unproductive;
      activityHistoryMap[date].undefined += session.undefined;
    });

    const activityHistory = Object.entries(activityHistoryMap)
      .map(([date, { productive, unproductive, undefined: undef }]) => {
        const total = productive + unproductive + undef || 1;
        return {
          date,
          productive: Number(((productive / total) * 100).toFixed(1)),
          unproductive: Number(((unproductive / total) * 100).toFixed(1)),
          undefined: Number(((undef / total) * 100).toFixed(1)),
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      productivity: {
        productive: Number(((productivity.productive / total) * 100).toFixed(1)),
        unproductive: Number(((productivity.unproductive / total) * 100).toFixed(1)),
        undefined: Number(((productivity.undefined / total) * 100).toFixed(1)),
      },
      hoursWorked: Number(hoursWorked.toFixed(2)),
      idleTime: Number(idleTime.toFixed(2)),
      topApps: Object.entries(topApps)
        .map(([name, duration]) => ({
          name,
          percentage: Number(((duration / totalAppDuration) * 100).toFixed(1)),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5), // Limit to top 5
      topWebsites: Object.entries(topWebsites)
        .map(([name, duration]) => ({
          name,
          percentage: Number(((duration / totalWebsiteDuration) * 100).toFixed(1)),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5), // Limit to top 5
      activityHistory,
    };
  },


  getUserStressInsights: async (userId: number, period: string) => {
    const startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);

    const sessions = await prisma.workSession.findMany({
      where: { userId, startTime: { gte: startDate } },
    });
    //const stressLogs = await prisma.stressLog.findMany({
      //where: { userId, createdAt: { gte: startDate } },
    //});

    const workDuration = sessions.reduce((sum, session) => {
      const durationMs = session.endTime ? session.endTime.getTime() - session.startTime.getTime() : 0;
      return sum + durationMs / 3600000;
    }, 0);

    const appSwitches = sessions.reduce((sum, session) => sum + session.appSwitches, 0) / (workDuration || 1);
    const breakTime = sessions.reduce((sum, session) => sum + session.idleTime / 60, 0);
    //const stressRatingAvg = stressLogs.length
     // ? stressLogs.reduce((sum, log) => sum + log.rating, 0) / stressLogs.length
     // : 0;

    let stressLevel = 0;
    if (workDuration > 3) stressLevel += (workDuration - 3) * 20;
    stressLevel += appSwitches * 0.5;
    //stressLevel += stressRatingAvg * 10;
    stressLevel = Math.min(100, Math.max(0, stressLevel));

    const stressHistory = sessions.map((session) => ({
      date: session.startTime.toISOString().split('T')[0],
      stressLevel: Math.min(100, Math.max(0, (session.productive > 80 ? 10 : 0) + session.appSwitches * 0.5)),
    }));

    return {
      stressLevel,
      workDuration,
      appSwitches,
      breakTime,
      stressHistory,
      tip: ['Take a break', 'Breathe deeply', 'Stretch'].sort(() => Math.random() - 0.5)[0],
    };
  },


  
  getSettings: async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId },include: { company: true }, });
    if (!user) return null;
    return {
      fullName: user.name,
      email: user.email,
      countrycode: user.countrycode || '',
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

  // Add to existing services/Employee.ts
logUserActivity: async (userId: number, activities: any[]) => {
  return Promise.all(
    activities.map(async (activity) => {
      const { appName, duration, activeInputs, productive, unproductive, undefined: undef, websitesUsed } = activity;
      return await prisma.workSession.create({
        data: {
          userId,
          startTime: new Date(),
          endTime: new Date(Date.now() + duration * 3600000),
          //appName,
          activeTime: activeInputs > 0 ? duration : 0,
          productive,
          unproductive,
          undefined: undef,
          idleTime: 0,
          appsUsed: [{ name: appName, duration }],
          websitesUsed,
          appSwitches: activeInputs,
        },
      });
    }),
  );
},

  getProjectsByEmployee: async (employeeId: number) => {
    return prisma.projectAssignment.findMany({
      where: { userId: employeeId },
      select: {
        id: true,
        projectName: true,
        status: true,
        githubLink: true,
        dueDate: true,
      }
    });
  },

  submitProject: async (projectId: number, githubLink: string) => {
  await prisma.projectAssignment.update({
    where: { id: projectId },
    data: {
      status: ProjectStatus.submitted,
      githubLink,
      submittedAt: new Date(),
    },
  });

  // Now fetch the updated project with user info
  return prisma.projectAssignment.findUnique({
  where: { id: projectId },
  include: {
    user: {
      select: {
        name: true,
      },
    },
  },
}) as Promise<SubmittedProject | null>;
},

  

};

