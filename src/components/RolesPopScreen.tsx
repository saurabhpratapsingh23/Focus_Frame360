import React, { useState, useEffect } from 'react';
import apiService, { WeekDetailsRow } from '../lib/apiService';

interface RolesPopScreenProps {
  isOpen: boolean;
  onClose: () => void;
  weekDetails?: WeekDetailsRow[];
  empId?: number;
  weekId?: number;
}

const RolesPopScreen: React.FC<RolesPopScreenProps> = ({ 
  isOpen, 
  onClose, 
  weekDetails = [],
  empId = 13,
  weekId = 14
}) => {
  const [rows, setRows] = useState<WeekDetailsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API when component opens
  useEffect(() => {
    if (isOpen && empId && weekId) {
      fetchWeekData();
    }
  }, [isOpen, empId, weekId]);

  const fetchWeekData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If weekDetails is provided, use it; otherwise fetch from API
      if (Array.isArray(weekDetails) && weekDetails.length > 0) {
        setRows(weekDetails);
      } else {
        const apiData = await apiService.getFreshWeek(empId, weekId);
        const transformedData = apiService.transformToTableRow(apiData);
        setRows([transformedData]);
      }
    } catch (err) {
      console.error('Error fetching week data:', err);
      setError('Failed to load week data. Please try again.');
      // Fallback to dummy data
      setRows([
        {
          weekStart: '06/03/2025', 
          weekEnd: '12/03/2025', 
          WD: '5', 
          H: '56', 
          L: '2', 
          WFH: '2', 
          WFO: '2', 
          ED: '2', 
          Efforts: '2 days 12 hrs', 
          Status: 'In-Progress',
        },
        {
          weekStart: '06/03/2025', 
          weekEnd: '12/03/2025', 
          WD: '5', 
          H: '56', 
          L: '2', 
          WFH: '2', 
          WFO: '2', 
          ED: '2', 
          Efforts: '2 days 12 hrs', 
          Status: 'In-Progress',
        },
        {
          weekStart: '06/03/2025', 
          weekEnd: '12/03/2025', 
          WD: '5', 
          H: '56', 
          L: '2', 
          WFH: '2', 
          WFO: '2', 
          ED: '2', 
          Efforts: '2 days 12 hrs', 
          Status: 'In-Progress',
        },
        {
          weekStart: '06/03/2025', 
          weekEnd: '12/03/2025', 
          WD: '5', 
          H: '56', 
          L: '2', 
          WFH: '2', 
          WFO: '2', 
          ED: '2', 
          Efforts: '2 days 12 hrs', 
          Status: 'In-Progress',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
        
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading week data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-600 mb-2">{error}</p>
            <button 
              onClick={fetchWeekData}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
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
                  <td className="p-2 border">{row.weekStart}</td>
                  <td className="p-2 border">{row.weekEnd}</td>
                  <td className="p-2 border">{row.WD}</td>
                  <td className="p-2 border">{row.H}</td>
                  <td className="p-2 border">{row.L}</td>
                  <td className="p-2 border">{row.WFH}</td>
                  <td className="p-2 border">{row.WFO}</td>
                  <td className="p-2 border">{row.ED}</td>
                  <td className="p-2 border">{row.Efforts}</td>
                  <td className="p-2 border">{row.Status}</td>
                  <td className="p-2 border">
                    <button className="text-blue-500 hover:text-blue-700 mr-2" title="Edit" >✏️</button>
                    <button className="text-green-600 hover:text-green-800" title="Add">➕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RolesPopScreen;