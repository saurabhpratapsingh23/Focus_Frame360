export const employeeInfo = {
    empCode: 'EMP123',
    name: 'John Doe',
    designation: 'Software Engineer',
    department: 'Development',
    location: 'Remote',
    period: '13 Apr - 31 May',
  };
  
  export const rolesResponsibilities = [
    {
      division: 'IT',
      functionCode: 'F001',
      functionTitle: 'Development',
      perform: '✔',
      manage: '',
      audit: '',
      define: '',
      rescue: '',
    },
    {
      division: 'IT',
      functionCode: 'F002',
      functionTitle: 'Code Review',
      perform: '✔',
      manage: '✔',
      audit: '',
      define: '',
      rescue: '',
    },
  ];
  
  export const weeklySummary = [
    {
      week: 'Week 1',
      weeklySuccess: 'Completed Module A',
      wd: 5,
      wfh: 3,
      wfo: 2,
      efforts: 45,
      leaves: 0,
      holidays: 1,
      ed: 0,
      roadblocks: 'None',
      unfinishedTasks: 'Module B',
      nextActions: 'Start Module B',
      remarks: 'Good progress',
    },
    {
      week: 'Week 2',
      weeklySuccess: 'Started Module B',
      wd: 5,
      wfh: 2,
      wfo: 3,
      efforts: 42,
      leaves: 1,
      holidays: 0,
      ed: 0,
      roadblocks: 'API delay',
      unfinishedTasks: 'Module B',
      nextActions: 'Continue Module B',
      remarks: 'Blocked by API',
    },
  ];
  
  export const summaryStats = {
    workingDays: 22,
    holidays: 2,
    leavesTaken: 1,
    expectedHours: 198,
    totalHours: 187,
    extraHours: 5,
    extraPct: '2.5%',
  };


  export const mockKpiData = [
    {
      goalNo: 1,
      serviceArea: 'Feature Delivery',
      serviceDescription: 'Timely delivery of committed features',
      slaMetric: '% Feature Completion',
      slaTarget: '\u2265 95%',
      weeks: ['G', 'O', 'G', '-', 'O', 'O', 'G'],
      g: 2,
      o: 3,
      r: 1,
      status: 'red',
      comments: 'Seems like missing timelines or delays',
    },
    // Add more objects as needed
  ];
  