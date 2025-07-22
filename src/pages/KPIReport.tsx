import type { EmployeeInfo as EmployeeInfoType } from "./emsPerformance";

// Mock data for demonstration
// const mockEmployeeInfo: EmployeeInfoType = {
//   emp_code: 'KYC10018',
//   Fullname: 'Kirti Gupta',
//   designation: 'Software Development Engineer',
//   department: 'Development Functions',
//   work_location: 'NCR',
// };

{/* <div className="bg-white p-8 rounded-2xl max-w-8xl mx-auto shadow-md mb-8">
</div> */}

const EmployeeInfoCard: React.FC<{ info: EmployeeInfoType }> = ({ info }) => (
    <>
    
    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">Employee Profile</h2>
    {/* <table className="w-full text-sm border-collapse mb-8">
      <tbody>
        <tr><th className="w-2/5 bg-blue-50 font-semibold text-left p-3 border">Employee Code</th><td className="p-3 border">{info.emp_code}</td></tr>
        <tr><th className="bg-blue-50 font-semibold text-left p-3 border">Name</th><td className="p-3 border">{info.Fullname}</td></tr>
        <tr><th className="bg-blue-50 font-semibold text-left p-3 border">Designation</th><td className="p-3 border">{info.designation}</td></tr>
        <tr><th className="bg-blue-50 font-semibold text-left p-3 border">Department</th><td className="p-3 border">{info.department}</td></tr>
        <tr><th className="bg-blue-50 font-semibold text-left p-3 border">Work Location</th><td className="p-3 border">{info.work_location}</td></tr>
      </tbody>
    </table> */}
    </>
);

const KpiTable: React.FC = () => (
    <div>
       <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">Key Parameters Matrix</h2>
      <div className="overflow-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-300 text-center">
            <tr>
              {[
                'Goal Code', 'Service Area', 'Service Description', 'SLA Metric', 'SLA Target',
                '13-Apr-19', '20–26', '27–3 May', '4–10th', '11–17th', '18–24th', '25th–31',
                'G', 'O', 'R', 'Status', 'Comments'
              ].map((header) => (
                <th key={header} className="border px-3 py-2 text-sm text-gray-800">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="border px-2 py-1 font-semibold">1</td>
              <td className="border px-2 py-1">Feature Delivery</td>
              <td className="border px-2 py-1">Timely delivery of committed features</td>
              <td className="border px-2 py-1">% Feature Completion</td>
              <td className="border px-2 py-1">&ge; 95%</td>
              <td className="border px-2 py-1">G</td>
              <td className="border px-2 py-1">O</td>
              <td className="border px-2 py-1">G</td>
              <td className="border px-2 py-1">-</td>
              <td className="border px-2 py-1">O</td>
              <td className="border px-2 py-1">O</td>
              <td className="border px-2 py-1">G</td>
              <td className="border px-2 py-1">2</td>
              <td className="border px-2 py-1">3</td>
              <td className="border px-2 py-1">1</td>
              <td className="border px-2 py-1">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500"></span>
              </td>
              <td className="border px-2 py-1 text-left">Seems like missing timelines or delays</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const KPIReport: React.FC = () => {
    return (
      <div className="bg-gray-100 p-8 text-gray-800 min-h-screen">
        <div className="bg-white p-8 rounded-2xl max-w-8xl mx-auto shadow-md">
          {/* <EmployeeInfoCard info={mockEmployeeInfo} /> */}
          <KpiTable />
        </div>
      </div>
    );
  };
  
  export default KPIReport;
  