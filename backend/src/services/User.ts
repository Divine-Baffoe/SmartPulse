import { PrismaClient, User, WorkSession, Alert, ProjectAssignment, ProjectStatus } from '@prisma/client';
const prisma = new PrismaClient();

type SettingsData = {
  notifications: {
    emailLowProductivity: boolean;
    inAppAlerts: boolean;
    productivityThreshold: number;
  };
};

const userService = {
  // Get productivity summary for a user
  getUserProductivity: async (userId: number, startDate: Date) => {
    const sessions = await prisma.workSession.findMany({
      where: { userId, startTime: { gte: startDate } },
    });

    const productivity = sessions.reduce(
      (acc, session) => ({
        productive: acc.productive + session.productive,
        unproductive: acc.unproductive + session.unproductive,
        undefined: acc.undefined + session.undefined,
      }),
      { productive: 0, unproductive: 0, undefined: 0 }
    );
    const total = Object.values(productivity).reduce((sum, val) => sum + val, 0) || 1;

    const hoursWorked = sessions.reduce((sum, session) => {
      const durationMs = session.endTime ? session.endTime.getTime() - session.startTime.getTime() : 0;
      return sum + durationMs / 3600000;
    }, 0);

    const idleTime = sessions.reduce((sum, session) => sum + session.idleTime / 60, 0);

    const topApps = sessions
      .flatMap(session => session.appsUsed as { name: string; duration: number }[])
      .reduce((acc, { name, duration }) => {
        acc[name] = (acc[name] || 0) + duration;
        return acc;
      }, {} as Record<string, number>);
    const totalAppDuration = Object.values(topApps).reduce((sum, val) => sum + val, 0) || 1;

    const topWebsites = sessions
      .flatMap(session => session.websitesUsed as { name: string; duration: number }[])
      .reduce((acc, { name, duration }) => {
        acc[name] = (acc[name] || 0) + duration;
        return acc;
      }, {} as Record<string, number>);
    const totalWebsiteDuration = Object.values(topWebsites).reduce((sum, val) => sum + val, 0) || 1;

    return {
      productivity: {
        productive: (productivity.productive / total) * 100,
        unproductive: (productivity.unproductive / total) * 100,
        undefined: (productivity.undefined / total) * 100,
      },
      hoursWorked,
      idleTime,
      topApps: Object.entries(topApps).map(([name, duration]) => ({
        name,
        percentage: (duration / totalAppDuration) * 100,
      })),
      topWebsites: Object.entries(topWebsites).map(([name, duration]) => ({
        name,
        percentage: (duration / totalWebsiteDuration) * 100,
      })),
      activityHistory: sessions.map(session => ({
        date: session.startTime.toISOString().split('T')[0],
        productive: session.productive,
        unproductive: session.unproductive,
        undefined: session.undefined,
      })),
    };
  },

  // Get all alerts for a company
  getUserAlerts: async (companyId: number) => {
    const alerts = await prisma.alert.findMany({
      where: {
        user: {
          companyId: companyId
        }
      },
      include: {
        user: true
      }
    });

    // Map to frontend Alert interface
    return alerts.map(alert => ({
      id: alert.id,
      userId: alert.userId,
      name: alert.user?.name || '',
      avatarUrl: alert.user?.avatarUrl || undefined,
      type: alert.type, // assuming enum or string
      details: alert.details,
      activity: alert.activity, // already JSON
      timestamp: alert.timestamp.toISOString(),
    }));
  },

  // Update user settings (requires a settings field in your User model)
  updateUserSettings: async (userId: number, updates: Partial<SettingsData>) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { settings: updates }, // Only works if you add a settings: Json? field to your User model
    });
    return user;
  },

  // Add these methods:
  getUserStats: async (userId: number, period: string) => {
    // Example: Use period to calculate startDate
    let startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
    // Default is 'day'
    return userService.getUserProductivity(userId, startDate);
  },
  
  getEmployeeInsights: async (companyId: number) => {
    const users = await prisma.user.findMany({ where: { companyId } });
    return Promise.all(users.map(async user => {
      const prod = await userService.getUserProductivity(user.id, new Date(new Date().setHours(0,0,0,0)));
      // Convert hoursWorked and idleTime (which are numbers) to { hours, minutes }
      const hoursWorked = prod.hoursWorked || 0;
      const idleTime = prod.idleTime || 0;
      return {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        timeWorked: {
          hours: Math.floor(hoursWorked),
          minutes: Math.round((hoursWorked % 1) * 60)
        },
        activity: prod.productivity,
        productiveTime: Math.round(prod.productivity.productive),
        idleTime: {
          hours: Math.floor(idleTime),
          minutes: Math.round((idleTime % 1) * 60)
        }
      };
    }));
  },

  getReports: async (companyId: number, period: string) => {
    const users = await prisma.user.findMany({ where: { companyId } });
    let startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);

    return Promise.all(users.map(async user => {
      const stats = await userService.getUserProductivity(user.id, startDate);
      const hoursWorked = stats.hoursWorked || 0;
      const idleTime = stats.idleTime || 0;
      return {
        id: user.id,
        userId: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        timeWorked: {
          hours: Math.floor(hoursWorked),
          minutes: Math.round((hoursWorked % 1) * 60)
        },
        productivity: Math.round(stats.productivity.productive),
        idleTime: {
          hours: Math.floor(idleTime),
          minutes: Math.round((idleTime % 1) * 60)
        },
        appsUsed: stats.topApps || [],
        websitesUsed: stats.topWebsites || [],
      };
    }));
  },

  getUserSettings: async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: true }
  });

  if (!user) return {};

  // Get all users in the same company with company name
  const rawUsers = await prisma.user.findMany({
    where: { companyId: user.companyId },
    
    select: {
      id: true,
      avatarUrl: true,
      name: true,
      email: true,
      role: true,
      company: { select: { name: true } }
    }
  });

  const users = rawUsers.map(u => ({
    id: u.id,
    avatarUrl: u.avatarUrl,
    name: u.name,
    email: u.email,
    role: u.role,
    company: u.company?.name ?? 'N/A'
  }));

  // Safely parse user.settings
  let settingsObj: any = {};
  if (typeof user.settings === 'string') {
    try {
      settingsObj = JSON.parse(user.settings);
    } catch {
      settingsObj = {};
    }
  } else if (typeof user.settings === 'object' && user.settings !== null) {
    settingsObj = user.settings;
  }

  return {
    trackingRules: settingsObj.trackingRules || {
      browserActivity: true,
      appActivity: true,
      idleTime: false,
    },
    notifications: settingsObj.notifications || {
      emailLowProductivity: true,
      inAppAlerts: false,
      productivityThreshold: 40,
    },
    users,
  };
},

// Get Admin Profile
getAdminProfileSettings: async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { company: true }, });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,  
    avatarUrl: user.avatarUrl,
    company: user.company?.name ?? '',
    contact: user.contact || '',
  };
},

 //Update Admin Profile
  updateAdminProfile: async (userId: number, updates: any) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: updates.name,
        email: updates.email,
        contact: updates.contact,
        avatarUrl: updates.avatarUrl,
        countrycode: updates.countrycode,
        company: { connect: { id: updates.companyId } },
      },
    });
  },
  

  // Get all employees for a company
  getEmployeesByCompany: async (companyId: number) => {
    return prisma.user.findMany({
      where: { companyId, role: 'EMPLOYEE' },
      select: { id: true, name: true, email: true },
    });
  },

  // Get employee by ID
  getEmployeeById: async (employeeId: number) => {
    return prisma.user.findUnique({
      where: { id: employeeId },
      select: { id: true, name: true, companyId: true, role: true },
    });
  },

  // Get all projects
  getAllProjects: async (companyId: number) => {
    return prisma.projectAssignment.findMany({
      where: {
      user: { companyId },
    },

      include: { user: true }
    });
  },

  // Assign a project
  assignProject: async (employeeId: number, projectName: string, dueDate: string, projectDescription: string) => {
    return prisma.projectAssignment.create({
      data: {
        userId: employeeId,
        projectName,
        status: ProjectStatus.assigned,
        dueDate:new Date(dueDate),
        projectDescription,
        
      },
      include: { user: true }
    });
  },

  // Mark project as complete
  markProjectComplete: async (id: number, githubLink: string) => {
  
    return prisma.projectAssignment.update({
      where: { id },
      data: {
        githubLink,
        status: ProjectStatus.completed,
        completedAt: new Date()
      },
      include: { user: true }
    });
  },


  deleteProject: async (projectId: number) => {
    return prisma.projectAssignment.delete({
      where: { id: projectId },
      include: { user: true }
    });
  },

  rejectProject: async (projectId: number) => {
    return prisma.projectAssignment.update({
      where: { id: projectId },
      data: { status: ProjectStatus.rejected },
      include: { user: true }
    });
  },

  updateProjectDueDate: async (projectId: number, dueDate: string) => {
  return prisma.projectAssignment.update({
    where: { id: projectId },
    data: { dueDate: new Date(dueDate) },
    include: { user: true }
  });
},
uploadProfileImage: async (userId: number, imageUrl: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: imageUrl },
  });
},


};

   
  


export { userService };