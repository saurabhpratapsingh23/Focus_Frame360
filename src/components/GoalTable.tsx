import React, { useEffect, useState } from 'react';
import PopScreen from './PopScreen';

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

  const handleUpdateClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setPopOpen(true);
  };

  const handlePopClose = () => {
    setPopOpen(false);
    setSelectedGoal(null);
  };

  const handlePopSubmit = async (updatedGoal: Goal) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      // Ensure all required fields are present and have correct types
      const ensureString = (val: any) => (typeof val === 'string' ? val : (val == null ? '' : String(val)));
      const ensureNumber = (val: any) => (typeof val === 'number' ? val : Number(val) || 0);
      // Try to convert date to YYYY-MM-DD if possible
      const toISODate = (val: any) => {
        if (!val) return '';
        if (/\d{4}-\d{2}-\d{2}/.test(val)) return val; // already ISO
        // Try to parse formats like '15-Jun' or '21-Jun'
        const d = Date.parse(val);
        if (!isNaN(d)) return new Date(d).toISOString().slice(0, 10);
        // fallback: return as is
        return val;
      };
      // Fill with defaults if missing
      const payload = {
        goal_rec_id: ensureNumber(updatedGoal.goal_rec_id),
        goal_emp_id: ensureNumber(updatedGoal.goal_emp_id),
        goal_emp_code: ensureString(updatedGoal.goal_emp_code),
        goal_week_number: ensureNumber(updatedGoal.goal_week_number),
        goal_id: ensureString(updatedGoal.goal_id),
        goal_action_performed: ensureString(updatedGoal.goal_action_performed),
        goal_challenges: ensureString(updatedGoal.goal_challenges),
        goal_unfinished_tasks: ensureString(updatedGoal.goal_unfinished_tasks),
        goal_weekly_next_actions: ensureString(updatedGoal.goal_weekly_next_actions),
        goal_status: ensureString(updatedGoal.goal_status),
        goal_effort: ensureNumber(updatedGoal.goal_effort),
        goal_own_rating: ensureString(updatedGoal.goal_own_rating),
        goal_auditor_rating: ensureString(updatedGoal.goal_auditor_rating),
        goal_auditor_comments: ensureString(updatedGoal.goal_auditor_comments),
        goal_data_source_description: ensureString(updatedGoal.goal_data_source_description),
        goal_team_members: ensureString(updatedGoal.goal_team_members),
        goal_title: ensureString(updatedGoal.goal_title),
        goal_description: ensureString(updatedGoal.goal_description),
        goal_target: ensureString(updatedGoal.goal_target),
        goal_week_start_date: toISODate(updatedGoal.goal_week_start_date),
        goal_week_end_date: toISODate(updatedGoal.goal_week_end_date),
        goals_week_co_id: ensureNumber((updatedGoal as any).goals_week_co_id),
      };
      console.log('Final payload being sent:', payload);
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
      setGoals(goals => goals.map(g => g.goal_rec_id === payload.goal_rec_id ? { ...payload } : g));
      setPopOpen(false);
      setSelectedGoal(null);
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  // Grouped row classes for zebra striping by goal_id
  const goalRowClasses = getGroupedRowClasses(goals, g => g.goal_id.trim());
  const summaryRowClasses = getGroupedRowClasses(goalsSummary, s => s.goal_es_id.trim());

  return (
    <div className="space-y-8">
      {/* Table 1: Goals */}
      <div>
        <h2 className="text-xl font-bold mb-4 p-2">Goals (Weekly Details)</h2>
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
                  <td className=" px-2 py-1 text-center">{g.goal_own_rating}</td>
                  <td className=" px-2 py-1 text-center">{g.goal_auditor_rating}</td>
                  <td className=" px-2 py-1 whitespace-pre-line">{g.goal_auditor_comments}</td>
                  <td className=" px-2 py-1 text-center">{g.goal_status}</td>
                  <td className="px-2 py-2">
                    <button className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md" onClick={() => handleUpdateClick(g)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Goal Summary */}
      <div>
        <h2 className="text-xl font-bold mb-4 p-2">Goal Summary</h2>
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
