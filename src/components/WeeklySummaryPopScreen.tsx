import React, { useState, useEffect } from 'react';

interface WeeklySummaryPopScreenProps {
  isOpen: boolean;
  row: any; // Use WeeklySummary type if available
  onClose: () => void;
  onSubmit: (updatedRow: any) => void;
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

const WeeklySummaryPopScreen: React.FC<WeeklySummaryPopScreenProps> = ({ isOpen, row, onClose, onSubmit }) => {
  const [form, setForm] = useState({ ...row });

  useEffect(() => {
    setForm({ ...row });
  }, [row]);

  if (!isOpen || !row) return null;

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
        <h2 className="text-lg font-bold mb-4">Update Weekly Summary</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(row).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="font-semibold mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
              {editableFields.includes(key) ? (
                <input
                  type={['ws_WFH','ws_WFO','ws_efforts','ws_leaves','ws_extra_days'].includes(key) ? 'number' : 'text'}
                  name={key}
                  value={form[key] ?? ''}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
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

export default WeeklySummaryPopScreen;