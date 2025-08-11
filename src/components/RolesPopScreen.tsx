import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../lib/apiService';
import type { WeekDetailsRow } from '../lib/apiService';
import WeeklySummaryPopScreen from './WeeklySummaryPopScreen';

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
  empId,
  weekId
}) => {
  const [rows, setRows] = useState<WeekDetailsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState<number | null>(null);
  const [weeklySummaryData, setWeeklySummaryData] = useState<any>(null);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);

  // Get empId from sessionStorage if not provided
  const getEmpId = (): number => {
    if (empId) return empId;
    const storedEmpId = sessionStorage.getItem('e_emp_id');
    return storedEmpId ? parseInt(storedEmpId, 10) : 0;
  };

  // Handle edit button click - this is the main trigger for API call
  const handleEdit = async (row: WeekDetailsRow, index: number) => {
    const currentEmpId = getEmpId();
    if (!currentEmpId) {
      toast.error('Error: Employee ID not found. Please login again.');
      return;
    }

    if (!row.week_id) {
      // console.error('Missing week_id for row:', row);
      toast.error('Error: Missing week ID for this row.');
      return;
    }

    setEditLoading(index);
    try {
      console.log(`Editing week data for empId: ${currentEmpId}, weekId: ${row.week_id}`);
      console.log('Row data:', row);
      
      // Prepare request data for getwsrow API
      const requestData = {
        goal_rec_id: 0,
        emp_id: currentEmpId,
        emp_code: row.emp_code || "",
        week_number: row.week_number || 0,
        co_id: 1,
        week_id: row.week_id
      };
      
      // console.log('Calling getwsrow API with data:', requestData);
      
      // Call the getwsrow API
      const response = await apiService.getWsRow(requestData);
      // console.log('Get WS Row API Response:', response);
      
      // Open WeeklySummaryPopScreen with the data
      setWeeklySummaryData(response);
      setShowWeeklySummary(true);
      
    } catch (err: any) {
      console.error('Error editing week data:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        row: row
      });
      
      // Handle specific error messages
      const errorMessage = err.message || 'An unknown error occurred';
      
      if (errorMessage.includes('ROLE_NOT_DEFINED')) {
        toast.error('No Roles & Resposibility is allocated for the selected employee');
      } else if (errorMessage.includes('ENTRY_FOUND')) {
        toast.error('Weekly Data Already Present for selected employee & week');
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setEditLoading(null);
    }
  };

  // Handle add button click
  const handleAdd = async (row: WeekDetailsRow, index: number) => {
    const currentEmpId = getEmpId();
    if (!currentEmpId) {
      toast.error('Error: Employee ID not found. Please login again.');
      return;
    }

    if (!row.week_id) {
      console.error('Missing week_id for row:', row);
      toast.error('Error: Missing week ID for this row.');
      return;
    }

    setEditLoading(index);
    try {
      console.log(`Adding week data for empId: ${currentEmpId}, weekId: ${row.week_id}`);
      console.log('Row data:', row);
      
      // Call the freshweek API using empId from sessionStorage and weekId from row
      const response = await apiService.getFreshWeek(currentEmpId, row.week_id);
      console.log('Add API Response:', response);
      
      // Open WeeklySummaryPopScreen with the data
      setWeeklySummaryData(response);
      setShowWeeklySummary(true);
      
    } catch (err: any) {
      console.error('Error adding week data:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        row: row
      });
      
      // Handle specific error messages
      const errorMessage = err.message || 'An unknown error occurred';
      
      if (errorMessage.includes('ROLE_NOT_DEFINED')) {
        toast.error('No Roles & Resposibility is allocated for the selected employee');
      } else if (errorMessage.includes('ENTRY_FOUND')) {
        toast.error('Weekly Data Already Present for selected employee & week');
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setEditLoading(null);
    }
  };

  // Handle WeeklySummaryPopScreen close
  const handleWeeklySummaryClose = () => {
    setShowWeeklySummary(false);
    setWeeklySummaryData(null);
  };

  // Handle WeeklySummaryPopScreen save
  const handleWeeklySummarySave = async (payload: any) => {
    // Save weekly summary row to backend
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
        } catch (e) {
          console.error('Failed to read backend error response');
        }
        throw new Error('Failed to save weekly summary row');
      }
      toast.success('Weekly summary row saved successfully!');
      handleWeeklySummaryClose();
      // Optionally refresh week listing data
      fetchWeekListingData();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    }
  };

  // Fetch week listing data when edit button is clicked
  const fetchWeekListingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentEmpId = getEmpId();
      if (!currentEmpId) {
        throw new Error('Employee ID not found. Please login again.');
      }
      
      // Fetch week listing data
      const weekListingData = await apiService.getWeekListing(currentEmpId);
      const transformedData = apiService.transformWeekListingToTableRows(weekListingData);
      
      // Sort data: recent weeks first (current week on top, then descending)
      const sortedData = transformedData.sort((a, b) => {
        const dateA = new Date(a.weekStart);
        const dateB = new Date(b.weekStart);
        return dateB.getTime() - dateA.getTime(); // Descending order
      });
      
      setRows(sortedData);
    } catch (err: any) {
      console.error('Error fetching week listing data:', err);
      setError(err.message || 'Failed to load week data. Please try again.');
      setRows([]); // No dummy data
    } finally {
      setLoading(false);
    }
  };

  // Get status display text
  const getStatusDisplay = (status: string): string => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'U':
        return 'No Data Avl.';
      case 'I':
        return 'In-Progress';
      case 'S':
        return 'Submitted';
      case 'C':
        return 'Completed';
      default:
        // Take only first letter of the word if status is something else
        return status ? status: 'Unknown';
    }
  };

  // Check if status is U/u
  const isStatusU = (status: string): boolean => {
    return status?.toUpperCase() === 'U';
  };

  // Check if status is S/s
  const isStatusS = (status: string): boolean => {
    return status?.toUpperCase() === 'S';
  };

  // Check if status should show edit button (all except U and S)
  const shouldShowEditButton = (status: string): boolean => {
    const statusUpper = status?.toUpperCase();
    return statusUpper !== 'U' && statusUpper !== 'S';
  };

  // Check if status should show add button (U/u status only)
  const shouldShowAddButton = (status: string): boolean => {
    return isStatusU(status);
  };

  // Load data when component opens
  useEffect(() => {
    if (isOpen) {
      fetchWeekListingData();
    }
  }, [isOpen]);

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
              onClick={fetchWeekListingData}
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
                  'WFH', 'WFO', 'WOH', 'Efforts (In Hrs)', 'Status', 'Actions'
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
                  <td className="p-2 border">
                    <span className={`font-bold ${isStatusU(row.Status) ? 'text-red-500' : ''}`}>
                      {getStatusDisplay(row.Status)}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {/* Show Edit button for all statuses except U and S */}
                    {shouldShowEditButton(row.Status) && (
                      <button 
                        className="text-blue-500 hover:text-blue-700 mr-2" 
                        title="Edit" 
                        onClick={() => handleEdit(row, idx)}
                        disabled={editLoading === idx}
                      >
                        {editLoading === idx ? (
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></span>
                        ) : (
                          '✏️'
                        )}
                      </button>
                    )}
                    
                    {/* Show Add button only for U/u status */}
                    {shouldShowAddButton(row.Status) && (
                      <button 
                        className="text-green-600 hover:text-green-800" 
                        title="Add" 
                        onClick={() => handleAdd(row, idx)}
                      >
                        ➕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* WeeklySummaryPopScreen */}
      {showWeeklySummary && weeklySummaryData && (
        <WeeklySummaryPopScreen
          isOpen={showWeeklySummary}
          onClose={handleWeeklySummaryClose}
          data={weeklySummaryData}
          onSave={handleWeeklySummarySave}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default RolesPopScreen;