const RolesPopScreen = ({ isOpen, onClose, weekDetails = [] }) => {
  if (!isOpen) return null;

  // Fallback dummy data if weekDetails is not provided
  const rows = Array.isArray(weekDetails) && weekDetails.length > 0 ? weekDetails : [
    {
      weekStart: '06/03/2025', weekEnd: '12/03/2025', WD: '', H: '', L: '', WFH: '', WFO: '', ED: '', Efforts: '', Status: 'In-Progress',
    },
    {
      weekStart: '06/03/2025', weekEnd: '12/03/2025', WD: '5', H: '', L: '', WFH: '', WFO: '', ED: '', Efforts: '', Status: 'In-Progress',
    },
    {
      weekStart: '06/03/2025', weekEnd: '12/03/2025', WD: '5', H: '', L: '', WFH: '', WFO: '', ED: '', Efforts: '', Status: 'In-Progress',
    },
    {
      weekStart: '06/03/2025', weekEnd: '12/03/2025', WD: '5', H: '', L: '', WFH: '', WFO: '', ED: '', Efforts: '', Status: 'In-Progress',
    },
  ];

  return (
    <div className="absolute left-0 top-0 w-400 h-90 z-30 bg-white/80 backdrop-blur-md flex items-center justify-center" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div className="bg-white rounded-md w-300 shadow p-4 relative">
        <button
          className="absolute top-6 right-9 text-red-500 hover:text-red-700 text-2xl font-bold"
          onClick={onClose}
          title="Close"
        >
          ×
        </button>
        <h6 className="text-2xl text-center font-bold text-white bg-gray-900 px-4 py-2 rounded-t-md">Week Details</h6>
        <table className="w-full text-center text-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="font-bold">
              {[
                'Week Start Date', 'Week End Date', 'WD', 'H', 'L',
                'WFH', 'WFO', 'ED', 'Efforts (D & Hrs)', 'Status', 'Actions'
              ].map((th) => (
                <th key={th} className="p-2 border">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{row.weekStart || '06/03/2025'}</td>
                <td className="p-2 border">{row.weekEnd || '12/03/2025'}</td>
                <td className="p-2 border">{row.WD}</td>
                <td className="p-2 border">{row.H || "56"}</td>
                <td className="p-2 border">{row.L|| "2"}</td>
                <td className="p-2 border">{row.WFH || "2" }</td>
                <td className="p-2 border">{row.WFO || "2"}</td>
                <td className="p-2 border">{row.ED || "2"}</td>
                <td className="p-2 border">{row.Efforts || "2 days 12 hrs"}</td>
                <td className="p-2 border">{row.Status || '-'}</td>
                <td className="p-2 border">
                  <button className="text-blue-500 hover:text-blue-700 mr-2" title="Edit" >✏️</button>
                  <button className="text-green-600 hover:text-green-800" title="Add">➕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesPopScreen;