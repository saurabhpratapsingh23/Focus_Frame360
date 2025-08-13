import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { mockAPIData } from '../lib/mockAPIData';
// import KpiTable from '../components/KpiTable';
import GoalTable from '../components/GoalTable';
import WeeklySummaryPopScreen from '../components/WeeklySummaryPopScreen';
import RolesPopScreen from '../components/RolesPopScreen';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RolesAndResponsibility from '../components/RolesAndResponsibility';

export interface EmployeeInfo {
  e_emp_code: string;
  e_fullname: string;
  e_designation: string;
  e_department: string;
  e_work_location: string; // Note: typo in API, keep as is
  // Add period if available in API, else remove from UI
}



interface WeeklySummary {
  week_start_date: string;
  week_end_date: string;
  weekly_success: string;
  work_days: number;
  WFH: number;
  WFO: number;
  Efforts: number;
  Leaves: number;
  Holidays: number;
  extra_days: number;
  weekly_challenges: string;
  weekly_unfinished_tasks: string;
  weekly_next_actions: string;
  status: string;
  // Added fields from API
  ws_emp_id: number;
  ws_emp_code: string;
  ws_submitted_on: string;
  ws_week_number: number;
  ws_co_id: number;
  ws_week_id: number;
  ws_available_hours: number;
}

interface WeeklyStats {
  Officialworkingdays: number;
  Officialholidays: number;
  LeavesTaken: number;
  ExpectedProductiveHours: number;
  TotalHoursWorked: number;
  ExtraHoursWorked: number;
  ExtraHoursPercentage: number;
}

interface EmsPerformanceProps {
  onShowKPIReport?: () => void;
}

const EmsPerformance: React.FC<EmsPerformanceProps> = () => {
  // const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [weeklyPopOpen, setWeeklyPopOpen] = useState(false);
  const [weeklyPopData, setWeeklyPopData] = useState<any>(null);
  const [rolesPopOpen, setRolesPopOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<number>(0);
  const [selectedWeekId, setSelectedWeekId] = useState<number>(0);
  // For 'Load more' in Weekly Success, Roadblocks, Unfinished Tasks, Next Actions columns
  type ExpandedFields = 'weekly_success' | 'weekly_challenges' | 'weekly_unfinished_tasks' | 'weekly_next_actions';
  const [expandedRows, setExpandedRows] = useState<{[rowIdx:number]: {[field in ExpandedFields]?: boolean}}>({});


  useEffect(() => {
    // Get emp_id and emp_code from sessionStorage
    let empId = sessionStorage.getItem('e_emp_id');
    let empCode = sessionStorage.getItem('e_emp_code');

    if (!empId || !empCode) {
      // Try to get from currentUser as fallback
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.e_emp_id && parsedUser.e_emp_code) {
            empId = parsedUser.e_emp_id.toString();
            empCode = parsedUser.e_emp_code;
            sessionStorage.setItem('e_emp_id', empId);
            sessionStorage.setItem('e_emp_code', empCode);
          } else {
            setError('Employee ID or code not found in user data.');
            setLoading(false);
            return;
          }
        } catch (e) {
          setError('Error parsing user data.');
          setLoading(false);
          return;
        }
      } else {
        setError('Employee ID not found. Please login again.');
        setLoading(false);
        return;
      }
    }

    fetchData(empId, empCode);
  }, [API_BASE_URL]);

  const fetchData = (empId: string, empCode: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_BASE_URL}/pms/api/e/employee/${empCode}`).then(res => {
        if (!res.ok) throw new Error(`Employee API error: ${res.status}`);
        return res.json();
      }),
      fetch(`${API_BASE_URL}/pms/api/e/ws/${empId}`).then(res => {
        if (!res.ok) throw new Error(`WeeklySummary API error: ${res.status}`);
        return res.json();
      })
    ])
      .then(([employeeData, weeklyData]) => {
        setEmployeeInfo(employeeData.employeeInfo || employeeData);

        const mappedWeeklySummary = (weeklyData.weekSummary || []).map((row: any) => ({
          week_start_date: row.ws_start_date,
          week_end_date: row.ws_end_date,
          weekly_success: row.ws_success,
          work_days: row.ws_work_days,
          WFH: row.ws_WFH,
          WFO: row.ws_WFO,
          Efforts: row.ws_efforts,
          Leaves: row.ws_leaves,
          Holidays: row.ws_Holidays,
          extra_days: row.ws_extra_days,
          weekly_challenges: row.ws_challenges,
          weekly_unfinished_tasks: row.ws_unfinished_tasks,
          weekly_next_actions: row.ws_next_actions,
          status: row.ws_status,
          ws_emp_id: row.ws_emp_id,
          ws_emp_code: row.ws_emp_code,
          ws_submitted_on: row.ws_submitted_on,
          ws_week_number: row.ws_week_number,
          ws_co_id: row.ws_co_id,
          ws_week_id: row.ws_week_id,
          ws_available_hours: row.ws_available_hours,
        }));

        // Sort by current month first, then descending order
        const sortedWeeklySummary = mappedWeeklySummary.sort((a: any, b: any) => {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          const dateA = new Date(a.week_start_date);
          const dateB = new Date(b.week_start_date);
          const monthA = dateA.getMonth();
          const monthB = dateB.getMonth();
          const yearA = dateA.getFullYear();
          const yearB = dateB.getFullYear();
          const isCurrentMonthA = monthA === currentMonth && yearA === currentYear;
          const isCurrentMonthB = monthB === currentMonth && yearB === currentYear;
          if (isCurrentMonthA && !isCurrentMonthB) return -1;
          if (!isCurrentMonthA && isCurrentMonthB) return 1;
          return dateB.getTime() - dateA.getTime();
        });
        setWeeklySummary(sortedWeeklySummary);

        const stats = weeklyData.weekStats;
        if (stats) {
          const expectedHours = stats.ws_stats_hours_available;
          const extraHours = stats.ws_stats_extra_hours_worked;
          const extraPercent = expectedHours > 0 ? (extraHours / expectedHours) * 100 : 0;
          setWeeklyStats({
            Officialworkingdays: stats.ws_stats_week_days,
            Officialholidays: stats.ws_stats_holidays,
            LeavesTaken: stats.ws_stats_leaves_taken,
            ExpectedProductiveHours: expectedHours,
            TotalHoursWorked: stats.ws_stats_hours_logged,
            ExtraHoursWorked: extraHours,
            ExtraHoursPercentage: extraPercent,
          });
        } else {
          setWeeklyStats(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load data');
        setLoading(false);
      });
  };

   const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString(undefined, options);
  };

  // Map status values to display text
  const getStatusDisplay = (status: string): string => {
    switch (status?.toUpperCase()) {
      case 'I':
        return 'In-Progress';
      case 'U':
        return 'Yet-to-Start';
      case 'C':
        return 'Completed';
      case 'S':
        return 'Reviewed';
      default:
        return status || 'Unknown';
    }
  };

  const handleWeeklyUpdateClick = async (row: WeeklySummary) => {
    const payload = {
      goal_rec_id: 0,
      emp_id: row.ws_emp_id,
      emp_code: row.ws_emp_code,
      week_number: row.ws_week_number,
      co_id: row.ws_co_id,
      week_id: row.ws_week_id,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/pms/api/e/getwsrow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let errorText = '';
        try {
          errorText = await res.text();
          console.error('Backend error response:', errorText);
        } catch (e) {
          console.error('Failed to read backend error response');
        }
        throw new Error('Failed to fetch weekly summary row');
      }
      const data = await res.json();
      setWeeklyPopData(data);
      setWeeklyPopOpen(true);
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[120px] text-gray-600 text-base sm:text-lg">Loading...</div>;
  if (error || !employeeInfo) return <div className="flex justify-center items-center min-h-[120px] text-red-600 text-base sm:text-lg">{error || 'No data found'}</div>;

  return (
    <div className="bg-gray-100 p-2 sm:p-4 text-gray-800 min-h-screen">
      {/* Profile Card */}
      <div className="bg-white p-2 sm:p-4 rounded-2xl max-w-8xl mx-auto shadow-md mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-2xl font-bold hover:underline">Performance Report</h2>
          <button
            className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-semibold shadow"
            style={{ minWidth: '120px' }}
            onClick={() => {
              if (weeklySummary.length > 0) {
                setSelectedEmpId(weeklySummary[0].ws_emp_id);
                setSelectedWeekId(weeklySummary[0].ws_week_id);
              }
              setRolesPopOpen(true);
            }}
          >
            Edit Weekly Data
          </button>
        </div>
        <div className="mb-4 sm:mb-8 space-y-1 sm:space-y-2 text-xs sm:text-base">
          <div><span className="font-bold">Employee Code:</span> <span className="ml-1">{employeeInfo.e_emp_code}</span></div>
          <div><span className="font-bold">Name:</span> <span className="ml-1">{employeeInfo.e_fullname}</span></div>
          <div><span className="font-bold">Designation:</span> <span className="ml-1">{employeeInfo.e_designation}</span></div>
          <div><span className="font-bold">Department:</span> <span className="ml-1">{employeeInfo.e_department}</span></div>
          <div><span className="font-bold">Work Location:</span> <span className="ml-1">{employeeInfo.e_work_location}</span></div>
        </div>
      </div>

      {/* Weekly Performance Summary */}
      <div className="bg-white p-2 sm:p-4 rounded-2xl max-w-8xl mx-auto mt-4 shadow-md">
        <div className="overflow-x-auto">
          <h2 className='text-lg sm:text-2xl text-center px-2 py-2 text-white font-bold mb-4 bg-gray-900 rounded-t-xl'>Weekly Performance Summary</h2>
          <table className="min-w-[900px] w-full text-xs sm:text-sm mb-4 text-left">
            <thead className="bg-blue-100 text-gray-800 font-medium">
              <tr>
                <th className="rounded-tl-lg px-2 sm:px-6 py-2">Week start</th>
                <th className="border border-gray-200 px-2 sm:px-4 py-2">Week End</th>
                <th className="border border-gray-200 w-[20px] px-4 py-2">Weekly Success</th>
                <th className="border border-gray-200 px-2 py-2">WD</th>
                <th className="border border-gray-200 px-2 py-2">WFH</th>
                <th className="border border-gray-200 px-2 py-2">WFO</th>
                <th className="border border-gray-200 px-2 py-2">Efforts</th>
                <th className="border border-gray-200 px-2 py-2">Leaves</th>
                <th className="border border-gray-200 px-2 py-2">Holidays</th>
                <th className="border border-gray-200 px-2 py-2">WOH</th>
                <th className="border border-gray-200 px-4 py-2">Roadblocks</th>
                <th className="border border-gray-200 px-4 py-2">Unfinished Tasks</th>
                <th className="border border-gray-200 px-4 py-2">Next Actions</th>
                <th className="border border-gray-200 px-2 py-2">Remarks</th>
                {/* <th className="border border-gray-200 px-2 py-2">Emp ID</th> */}
                {/* <th className="border border-gray-200 px-2 py-2">Emp Code</th> */}
                <th className="border border-gray-200 px-2 py-2">Submitted On</th>
                <th className="border border-gray-200 px-2 py-2">Week Number</th>
                {/* <th className="border border-gray-200 px-2 py-2">Co ID</th> */}
                {/* <th className="border border-gray-200 px-2 py-2">Week ID</th> */}
                <th className="border border-gray-200 px-2 py-2">Available Hours</th>
                <th className="rounded-tr-lg px-2 py-2">Update Summary</th>

              </tr>
            </thead>
            <tbody className="text-gray-700 border border-gray-200">
              {weeklySummary.map((row, i) => {
                // Helper for each field
                const renderExpandableCell = (field: ExpandedFields, value: string | undefined, className = "") => {
                  const lines = value ? value.split(/\r?\n/) : [];
                  const isExpanded = expandedRows[i]?.[field] || false;
                  const handleToggle = () => setExpandedRows(prev => ({
                    ...prev,
                    [i]: { ...prev[i], [field]: !isExpanded }
                  }));
                  if (lines.length > 10) { 
                    return (
                      <div className={className}>
                        {isExpanded ? lines.join('\n') : lines.slice(0, 10).join('\n')}
                        <span className="block text-blue-600 cursor-pointer mt-2 underline" onClick={handleToggle}>
                          {isExpanded ? 'Show less' : 'Load more'}
                        </span>
                      </div>
                    );
                  }
                  return <div className={className}>{value || '–'}</div>;
                };
                return (
                  <tr key={i} className={i%2===1? "bg-gray-200 w-20":""}>
                    <td className="px-2 sm:px-4 w-24 py-2 h-20">{formatDate(row.week_start_date)}</td>
                    <td className="border border-gray-300 w-24 px-2 sm:px-4 py-2">{formatDate(row.week_end_date)}</td>
                    <td className="border border-gray-300 min-w-[200px] sm:min-w-[300px] max-w-[500px] px-2 py-2 text-[11px] sm:text-[13px] whitespace-pre-line align-top">
                      {renderExpandableCell('weekly_success', row.weekly_success)}
                    </td>
                    <td className="border border-gray-300 text-[11px] sm:text-[13px] px-2 py-2 text-center">{row.work_days}</td>
                    <td className="border border-gray-300 text-[11px] sm:text-[13px] px-2 py-2 text-center">{row.WFH}</td>
                    <td className="border border-gray-300 text-[11px] sm:text-[13px] px-2 py-2 text-center">{row.WFO}</td>
                    <td className="border border-gray-300 text-[11px] sm:text-[13px] px-2 py-2 text-center font-bold">{row.Efforts}</td>
                    <td className="border border-gray-300 text-[11px] sm:text-[13px] px-2 py-2 text-center">{row.Leaves}</td>
                    <td className="border border-gray-300 text-[11px] sm:text-[13px] px-2 py-2 text-center">{row.Holidays}</td>
                    <td className="border border-gray-300 text-[11px] sm:text-[13px] px-2 py-2 text-center ">{row.extra_days}</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 w-15 text-red-600 text-[11px] sm:text-[13px] whitespace-pre-line">
                      {renderExpandableCell('weekly_challenges', row.weekly_challenges)}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-[11px] sm:text-[13px] whitespace-pre-line">
                      {renderExpandableCell('weekly_unfinished_tasks', row.weekly_unfinished_tasks)}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-[11px] sm:text-[13px] whitespace-pre-line">
                      {renderExpandableCell('weekly_next_actions', row.weekly_next_actions)}
                    </td>
                    <td className="border border-gray-300 w-25 text-center">
                      <span className='bg-gray-700 text-white text-[11px] sm:text-[13px] rounded-full px-2 py-2 opacity-75 mr-2'>{getStatusDisplay(row.status)}</span></td>
                    <td className="border border-gray-300 px-2 py-2">{row.ws_submitted_on}</td>
                    <td className="border border-gray-300 px-2 py-2">{row.ws_week_number}</td>
                    <td className="border border-gray-300 px-2 py-2">{row.ws_available_hours}</td>
                    <td className="px-2 py-2">
                      <button
                        className="bg-blue-900 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md"
                        onClick={() => handleWeeklyUpdateClick(row)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
          {weeklyStats ? (
            <>
              <div className="bg-blue-50 border-l-4 border-blue-900 p-2 sm:p-4 rounded-md flex-1 min-w-[180px] sm:min-w-[300px] shadow-inner">
                <p className="mb-2"><span className="font-semibold text-gray-900">Official Working Days:</span> {weeklyStats.Officialworkingdays} days</p>
                <p className="mb-2"><span className="font-semibold text-gray-900">Official Holidays:</span> {weeklyStats.Officialholidays} day(s)</p>
                <p className="mb-2"><span className="font-semibold text-gray-900">Leaves Taken:</span> {weeklyStats.LeavesTaken} day(s)</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-900 p-2 sm:p-4 rounded-md flex-1 min-w-[180px] sm:min-w-[300px] shadow-inner">
                <p><span className="font-semibold text-gray-900">Expected Productive Hours :</span> {weeklyStats.ExpectedProductiveHours} hrs</p>
                <p className="mb-2"><span className="font-semibold text-gray-900">Efforts For Completion:</span> {weeklyStats.TotalHoursWorked} hrs</p>
              </div>
            </>
          ) : (
            <div className="min-h-[120px] w-full" />
          )}
        </div>
        <div className="bg-white rounded-md mt-4 shadow p-2 sm:p-4 text-xs text-gray-600">
          <strong className="ml-2">WD</strong> = Working Days,  <strong className="ml-2">H</strong> = Holidays,  <strong className="ml-2">L</strong> = Leaves,  <strong className="ml-2">WFH</strong> = Working from Home,  <strong className="ml-2">WFO</strong> = Working from Office,  <strong className="ml-2">WOH</strong> = Work On Holiday(s);
        </div>
      </div>

      <div className="bg-white p-2 sm:p-4 rounded-2xl max-w-8xl mx-auto mt-4 shadow-md">
        <RolesAndResponsibility/>
      </div>

      <div className="bg-white p-2 sm:p-4 rounded-2xl max-w-8xl mx-auto mt-4 shadow-md">
        <GoalTable/>
      </div>
      <WeeklySummaryPopScreen
        isOpen={weeklyPopOpen}
        data={weeklyPopData}
        onClose={() => setWeeklyPopOpen(false)}
        onSave={async (payload) => {
          try {
            const res = await fetch(`${API_BASE_URL}/pms/api/e/postwsrow`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              let errorText = '';
              try {
                errorText = await res.text();
                console.error('Backend error response:', errorText);
              } catch {
                console.error('Failed to read backend error response');
              }
              throw new Error('Failed to save weekly summary row');
            }
            toast.success('Weekly summary row saved successfully!');
            setWeeklyPopOpen(false);
            // Refresh the table by re-fetching data
            // fetchWeeklySummary();
          } catch (err: unknown) {
            if (err instanceof Error) {
              toast.error(err.message || 'Save failed');
            } else {
              toast.error('Save failed');
            }
          }
        }}
      />
      {/* RolesPopScreen popup */}
      <RolesPopScreen 
        isOpen={rolesPopOpen} 
        onClose={() => setRolesPopOpen(false)}
        empId={selectedEmpId}
        weekId={selectedWeekId}
      />
      <ToastContainer />
    </div>
  );
};

export default EmsPerformance;
