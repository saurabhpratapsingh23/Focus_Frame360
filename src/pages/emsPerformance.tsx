import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { mockAPIData } from '../lib/mockAPIData';
import KpiTable from '../components/KpiTable';
import GoalTable from '../components/GoalTable';



export interface EmployeeInfo {
  e_emp_code: string;
  e_fullname: string;
  e_designation: string;
  e_department: string;
  e_work_location: string; // Note: typo in API, keep as is
  // Add period if available in API, else remove from UI
}

interface RoleResponsibility {
  Division: string;
  FunctionTitle: string;
  Role: {
    erole_function_code: string;
    erole_perform: number;
    erole_manage: number;
    erole_audit: number;
    erole_define: number;
    // Add other fields as needed
  };
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

const EmsPerformance: React.FC<EmsPerformanceProps> = ({ onShowKPIReport }) => {
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get emp_code from localStorage's currentUser
    const userData = localStorage.getItem('currentUser');
    let empID = '';
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        empID = parsedUser.e_emp_code;
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user data');
        setLoading(false);
        return;
      }
    } else {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    // Fetch employee info and weekly summary/stats in parallel
    Promise.all([
      fetch(`${API_BASE_URL}/pms/api/e/employee/${empID}`).then(res => {
        if (!res.ok) throw new Error(`Employee API error: ${res.status}`);
        return res.json();
      }),
      fetch(`${API_BASE_URL}/pms/api/e/ws/${empID}?weeks=16,17,18`).then(res => {
        if (!res.ok) throw new Error(`WeeklySummary API error: ${res.status}`);
        return res.json();
      })
    ])
      .then(([employeeData, weeklyData]) => {
        setEmployeeInfo(employeeData.employeeInfo || employeeData); // fallback if not wrapped

        // Map weekSummary to expected weeklySummary fields
        const mappedWeeklySummary = (weeklyData.weekSummary || []).map((row: any) => ({
          week_start_date: row.ws_start_date,
          week_end_date: row.ws_end_date,
          weekly_success: row.ws_success,
          work_days: row.ws_workk_days,
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
        setWeeklySummary(mappedWeeklySummary);

        // Map weekStats to expected weeklyStats fields
        const stats = weeklyData.weekStats;
        if (stats) {
          setWeeklyStats({
            Officialworkingdays: stats.ws_stats_week_days,
            Officialholidays: stats.ws_stats_holidays,
            LeavesTaken: stats.ws_stats_leaves_taken,
            ExpectedProductiveHours: stats.ws_stats_hours_available,
            TotalHoursWorked: stats.ws_stats_hours_logged,
            ExtraHoursWorked: stats.ws_stats_extra_hours_worked,
            ExtraHoursPercentage: stats.ws_stats_extra_hours_percentage,
          });
        } else {
          setWeeklyStats(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setError(err.message || 'Failed to load data');
        setLoading(false);
      });
  }, [API_BASE_URL]);

   const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !employeeInfo) return <div className="p-8 text-center text-red-500">{error || 'No data found'}</div>;

  return (
    <div className="bg-gray-100 p-4 text-gray-800">
      {/* Profile Card */}
      <div className="bg-white p-4 rounded-2xl max-w-8xl mx-auto shadow-md mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold ">Perfomance Report</h2>
        </div>
        <div className="mb-8 space-y-2">
          <div className=""><span className="w-2/5 font-bold">Employee Code:</span> <span className="ml-2">{employeeInfo.e_emp_code}</span></div>
          <div className=""><span className="w-2/5 font-bold">Name:</span> <span className="ml-2">{employeeInfo.e_fullname}</span></div>
          <div className=""><span className="w-2/5 font-bold">Designation:</span> <span className="ml-2">{employeeInfo.e_designation}</span></div>
          <div className=""><span className="w-2/5 font-bold">Department:</span> <span className="ml-2">{employeeInfo.e_department}</span></div>
          <div className=""><span className="w-2/5 font-bold">Work Location:</span> <span className="ml-2">{employeeInfo.e_work_location}</span></div>
        </div>
      </div>

      {/* Weekly Performance Summary */}
      <div className="bg-white p-4 rounded-2xl max-w-8xl mx-auto mt-4 shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm mb-4  text-left   ">
            <thead className="bg-gray-200 text-gray-800 font-medium  ">
              <tr>
                <th className=" rounded-tl-lg px-4 py-2">Week</th>
                <th className=" px-4 py-2">Weekly Success</th>
                <th className=" px-2 py-2">WD</th>
                <th className=" px-2 py-2">WFH</th>
                <th className=" px-2 py-2">WFO</th>
                <th className=" px-2 py-2">Efforts</th>
                <th className=" px-2 py-2">Leaves</th>
                <th className=" px-2 py-2">Holidays</th>
                <th className=" px-2 py-2">ED</th>
                <th className=" px-4 py-2">Roadblocks</th>
                <th className=" px-4 py-2">Unfinished Tasks</th>
                <th className=" px-4 py-2">Next Actions</th>
                <th className=" px-2 py-2">Remarks</th>
                {/* <th className="border border-gray-200 px-2 py-2">Emp ID</th> */}
                {/* <th className="border border-gray-200 px-2 py-2">Emp Code</th> */}
                <th className=" px-2 py-2">Submitted On</th>
                <th className=" px-2 py-2">Week Number</th>
                {/* <th className="border border-gray-200 px-2 py-2">Co ID</th> */}
                {/* <th className="border border-gray-200 px-2 py-2">Week ID</th> */}
                <th className=" px-2 py-2">Available Hours</th>
                <th className="rounded-tr-lg px-2 py-2">Update Summary</th>

              </tr>
            </thead>
            <tbody className="text-gray-700">
              {weeklySummary.map((row, i) => (
                <tr key={i} className={i%2===1? "bg-gray-200":""}>
                  <td className=" px-4 py-2">{formatDate(row.week_start_date)} – {formatDate(row.week_end_date)}</td>
                  <td className=" px-4 py-2">{row.weekly_success}</td>
                  <td className=" px-2 py-2">{row.work_days}</td>
                  <td className=" px-2 py-2">{row.WFH}</td>
                  <td className=" px-2 py-2">{row.WFO}</td>
                  <td className=" px-2 py-2">{row.Efforts}</td>
                  <td className=" px-2 py-2">{row.Leaves}</td>
                  <td className=" px-2 py-2">{row.Holidays}</td>
                  <td className=" px-2 py-2">{row.extra_days}</td>
                  <td className=" px-4 py-2">{row.weekly_challenges || '–'}</td>
                  <td className=" px-4 py-2">{row.weekly_unfinished_tasks || '–'}</td>
                  <td className=" px-4 py-2">{row.weekly_next_actions || '–'}</td>
                  <td className=" px-2 py-2">{row.status}</td>
                  {/* <td className=" px-2 py-2">{row.ws_emp_id}</td> */}
                  {/* <td className=" px-2 py-2">{row.ws_emp_code}</td> */}
                  <td className=" px-2 py-2">{row.ws_submitted_on}</td>
                  <td className=" px-2 py-2">{row.ws_week_number}</td>
                  {/* <td className=" px-2 py-2">{row.ws_co_id}</td> */}
                  {/* <td className=" px-2 py-2">{row.ws_week_id}</td> */}
                  <td className=" px-2 py-2">{row.ws_available_hours}</td>
                  <td className="px-2 py-2">
                    <button className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md">Update</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-6">
          {weeklyStats ? (
            <>
              <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-md flex-1 min-w-[300px] shadow-inner">
                <p className="mb-2"><span className="font-semibold text-gray-900">Official Working Days:</span> {weeklyStats.Officialworkingdays} days</p>
                <p className="mb-2"><span className="font-semibold text-gray-900">Official Holidays:</span> {weeklyStats.Officialholidays} day(s)</p>
                <p className="mb-2"><span className="font-semibold text-gray-900">Leaves Taken:</span> {weeklyStats.LeavesTaken} day(s)</p>
                <p><span className="font-semibold text-gray-900">Expected Productive Hours (9hr/day):</span> {weeklyStats.ExpectedProductiveHours} hrs</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-md flex-1 min-w-[300px] shadow-inner">
                <p className="mb-2"><span className="font-semibold text-gray-900">Total Hours Worked:</span> {weeklyStats.TotalHoursWorked} hrs</p>
                <p className="mb-2"><span className="font-semibold text-gray-900">Extra Hours:</span> {weeklyStats.ExtraHoursWorked} hrs</p>
                <p><span className="font-semibold text-gray-900">Extra Hours %:</span> {weeklyStats.ExtraHoursPercentage?.toFixed(2)}%</p>
              </div>
            </>
          ) : (
            <div className="min-h-[120px] w-full" />
          )}
        </div>
         <div className="bg-white rounded-md mt-4 shadow p-4 text-xs text-gray-600">
           <strong className="ml-2">WD</strong> = Working Days,  <strong className="ml-2">H</strong> = Holidays,  <strong className="ml-2">L</strong> = Leaves,  <strong className="ml-2">WFH</strong> = Working from Home,  <strong className="ml-2">WFO</strong> = Working from Office,  <strong className="ml-2">ED</strong> = Extra day(s);
         
        </div>
      </div>
      <div className= "bg-white p-4 rounded-2xl max-w-8xl mx-auto mt-4 shadow-md">
      <GoalTable/>
      </div>
    </div>
  );
};

export default EmsPerformance;
