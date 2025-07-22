import React, { useState, useEffect } from 'react';

interface PopScreenProps {
  isOpen: boolean;
  goal: any; // Use Goal type if available
  onClose: () => void;
  onSubmit: (updatedGoal: any) => void;
}

const editableFields = [
  'goal_action_performed',
  'goal_challenges',
  'goal_unfinished_tasks',
  'goal_weekly_next_actions',
  'goal_status',
  'goal_effort',
  'goal_own_rating',
  'goal_data_source_description',
  'goal_team_members',
];

const PopScreen: React.FC<PopScreenProps> = ({ isOpen, goal, onClose, onSubmit }) => {
  const [form, setForm] = useState({ ...goal });

  useEffect(() => {
    setForm({ ...goal });
  }, [goal]);

  if (!isOpen || !goal) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: typeof form) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="absolute left-0 top-0 w-full h-full z-30 bg-white/80 backdrop-blur-sm flex items-center justify-center" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div className="relative w-full max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Update Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(goal).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="font-semibold mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
              {editableFields.includes(key) ? (
                key === 'goal_effort' ? (
                  <input
                    type="number"
                    name={key}
                    value={form[key] ?? ''}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  <textarea
                    name={key}
                    value={form[key] ?? ''}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                    rows={2}
                  />
                )
              ) : (
                <div className="bg-gray-100 px-2 py-1 rounded text-gray-700">{String(value)}</div>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-white pt-4 pb-2 z-10">
            <button type="button" className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopScreen; 