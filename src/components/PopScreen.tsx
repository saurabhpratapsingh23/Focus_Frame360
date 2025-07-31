import React, { useState, useEffect } from "react";

interface PopScreenProps {
  isOpen: boolean;
  goal: any;
  onClose: () => void;
  onSubmit: (updatedGoal: any) => void;
}

const editableFields = [
  { key: "goal_action_performed", label: "Goal Achievements/Accomplishments" },
  { key: "goal_challenges", label: "Goal Challenges/Roadblocks" },
  { key: "goal_unfinished_tasks", label: "Goal Tasks started but not completed" },
  { key: "goal_weekly_next_actions", label: "Goal Upcoming planned Tasks" },
  { key: "goal_status", label: "Status" },
  { key: "goal_effort", label: "My Effort (hrs)" },
  { key: "goal_own_rating", label: "Self Rating" },
  { key: "goal_data_source_description", label: "Goal Tracker File Name" },
  { key: "goal_team_members", label: "Associated Team Members" },
];

const PopScreen: React.FC<PopScreenProps> = ({ isOpen, goal, onClose, onSubmit }) => {
  const [form, setForm] = useState({ ...goal });

  useEffect(() => {
    setForm({ ...goal });
  }, [goal]);

  if (!isOpen || !goal) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: typeof form) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitForm = { ...form };
    if (submitForm.goal_own_rating) {
      submitForm.goal_own_rating = submitForm.goal_own_rating.charAt(0).toUpperCase();
    }
    onSubmit(submitForm);
  };

  const topFields = [
    { key: "goal_week_number", label: "Week #" },
    { key: "goal_week_start_date", label: "Start Date" },
    { key: "goal_week_end_date", label: "End Date" },
    { key: "goal_id", label: "Goal ID" },
    { key: "goal_title", label: "Title" },
    { key: "goal_target", label: "Target" },
    { key: "goals_unit_of_measure", label: "UOM" },
    { key: "goal_orange_threshold", label: "Orange Threshold" },
    { key: "goal_red_threshold", label: "Red Threshold" },
  ];

  const titleFields = [{ key: "goal_description", label: "Description" }];
  const ratingFields = [
    { key: "goal_own_rating", label: "Self Rating" },
    { key: "goal_status", label: "Status" },
    { key: "goal_effort", label: "My Effort (hrs)" },
  ];

  const auditorFields = [
    { key: "goal_auditor_rating", label: "Auditor Rating" },
    { key: "goal_auditor_comments", label: "Auditor Comments" },
  ];

  const renderField = (key: string, label: string) => {
    if (["goal_rec_id", "goal_emp_id", "goal_emp_code", "goals_week_co_id"].includes(key)) return null;

    if (key === "goal_own_rating" || key === "goal_status") {
      const options =
        key === "goal_own_rating"
          ? ["", "Green", "Red", "Orange"]
          : ["", "In progress", "Completed", "Pending"];
      return (
        <div className="flex flex-col text-sm">
          <label className="font-semibold mb-1 capitalize">{label}</label>
          <select
            name={key}
            value={form[key] ?? ""}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt || "Select"}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (editableFields.some((field) => field.key === key)) {
      return (
        <div className="flex flex-col text-sm">
          <label className="font-semibold mb-1 capitalize">{label}</label>
          {key === "goal_effort" ? (
            <input
              type="number"
              name={key}
              value={form[key] ?? ""}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <textarea
              name={key}
              value={form[key] ?? ""}
              onChange={handleChange}
              className={`border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                key === "goal_team_members" ? "h-10" : "h-28"
              }`}
              rows={3}
            />
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col text-sm">
        <label className="font-semibold mb-1 capitalize">{label}</label>
        <div className="bg-gray-100 px-3 py-2 rounded border border-gray-200 text-gray-800">
          {form[key]}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh] border border-gray-900 ">
        <h2 className="text-2xl text-center mt-0 font-bold bg-gray-900 text-white px-4 py-3 rounded-t-lg rounded-b-lg mb-4 w-full shadow">
          UPDATE GOAL
        </h2>

       {/* Top fields – single horizontal line */}
<div className="flex flex-nowrap gap-4 mb-6 overflow-x-auto">
  {topFields.map((f) => (
    <div key={f.key} className="flex-shrink-0">
      {renderField(f.key, f.label)}
    </div>
  ))}
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {titleFields.map((f) => (
            <div key={f.key}>{renderField(f.key, f.label)}</div>
          ))}
        </div>

        <div className="grid grid-cols-0 sm:grid-cols-2 md:grid-cols-3 gap-0 mb-6 ">
          {ratingFields.map((f) => (
            <div key={f.key} className="w-50">
             {renderField(f.key, f.label)}</div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(goal).map(([key]) => {
            if (
              topFields.some((f) => f.key === key) ||
              titleFields.some((f) => f.key === key) ||
              ratingFields.some((f) => f.key === key) ||
              auditorFields.some((f) => f.key === key) ||
              ["goal_rec_id", "goal_emp_id", "goal_emp_code", "goals_week_co_id"].includes(key)
            ) {
              return null;
            }
            const editable = editableFields.find((f) => f.key === key);
            return (
              <div key={key}>
                {renderField(key, editable ? editable.label : key.replace(/_/g, " "))}
              </div>
            );
          })}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditorFields.map((f) => (
              <div key={f.key}>{renderField(f.key, f.label)}</div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-800 hover:bg-blue-600 text-white text-sm font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopScreen;
