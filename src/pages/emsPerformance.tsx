import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { mockAPIData } from '../lib/mockAPIData';
import KpiTable from '../components/KpiTable';


export interface EmployeeInfo {
  emp_code: string;
  Fullname: string;
  designation: string;
  department: string;
  work_location: string;
  period: string[];
}

interface RoleResponsibility {
  Division: string;
  function_code: string;
  FunctionTitle: string;
  Perform: boolean;
  Manage: boolean;
  Audit: boolean;
  Define: boolean;
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
  const [roles, setRoles] = useState<RoleResponsibility[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get emp_code from localStorage's currentUser
    const userData = localStorage.getItem('currentUser');
    let empID = '';
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        empID = parsedUser.emp_code;
      } catch (e) {
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
    fetch(`${API_BASE_URL}/pms/weeklyperf/${empID}`)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        setEmployeeInfo(data.employee_info);
        setRoles(data.roles_responsibility);
        setWeeklySummary(data.weekly_summary);
        setWeeklyGoals(data.weekly_goals || []);
        // Calculate stats
        const stats = data.weekly_stats;
        const ExpectedProductiveHours = stats.Officialworkingdays * 9;
        const ExtraHoursWorked = stats.TotalHoursWorked - ExpectedProductiveHours;
        const ExtraHoursPercentage = stats.TotalHoursWorked > 0 ? ((ExtraHoursWorked / stats.TotalHoursWorked) * 100) : 0;
        setWeeklyStats({
          Officialworkingdays: stats.Officialworkingdays,
          Officialholidays: stats.Officialholidays || 0,
          LeavesTaken: stats.LeavesTaken,
          ExpectedProductiveHours,
          TotalHoursWorked: stats.TotalHoursWorked,
          ExtraHoursWorked,
          ExtraHoursPercentage,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !employeeInfo || !weeklyStats) return <div className="p-8 text-center text-red-500">{error || 'No data found'}</div>;

  return (
    <div className="bg-gray-100 p-4 text-gray-800">
      {/* Profile Card */}
      <div className="bg-white p-4 rounded-2xl max-w-8xl mx-auto shadow-md mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold ">Perfomance Report</h2>
        </div>
        <div className="mb-8 space-y-2">
          <div className=""><span className="w-2/5 font-bold">Employee Code:</span> <span className="ml-2">{employeeInfo.emp_code}</span></div>
          <div className=""><span className="w-2/5 font-bold">Name:</span> <span className="ml-2">{employeeInfo.Fullname}</span></div>
          <div className=""><span className="w-2/5 font-bold">Designation:</span> <span className="ml-2">{employeeInfo.designation}</span></div>
          <div className=""><span className="w-2/5 font-bold">Department:</span> <span className="ml-2">{employeeInfo.department}</span></div>
          <div className=""><span className="w-2/5 font-bold">Work Location:</span> <span className="ml-2">{employeeInfo.work_location}</span></div>
          <div className="">
            <span className="w-2/5 font-bold">Period:</span>
            <span className="font-semibold ml-6 mr-2"></span>
            <select className="text-sm p-2 border rounded min-w-[180px]">
              {employeeInfo.period.map((p, idx) => (
                <option key={idx}>{p}</option>
              ))}
            </select>
            <span className="font-semibold ml-6 mr-2"></span>
            <select className="text-sm p-2 border rounded min-w-[180px]">
              {employeeInfo.period.map((p, idx) => (
                <option key={idx}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>




      {/* Weekly Performance Summary */}
      <div className="bg-white p-4 rounded-2xl max-w-8xl mx-auto mt-4 shadow-md">
        {/* <h2 className="text-2xl font-bold round bg-gray-400 text-gray mt-4  mb-4 rounded-t-md py-2 w-full border-gray-400 pl-4">Weekly Performance Summary</h2> */}
        {/* Legend for short-forms */}
        {/* <div className="mb-4 flex flex-wrap gap-6 text-sm text-gray-700">
          <div><span className="font-semibold">WD</span>: Working Days</div>
          <div><span className="font-semibold">WFH</span>: Work From Home</div>
          <div><span className="font-semibold">WFO</span>: Work From Office</div>
          <div><span className="font-semibold">ED</span>: Extra Days</div>
        </div> */}
       
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm mb-4 text-left border border-gray-200">
            <thead className="bg-gray-200 text-gray-800 font-medium border border-gray-200">
              <tr>
                <th className="border border-gray-200 px-4 py-2">Week</th>
                <th className="border border-gray-200 px-4 py-2">Weekly Success</th>
                <th className="border border-gray-200 px-2 py-2">WD</th>
                <th className="border border-gray-200 px-2 py-2">WFH</th>
                <th className="border border-gray-200 px-2 py-2">WFO</th>
                <th className="border border-gray-200 px-2 py-2">Efforts</th>
                <th className="border border-gray-200 px-2 py-2">Leaves</th>
                <th className="border border-gray-200 px-2 py-2">Holidays</th>
                <th className="border border-gray-200 px-2 py-2">ED</th>
                <th className="border border-gray-200 px-4 py-2">Roadblocks</th>
                <th className="border border-gray-200 px-4 py-2">Unfinished Tasks</th>
                <th className="border border-gray-200 px-4 py-2">Next Actions</th>
                <th className="border border-gray-200 px-2 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {weeklySummary.map((row, i) => (
                <tr key={i} className="">
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
                  <td className="border border-gray-200 px-2 py-2">{row.status === 'R' ? 'Submitted' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-md flex-1 min-w-[300px] shadow-inner">
            <p className="mb-2"><span className="font-semibold text-gray-900">Official Working Days:</span> {weeklyStats.Officialworkingdays} days</p>
            <p className="mb-2"><span className="font-semibold text-gray-900">Official Holidays:</span> {weeklyStats.Officialholidays} day(s)</p>
            <p className="mb-2"><span className="font-semibold text-gray-900">Leaves Taken:</span> {weeklyStats.LeavesTaken} day(s)</p>
            <p><span className="font-semibold text-gray-900">Expected Productive Hours (9hr/day):</span> {weeklyStats.ExpectedProductiveHours} hrs</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-md flex-1 min-w-[300px] shadow-inner">
            <p className="mb-2"><span className="font-semibold text-gray-900">Total Hours Worked:</span> {weeklyStats.TotalHoursWorked} hrs</p>
            <p className="mb-2"><span className="font-semibold text-gray-900">Extra Hours:</span> {weeklyStats.ExtraHoursWorked} hrs</p>
            <p><span className="font-semibold text-gray-900">Extra Hours %:</span> {weeklyStats.ExtraHoursPercentage.toFixed(2)}%</p>
          </div>
        </div>
        
      </div>
      {/* KPI Table */}
      <KpiTable weeklyGoals={weeklyGoals} />
    </div>
  );
};

export default EmsPerformance;
