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

  // Grouped fields for custom layout
  const topFields = [
    { key: 'goal_week_number', label: 'Week #' },
    { key: 'goal_week_start_date', label: 'Start Date' },
    { key: 'goal_week_end_date', label: 'End Date' },
    { key: 'goal_id', label: 'Goal ID' },
  ];
  const titleFields = [
    { key: 'goal_title', label: 'Title' },
    { key: 'goal_description', label: 'Description' },
    { key: 'goal_target', label: 'Target' },
  ];
  const ratingFields = [
    { key: 'goal_own_rating', label: 'Own Rating' },
    { key: 'goal_status', label: 'Status' },
  ];
  const auditorFields = [
    { key: 'goal_auditor_rating', label: 'Auditor Rating' },
    { key: 'goal_auditor_comments', label: 'Auditor Comments' },
  ];

  // Render a field (read-only or editable)
  const renderField = (key: string, label: string) => {
    if (editableFields.includes(key)) {
      if (key === 'goal_effort') {
        return (
          <div className="flex flex-col min-w-[120px]">
            <label className="font-semibold mb-1 capitalize">{label}</label>
            <input
              type="number"
              name={key}
              value={form[key] ?? ''}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col min-w-[120px]">
            <label className="font-semibold mb-1 capitalize">{label}</label>
            <textarea
              name={key}
              value={form[key] ?? ''}
              onChange={handleChange}
              className="border rounded px-2 py-1"
              rows={2}
            />
          </div>
        );
      }
    } else {
      return (
        <div className="flex flex-col min-w-[120px]">
          <label className="font-semibold mb-1 capitalize">{label}</label>
          <div className="bg-gray-100 px-2 py-1 rounded text-gray-700">{form[key]}</div>
        </div>
      );
    }
  };

  return (
    <div className="absolute left-0 top-0 w-full h-full z-30 bg-white/80 backdrop-blur-sm flex items-center justify-center" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div className="relative w-full max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Update Goal</h2>
        {/* Top fields in one line */}
        <div className="flex flex-wrap gap-4 mb-2">
          {topFields.map(f => renderField(f.key, f.label))}
        </div>
        {/* Title/desc/target in one line */}
        <div className="flex flex-wrap gap-4 mb-2">
          {titleFields.map(f => renderField(f.key, f.label))}
        </div>
        {/* Own rating and status in one line */}
        <div className="flex flex-wrap gap-4 mb-2">
          {ratingFields.map(f => renderField(f.key, f.label))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* All other fields except auditor fields */}
          {Object.entries(goal).map(([key, value]) => {
            if (
              topFields.some(f => f.key === key) ||
              titleFields.some(f => f.key === key) ||
              ratingFields.some(f => f.key === key) ||
              auditorFields.some(f => f.key === key)
            ) {
              return null;
            }
            return renderField(key, key.replace(/_/g, ' '));
          })}
          {/* Goal team members field (editable) */}
          {renderField('goal_team_members', 'Goal Team Members')}
          {/* Auditor fields at the bottom */}
          <div className="flex flex-wrap gap-4 mt-2">
            {auditorFields.map(f => renderField(f.key, f.label))}
          </div>
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