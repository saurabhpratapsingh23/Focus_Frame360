import React, { useEffect, useState } from 'react';
import PopScreen from './PopScreen';
import { toast } from 'react-toastify';

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
  "goal_es_emp_id": number,
  "goal_es_emp_code": string,
  "goal_es_id": string,
  "goal_es_title": string,
  "goal_es_description": string,
  "goal_es_effort": number,
  "goal_es_efforts_percentage": number
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

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    let empID = '';
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        empID = parsedUser.e_emp_code;
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
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/pms/api/e/wg/${empID}?weeks=16,17,18`)
      .then(res => {
        if (!res.ok) throw new Error(`Goals API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setGoals(data.goals || []);
        setGoalsSummary(data.goalsSummary || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load goals');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">Loading goals...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  const handleUpdateClick = async (goal: Goal) => {
    // Prepare payload for /pms/api/e/getwgrow
    const payload = {
      goal_rec_id: goal.goal_rec_id,
      emp_id: goal.goal_emp_id,
      emp_code: goal.goal_emp_code,
      week_number: goal.goal_week_number,
      co_id: goal.goals_week_co_id,
      week_id: goal.goal_week_number, // If you have a separate week_id field, use that instead
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
        } catch (e) {
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
      // Prepare payload with all required fields
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
        gaols_week_co_id: updatedGoal.goals_week_co_id, // Note: typo as per your JSON
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
          
        } catch (e) {
          console.error('Failed to read backend error response');
        }
        throw new Error('Failed to update goal');
      }
      toast.success('Goal updated successfully!');
      setPopOpen(false);
      setSelectedGoal(null);
      // Refresh the table by re-fetching data
      refreshGoals();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    }
  };

  // Add refreshGoals function to re-fetch goals and summary
  const refreshGoals = () => {
    const userData = localStorage.getItem('currentUser');
    let empID = '';
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        empID = parsedUser.e_emp_code;
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
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/pms/api/e/wg/${empID}?weeks=16,17,18`)
      .then(res => {
        if (!res.ok) throw new Error(`Goals API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setGoals(data.goals || []);
        setGoalsSummary(data.goalsSummary || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load goals');
        setLoading(false);
      });
  };

  // Grouped row classes for zebra striping by goal_id
  const goalRowClasses = getGroupedRowClasses(goals, g => g.goal_id.trim());
  const summaryRowClasses = getGroupedRowClasses(goalsSummary, s => s.goal_es_id.trim());

  // Helper to map rating codes to color names
  const mapRating = (val: string) => {
    if (!val) return '';
    if (val === 'R') return 'Red';
    if (val === 'G') return 'Green';
    if (val === 'O') return 'Orange';
    return val;
  };

  return (
    <div className="space-y-8">
      {/* Table 1: Goals */}
      <div>
        <h2 className="text-lg  px-2  py-2 text-white font-bold mb-4 bg-gray-700 rounded-t-xl">Goals (Weekly Details)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm ">
            <thead className="bg-gray-200">
              <tr>
                <th className="rounded-tl-lg px-2 py-1">Week #</th>
                <th className=" px-2 py-1">Week Start</th>
                <th className=" px-2 py-1">Week End</th>
                <th className=" px-2 py-1">Goal ID</th>
                <th className=" px-2 py-1">Title</th>
                <th className=" px-2 py-1">Description</th>
                <th className=" px-2 py-1">Target</th>
                <th className=" px-2 py-1">Action Performed</th>
                <th className=" px-2 py-1">Challenges</th>
                <th className=" px-2 py-1">Unfinished Tasks</th>
                <th className=" px-2 py-1">Next Actions</th>
                <th className=" px-2 py-1">Effort</th>
                <th className=" px-2 py-1">Own Rating</th>
                <th className=" px-2 py-1">Auditor Rating</th>
                <th className=" px-2 py-1">Auditor Comments</th>
                <th className=" px-2 py-1">Status</th>
                <th className="rounded-tr-lg px-2 py-2">Update Summary</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((g, i) => (
                <tr key={i} className={goalRowClasses[i]}>
                  <td className=" px-2 py-1 text-center">{g.goal_week_number}</td>
                  <td className=" px-2 py-1">{g.goal_week_start_date}</td>
                  <td className=" px-2 py-1">{g.goal_week_end_date}</td>
                  <td className=" px-2 py-1">{g.goal_id.trim()}</td>
                  <td className=" px-2 py-1">{g.goal_title}</td>
                  <td className=" px-2 py-1 whitespace-pre-line">{g.goal_description}</td>
                  <td className=" px-2 py-1">{g.goal_target}</td>
                  <td className=" px-2 py-1 whitespace-pre-line">{g.goal_action_performed}</td>
                  <td className=" px-2 py-1 whitespace-pre-line">{g.goal_challenges}</td>
                  <td className=" px-2 py-1 whitespace-pre-line">{g.goal_unfinished_tasks}</td>
                  <td className=" px-2 py-1 whitespace-pre-line">{g.goal_weekly_next_actions}</td>
                  <td className=" px-2 py-1 text-center">{g.goal_effort}</td>
                  <td className=" px-2 py-1 text-center">
                    {mapRating(g.goal_own_rating) === 'Green' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-green-500 align-middle" title="Green"></span>
                      )}
                    {mapRating(g.goal_own_rating) === 'Orange' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-orange-400 align-middle" title="Orange"></span>
                      )}
                    {mapRating(g.goal_own_rating) === 'Red' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-red-500 align-middle" title="Red"></span>
                      )}
                    {/* <span style={{ fontSize: '0.8em', color: '#888', marginLeft: 4 }}>{g.goal_own_rating}</span> */}
                  </td>
                  <td className=" px-2 py-1 text-center">
                    {mapRating(g.goal_auditor_rating) === 'Green' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-green-500 align-middle" title="Green"></span>
                      )}
                    {mapRating(g.goal_auditor_rating) === 'Orange' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-orange-400 align-middle" title="Orange"></span>
                      )}
                    {mapRating(g.goal_auditor_rating) === 'Red' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-red-500 align-middle" title="Red"></span>
                      )}
                    {/* <span style={{ fontSize: '0.8em', color: '#888', marginLeft: 4 }}>{g.goal_auditor_rating}</span> */}
                  </td>
                  <td className=" px-2 py-1 whitespace-pre-line">{g.goal_auditor_comments}</td>
                  <td className=" px-2 py-1 text-center">{g.goal_status}</td>
                  <td className="px-2 py-2">
                    <button className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md" onClick={() => handleUpdateClick(g)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Goal Summary */}
      <div>
        <h2 className="text-lg  px-2  py-2 text-white font-bold mb-4 bg-gray-700 rounded-t-xl">Goal Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm ">
            <thead className="bg-gray-200">
              <tr>
                <th className="rounded-tl-lg px-2 py-1">Goal ID</th>
                <th className=" px-2 py-1">Title</th>
                <th className=" px-2 py-1">Description</th>
                <th className=" px-2 py-1">Efforts</th>
                <th className="rounded-tr-lg px-2 py-1">Effort Percentage</th>
                {/* <th className="px-2 py-1">Update Summary</th> */}
              </tr>
            </thead>
            <tbody>
              {goalsSummary.map((summary, i) => (
                <tr key={i} className={summaryRowClasses[i]}>
                  <td className=" px-2 py-2">{summary.goal_es_id}</td>
                  <td className=" px-2 py-2">{summary.goal_es_title}</td>
                  <td className=" px-2 py-2 whitespace-pre-line">{summary.goal_es_description}</td>
                  <td className=" px-2 py-2">{summary.goal_es_effort}</td>
                  <td className=" px-2 py-2 text-center">{summary.goal_es_efforts_percentage}</td>
                  {/* <td className="px-2 py-2">
                    <button className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md" onClick={() => handleUpdateClick(summary as any)}>Update</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <PopScreen isOpen={popOpen} goal={selectedGoal} onClose={handlePopClose} onSubmit={handlePopSubmit} />
    </div>
  );
};

export default GoalTable;
