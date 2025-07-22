import React, { useState, useEffect } from 'react';

interface WeeklySummaryPopScreenProps {
  isOpen: boolean;
  data: any;
  onClose: () => void;
  onSave?: (payload: any) => void;
}

const editableFields = [
  'ws_success',
  'ws_challenges',
  'ws_unfinished_tasks',
  'ws_next_actions',
  'ws_WFH',
  'ws_WFO',
  'ws_efforts',
  'ws_leaves',
  'ws_extra_days',
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
        ws_emp_id: form.ws_emp_id,
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
    <div className="absolute left-0 top-0 w-full h-full z-30 bg-white/80 backdrop-blur-sm flex items-center justify-center" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div className="relative w-full max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Weekly Summary Details</h2>
        <form onSubmit={handleSave} className="space-y-2">
          {/* Show ws_emp_id and ws_week_id as read-only */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 capitalize">ws_emp_id</label>
            <div className="bg-gray-100 px-2 py-1 rounded text-gray-700">{form.ws_emp_id}</div>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1 capitalize">ws_week_id</label>
            <div className="bg-gray-100 px-2 py-1 rounded text-gray-700">{form.ws_week_id}</div>
          </div>
          {/* Editable fields */}
          {editableFields.map((key) => (
            <div key={key} className="flex flex-col">
              <label className="font-semibold mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
              {typeof form[key] === 'number' ? (
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
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-white pt-4 pb-2 z-10">
            <button type="button" className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onClose}>Close</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklySummaryPopScreen;