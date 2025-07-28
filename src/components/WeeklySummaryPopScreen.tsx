import React, { useState, useEffect } from 'react';

interface WeeklySummaryPopScreenProps {
  isOpen: boolean;
  data: any;
  onClose: () => void;
  onSave?: (payload: any) => void;
}

const editableFields = [
 { key: 'ws_success', label: 'Weekly Achievements/Accomplishments'},
 { key: 'ws_challenges', label: 'Weekly Challenges/Roadblocks'}, 
 { key: 'ws_unfinished_tasks', label: 'Weekly Tasks started but not completed'},
 { key: 'ws_next_actions', label: 'Upcoming planned Tasks'}
];

const topFields = [
  { key: 'ws_week_id', label: 'Week ID' },
  { key: 'ws_start_date', label: 'Start Date' },
  { key: 'ws_end_date', label: 'End Date' },
  { key: 'ws_workk_days', label: 'Work Days' },
  { key: 'ws_Holidays', label: 'Holidays'},
  { key: 'ws_WFH', label: 'WFH' },
  { key: 'ws_WFO', label: 'WFO' },
  { key: 'ws_efforts', label: 'Efforts (In hrs)' },
  { key: 'ws_leaves', label: 'Leaves' },
  
  { key: 'ws_extra_days', label: 'Extra Days' },
];

const WeeklySummaryPopScreen: React.FC<WeeklySummaryPopScreenProps> = ({ isOpen, data, onClose, onSave }) => {
  const [form, setForm] = useState<any>({ ...data });

  useEffect(() => {
    setForm({ ...data });
  }, [data]);

  if (!isOpen || !data) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: typeof form) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      // Only send required fields
      const payload = {
        ws_emp_id: form.ws_emp_id, // still send, just not shown
        ws_week_id: form.ws_week_id,
        ws_success: form.ws_success,
        ws_challenges: form.ws_challenges,
        ws_unfinished_tasks: form.ws_unfinished_tasks,
        ws_next_actions: form.ws_next_actions,
        ws_WFH: Number(form.ws_WFH),
        ws_WFO: Number(form.ws_WFO),
        ws_efforts: Number(form.ws_efforts),
        ws_leaves: Number(form.ws_leaves),
        ws_extra_days: Number(form.ws_extra_days),
      };
      onSave(payload);

    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] border border-gray-900 flex flex-col">
        <h2 className="text-xl md:text-2xl font-bold text-center text-white bg-gray-900 px-4 py-3 rounded-t-md shadow">Weekly Summary Details</h2>
        {/* Top fields in a single line */}
        <div className="flex flex-wrap mt-2 gap-4 mb-4">
          {topFields.map(({ key, label }) => (
            <div key={key} className="flex flex-col min-w-[70px]">
              <label className="font-bold mb-1 text-md">{label}</label>
              {['ws_week_id', 'ws_start_date', 'ws_end_date','ws_workk_days','ws_Holidays' ].includes(key) ? (
                <div className="bg-gray-100 px-2 py-2 rounded text-gray-700 w-15 text-sm">{form[key]}</div>
              ) : (
                <input
                  type="number"
                  name={key}
                  value={form[key] ?? ''}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 mt-2 text-xs w-20"
                />
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSave} className="flex flex-col flex-1 space-y-2">
          {/* Editable fields */}
          {editableFields.map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <label className="font-bold mb-1 mt-4 capitalize">{label}</label>
              <textarea
                name={key}
                value={form[key] ?? ''}
                onChange={handleChange}
                className="border border-gray-300 h-40 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-6 border-t pt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm font-medium" onClick={onClose}>Close</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-800 hover:bg-blue-600 text-white text-sm font-medium">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklySummaryPopScreen;