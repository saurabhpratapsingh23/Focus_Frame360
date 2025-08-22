import React, { useEffect, useState } from 'react';
import PopScreen from './PopScreen';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from './TablePaginationActions';

interface Goal {
  goal_rec_id: number;
  goal_emp_id: number;
  goal_emp_code: string;
  goal_week_number: number;
  goal_id: string;
  goal_action_performed: string;
  goal_challenges: string;
  goal_unfinished_tasks: string;
  goal_weekly_next_actions: string;
  goal_status: string;
  goal_effort: number;
  goal_own_rating: string;
  goal_auditor_rating: string;
  goal_auditor_comments: string;
  goal_data_source_description: string;
  goal_team_members: string;
  goal_title: string;
  goal_description: string;
  goal_target: string;
  goal_week_start_date: string;
  goal_week_end_date: string;
  goals_week_co_id: number;
}

interface goalsSummary {
  goal_es_emp_id: number,
  goal_es_emp_code: string,
  goal_es_id: string,
  goal_es_title: string,
  goal_es_description: string,
  goal_es_effort: number,
  goal_es_efforts_percentage: number
}

// Helper function to generate group-based zebra striping classes
function getGroupedRowClasses<T>(items: T[], getId: (item: T) => string, baseClass = ""): string[] {
  let lastId = "";
  let isGray = false;
  return items.map((item) => {
    const id = getId(item);
    if (id !== lastId) {
      isGray = !isGray;
      lastId = id;
    }
    return `${baseClass} ${isGray ? "bg-gray-200" : "bg-white"}`;
  });
}

const GoalTable: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsSummary, setGoalsSummary] = useState<goalsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popOpen, setPopOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Pagination states for first table (Goals)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination states for second table (Goal Summary)
  const [summaryPage, setSummaryPage] = useState(0);
  const [summaryRowsPerPage, setSummaryRowsPerPage] = useState(10);

  // Filter and sort states
  const [filterWeek, setFilterWeek] = useState<string>('');
  const [filterGoalId, setFilterGoalId] = useState<string>('');
  const [sortByGoalId, setSortByGoalId] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = () => {
    const empId = sessionStorage.getItem('e_emp_id');
    if (!empId) {
      setError('Employee ID not found. Please login again.');
      setLoading(false);
      return;
    }
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/pms/api/e/wg/${empId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Goals API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const goalsData = data.goals || [];
        const sortedGoals = goalsData.sort((a: any, b: any) => {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          const dateA = new Date(a.goal_week_start_date);
          const dateB = new Date(b.goal_week_start_date);
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
        setGoals(sortedGoals);
        setGoalsSummary(data.goalsSummary || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load goals');
        setLoading(false);
      });
  };

  // Filter, sort, and paginate displayedGoals
  const getFilteredSortedGoals = () => {
    let filtered = goals;
    if (filterWeek) {
      filtered = filtered.filter(g => g.goal_week_number.toString() === filterWeek);
    }
    if (filterGoalId) {
      filtered = filtered.filter(g => g.goal_id.trim().toLowerCase().includes(filterGoalId.trim().toLowerCase()));
    }
    filtered = [...filtered].sort((a, b) => {
      const aId = a.goal_id.trim().toUpperCase();
      const bId = b.goal_id.trim().toUpperCase();
      return sortByGoalId === 'asc'
        ? aId.localeCompare(bId)
        : bId.localeCompare(aId);
    });
    return filtered;
  };

  const filteredGoals = getFilteredSortedGoals();
  const paginatedGoals = rowsPerPage > 0
    ? filteredGoals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredGoals;

  // Pagination for Goal Summary table
  const paginatedSummary = summaryRowsPerPage > 0
    ? goalsSummary.slice(summaryPage * summaryRowsPerPage, summaryPage * summaryRowsPerPage + summaryRowsPerPage)
    : goalsSummary;

  if (loading) return <div className="flex justify-center items-center min-h-[120px] text-gray-600 text-base sm:text-lg">Loading goals...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[120px] text-red-600 text-base sm:text-lg">{error}</div>;

  const handleUpdateClick = async (goal: Goal) => {
    const payload = {
      goal_rec_id: goal.goal_rec_id,
      emp_id: goal.goal_emp_id,
      emp_code: goal.goal_emp_code,
      week_number: goal.goal_week_number,
      co_id: goal.goals_week_co_id,
      week_id: goal.goal_week_number,
    };
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/pms/api/e/getwgrow`, {
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
        throw new Error('Failed to fetch goal row');
      }
      const data = await res.json();
      setSelectedGoal(data);
      setPopOpen(true);
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    }
  };

  const handlePopClose = () => {
    setPopOpen(false);
    setSelectedGoal(null);
  };

  const handlePopSubmit = async (updatedGoal: Goal) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const payload = {
        goal_rec_id: updatedGoal.goal_rec_id,
        goal_emp_id: updatedGoal.goal_emp_id,
        goal_emp_code: updatedGoal.goal_emp_code,
        goal_week_number: updatedGoal.goal_week_number,
        goal_id: updatedGoal.goal_id,
        goal_action_performed: updatedGoal.goal_action_performed,
        goal_challenges: updatedGoal.goal_challenges,
        goal_unfinished_tasks: updatedGoal.goal_unfinished_tasks,
        goal_weekly_next_actions: updatedGoal.goal_weekly_next_actions,
        goal_status: updatedGoal.goal_status,
        goal_effort: Number(updatedGoal.goal_effort),
        goal_own_rating: updatedGoal.goal_own_rating,
        goal_auditor_rating: updatedGoal.goal_auditor_rating,
        goal_auditor_comments: updatedGoal.goal_auditor_comments,
        goal_data_source_description: updatedGoal.goal_data_source_description,
        goal_team_members: updatedGoal.goal_team_members,
        goal_title: updatedGoal.goal_title,
        goal_description: updatedGoal.goal_description,
        goal_target: updatedGoal.goal_target,
        goal_week_start_date: updatedGoal.goal_week_start_date,
        goal_week_end_date: updatedGoal.goal_week_end_date,
        gaols_week_co_id: updatedGoal.goals_week_co_id, // typo kept per your JSON
      };
      const res = await fetch(`${API_BASE_URL}/pms/api/e/postwgrow`, {
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
        throw new Error('Failed to update goal');
      }
      toast.success('Goal updated successfully!');
      setPopOpen(false);
      setSelectedGoal(null);
      fetchGoals(); // refresh after update
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    }
  };

  // Grouped row classes for zebra striping by goal_id
  const goalRowClasses = getGroupedRowClasses(paginatedGoals, g => g.goal_id.trim());
  const summaryRowClasses = getGroupedRowClasses(paginatedSummary, s => s.goal_es_id.trim());

  // Helper to map rating codes to color names
  const mapRating = (val: string) => {
    if (!val) return '';
    if (val === 'R') return 'Red';
    if (val === 'G') return 'Green';
    if (val === 'O') return 'Orange';
    return val;
  };

  return (
    <div className="space-y-8 max-w-8xl mx-auto p-2 sm:p-4">

      {/* Table 1: Goals */}
      <div>
        <div className="mb-2">
          <h2 className="flex flex-col sm:flex-row justify-between items-center text-lg sm:text-2xl px-2 py-2 text-white font-bold mb-4 bg-gray-900 rounded-t-xl gap-2">
            <span className="content-center flex-shrink-0">Goals (Weekly Details)</span>
            <div className="flex gap-2 flex-wrap items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">Week</label>
                <select
                  className="border rounded px-1 py-0.5 text-xs bg-white text-gray-900"
                  value={filterWeek}
                  onChange={e => {
                    setPage(0);
                    setFilterWeek(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  {[...new Set(goals.map(g => g.goal_week_number))].sort((a, b) => a - b).map(week => (
                    <option key={week} value={week}>{week}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">Goal ID</label>
                <input
                  className="border rounded px-1 py-0.5 text-xs bg-white text-gray-900"
                  type="text"
                  placeholder="Search"
                  value={filterGoalId}
                  onChange={e => {
                    setPage(0);
                    setFilterGoalId(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">Sort ID</label>
                <select
                  className="border rounded px-1 py-0.5 text-xs bg-white text-gray-900"
                  value={sortByGoalId}
                  onChange={e => setSortByGoalId(e.target.value as 'asc' | 'desc')}
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </div>
            </div>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-xs sm:text-sm ">
            <thead className="bg-blue-100 text-[95%] ">
              <tr>
                <th className="border border-gray-100 rounded-tl-lg font-bold px-2 py-1">Week #</th>
                <th className="border border-gray-100  px-3 py-1">Week Start</th>
                <th className="border border-gray-100 px-3 py-1">Week End</th>
                <th className="border border-gray-100 px-2 py-1">Goal ID</th>
                <th className="border border-gray-100 px-2 py-1">Title</th>
                <th className="border border-gray-100 px-2 py-1">Description</th>
                <th className="border border-gray-100 px-2 py-1 ">Target</th>
                <th className="border border-gray-100 px-2 py-1">Action Performed</th>
                <th className="border border-gray-100 px-2 py-1">Challenges</th>
                <th className="border border-gray-100 px-2 py-1">Unfinished Tasks</th>
                <th className="border border-gray-100 px-2 py-1">Next Actions</th>
                <th className="border border-gray-100 px-2 py-1">Effort</th>
                <th className="border border-gray-100 px-2 py-1">Own Rating</th>
                <th className="border border-gray-100 px-2 py-1">Auditor Rating</th>
                <th className="border border-gray-100 px-2 py-1">Auditor Comments</th>
                <th className="border border-gray-100 px-2 py-1">Status</th>
                <th className="border border-gray-100 rounded-tr-lg px-2 py-2">Update Summary</th>
              </tr>
            </thead>
            <tbody className='border border-gray-200 '>
              {paginatedGoals.map((g, i) => (
                <tr key={i} className={goalRowClasses[i]}>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm">{g.goal_week_number}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 text-xs sm:text-sm">{g.goal_week_start_date}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 text-xs sm:text-sm">{g.goal_week_end_date}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 w-30 text-xs sm:text-sm">{g.goal_id.trim()}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 font-bold text-xs sm:text-sm">{g.goal_title}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 whitespace-pre-line text-xs sm:text-sm">{g.goal_description}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm">{g.goal_target}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 whitespace-pre-line text-xs sm:text-sm">{g.goal_action_performed}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 whitespace-pre-line text-xs sm:text-sm">{g.goal_challenges}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 whitespace-pre-line text-xs sm:text-sm">{g.goal_unfinished_tasks}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 whitespace-pre-line text-xs sm:text-sm">{g.goal_weekly_next_actions}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm">{g.goal_effort}</td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm">
                    {mapRating(g.goal_own_rating) === 'Green' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-green-500 align-middle" title="Green"></span>
                      )}
                    {mapRating(g.goal_own_rating) === 'Orange' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-orange-400 align-middle" title="Orange"></span>
                      )}
                    {mapRating(g.goal_own_rating) === 'Red' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-red-500 align-middle" title="Red"></span>
                      )}
                  </td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm">
                    {mapRating(g.goal_auditor_rating) === 'Green' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-green-500 align-middle" title="Green"></span>
                      )}
                    {mapRating(g.goal_auditor_rating) === 'Orange' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-orange-400 align-middle" title="Orange"></span>
                      )}
                    {mapRating(g.goal_auditor_rating) === 'Red' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-red-500 align-middle" title="Red"></span>
                      )}
                  </td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-1 whitespace-pre-line text-xs sm:text-sm">{g.goal_auditor_comments}</td>
                  <td className="border border-gray-300 w-25 text-center">
                    {(() => {
                      const status = (g.goal_status || '').toLowerCase();
                      let color = 'bg-gray-700';
                      if (status === 'in progress' || status === 'in-progress') color = 'bg-orange-400';
                      else if (status === 'pending') color = 'bg-red-500';
                      else if (status === 'completed') color = 'bg-green-500';
                      return (
                        <span className={`${color} text-white text-[11px] sm:text-[13px] rounded-full px-2 py-2 opacity-75 mr-2`}>
                          {g.goal_status}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="border border-gray-300 px-1 sm:px-2 py-2">
                    <button className="bg-blue-400 hover:bg-blue-600 hover:text-white text-blue px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-2xl flex items-center justify-center cursor-pointer" onClick={() => handleUpdateClick(g)}
                      title="Edit">
                        <EditIcon fontSize="small" />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <TablePagination
                  colSpan={17}
                  className="bg-gray-400 rounded-2xl"
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  count={filteredGoals.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    },
                  }}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={event => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  ActionsComponent={TablePaginationActions}
                />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Table 2: Goal Summary */}
      <div>
        <h2 className="text-lg sm:text-2xl text-center px-2 py-2 text-white font-bold mb-4 bg-gray-900 rounded-t-xl">Goal Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-xs sm:text-sm ">
            <thead className="bg-blue-100 text-[110%] sm:text-[120%]">
              <tr>
                <th className="rounded-tl-lg px-4 py-2">Goal ID</th>
                <th className=" px-2 py-1">Title</th>
                <th className=" px-2 py-1">Description</th>
                <th className=" px-2 py-1">Efforts</th>
                <th className="rounded-tr-lg px-2 py-1">Effort Percentage</th>
              </tr>
            </thead>
            <tbody className='border border-gray-200 '>
              {paginatedSummary.map((summary, i) => (
                <tr key={i} className={summaryRowClasses[i]}>
                  <td className="px-1 sm:px-2 py-2 w-40 text-xs sm:text-sm">{summary.goal_es_id}</td>
                  <td className="px-1 sm:px-2 py-2 font-bold text-xs sm:text-sm">{summary.goal_es_title}</td>
                  <td className="px-1 sm:px-2 py-2 whitespace-pre-line text-xs sm:text-sm">{summary.goal_es_description}</td>
                  <td className="px-1 sm:px-2 py-2 text-center text-xs sm:text-sm">{summary.goal_es_effort}</td>
                  <td className="px-1 sm:px-2 py-2 text-center text-xs sm:text-sm">{summary.goal_es_efforts_percentage + "%"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <TablePagination
                  colSpan={5}
                  className="bg-gray-400 rounded-2xl"
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  count={goalsSummary.length}
                  rowsPerPage={summaryRowsPerPage}
                  page={summaryPage}
                  slotProps={{
                    select: {
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    },
                  }}
                  onPageChange={(event, newPage) => setSummaryPage(newPage)}
                  onRowsPerPageChange={event => {
                    setSummaryRowsPerPage(parseInt(event.target.value, 10));
                    setSummaryPage(0);
                  }}
                />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <PopScreen isOpen={popOpen} goal={selectedGoal} onClose={handlePopClose} onSubmit={handlePopSubmit} />
    </div>
  );
};

export default GoalTable;
