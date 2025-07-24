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
    <div className="absolute left-0 top-0 w-full h-full z-30 bg-white/80 backdrop-blur-md  flex items-center justify-center" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div className="relative w-full max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] border border-gray-200 flex flex-col">
        <h2 className="text-lg  px-2  py-2 text-white font-bold mb-4 bg-gray-700 rounded-t-xl">Weekly Summary Details</h2>
        {/* Top fields in a single line */}
        <div className="flex flex-wrap gap-4 mb-4">
          {topFields.map(({ key, label }) => (
            <div key={key} className="flex flex-col min-w-[70px]">
              <label className="font-semibold mb-1 text-xs">{label}</label>
              {['ws_week_id', 'ws_start_date', 'ws_end_date','ws_workk_days','ws_Holidays' ].includes(key) ? (
                <div className="bg-gray-100 px-2 py-1 rounded text-gray-700 w-15 text-xs">{form[key]}</div>
              ) : (
                <input
                  type="number"
                  name={key}
                  value={form[key] ?? ''}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 text-xs w-20"
                />
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSave} className="flex flex-col flex-1 space-y-2">
          {/* Editable fields */}
          {editableFields.map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <label className="font-semibold mb-1 mt-4 capitalize">{label}</label>
              <textarea
                name={key}
                value={form[key] ?? ''}
                onChange={handleChange}
                className="border rounded px-2 py-2 h-30"
                rows={2}
              />
            </div>
          ))}
          <div className="flex justify-end sticky gap-2 mt-auto pt-4 pb-2 bg-white z-10">
            <button type="button" className="px-4 py- rounded bg-gray-300 hover:bg-gray-400" onClick={onClose}>Close</button>
            <button type="submit" className="px-4 py-2  rounded bg-blue-900 text-white hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklySummaryPopScreen;