import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WeekDetail {
  weekStart: string;
  weekEnd: string;
  WD: number;
  H: number;
  L: number;
  WFH: number;
  WFO: number;
  ED: number;
  Efforts: string;
  Status: string;
}

const initialWeekDetails: WeekDetail[] = [
  {
    weekStart: '',
    weekEnd: '',
    WD: 5,
    H: 0,
    L: 0,
    WFH: 3,
    WFO: 2,
    ED: 1,
    Efforts: '6 Days | 45 hrs',
    Status: 'In-Progress',
  },
];

const WeeklyRoleSummary: React.FC = () => {
  const [weekDetails, setWeekDetails] = useState<WeekDetail[]>(initialWeekDetails);
  const navigate = useNavigate();

  useEffect(() => {
    // Load weekDetails from localStorage
    const stored = localStorage.getItem('weekDetails');
    if (stored) {
      setWeekDetails(JSON.parse(stored));
    } else {
      setWeekDetails(initialWeekDetails);
    }
  }, []);

  // Calculate totals for each numeric column
  // const totals = weekDetails.reduce(
  //   (acc, row) => {
  //     acc.WD += Number(row.WD) || 0;
  //     acc.H += Number(row.H) || 0;
  //     acc.L += Number(row.L) || 0;
  //     acc.WFH += Number(row.WFH) || 0;
  //     acc.WFO += Number(row.WFO) || 0;
  //     acc.ED += Number(row.ED) || 0;
  //     return acc;
  //   },
  //   { WD: 0, H: 0, L: 0, WFH: 0, WFO: 0, ED: 0 }
  // );

  // Handlers for navigation
  const handleEdit = (idx: number) => {
    navigate('/app/weeklysummaryentry', { state: { editIndex: idx, weekDetail: weekDetails[idx] } });
  };
  
  const handleAdd = () => {
    navigate('/app/weeklysummaryentry', { state: { editIndex: null } });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-sm">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 ml-4">
          <h5 className="text-lg font-bold text-white bg-blue-900 px-4 py-2 rounded-t-md">Employee Weekly Summary</h5>
        </div>

        {/* My Role Section */}
        <div className="bg-white rounded-md shadow p-4">
          <h6 className="text-lg font-bold text-white bg-blue-900 px-4 py-2 rounded-t-md">My Role</h6>
          <table className="w-full table-auto text-left text-sm border-t border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 w-[70%] font-medium">Functional Role</th>
                <th className="p-2 text-center font-medium">Assigned Responsibility</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">Manage social media presence across platforms</td>
                <td className="p-2 text-center">
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75">Perform</span>
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75">Rescue</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Conduct SEO reviews and updates for better search visibility</td>
                <td className="p-2 text-center">
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75">Perform</span>
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75">Rescue</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Week Details Section */}
        <div className="bg-white rounded-md shadow p-4">
          <h6 className="text-lg font-bold text-white bg-blue-900 px-4 py-2 rounded-t-md">Week Details</h6>
          <table className="w-full text-center text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  'Week Start Date', 'Week End Date', 'WD', 'H', 'L',
                  'WFH', 'WFO', 'ED', 'Efforts (D & Hrs)', 'Status', 'Actions'
                ].map((th) => (
                  <th key={th} className="p-2 border font-medium">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDetails.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{row.weekStart || '-'}</td>
                  <td className="p-2 border">{row.weekEnd || '-'}</td>
                  <td className="p-2 border">{row.WD}</td>
                  <td className="p-2 border">{row.H}</td>
                  <td className="p-2 border">{row.L}</td>
                  <td className="p-2 border">{row.WFH}</td>
                  <td className="p-2 border">{row.WFO}</td>
                  <td className="p-2 border">{row.ED}</td>
                  <td className="p-2 border">{row.Efforts}</td>
                  <td className="p-2 border">
                    <span className={`bg-${row.Status === 'Completed' ? 'green' : row.Status === 'un-touched' ? 'gray' : 'yellow'}-100 text-${row.Status === 'Completed' ? 'green' : row.Status === 'un-touched' ? 'gray' : 'yellow'}-800 text-xs font-medium rounded-full px-3 py-1`}>
                      {row.Status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <button className="text-blue-500 hover:text-blue-700 mr-2" title="Edit" onClick={() => handleEdit(idx)}>✏️</button>
                    <button className="text-green-600 hover:text-green-800" title="Add" onClick={handleAdd}>➕</button>
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
        </div>

        {/* Legend Section */}
        <div className="bg-white rounded-md shadow p-4 text-xs text-gray-600">
          WD = Working Days, H = Holidays, L = Leaves, WFH = Working from Home, WFO = Working from Office, ED = Extra day(s);
          <strong className="ml-2">[Displaying last 12 Weeks]</strong>
        </div>

      </div>
    </div>
  );
};

export default WeeklyRoleSummary;
