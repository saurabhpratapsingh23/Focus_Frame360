import React, { useState, useEffect } from "react";

interface PopScreenProps {
  isOpen: boolean;
  goal: any; // Use Goal type if available
  onClose: () => void;
  onSubmit: (updatedGoal: any) => void;
}

const editableFields = [
  { key: "goal_action_performed", label: "Goal Achievements/Accomplishments" },
  { key: "goal_challenges", label: "Goal Challenges/Roadblocks" },
  {
    key: "goal_unfinished_tasks",
    label: "Goal Tasks started but not completed",
  },
  { key: "goal_weekly_next_actions", label: "Goal Upcoming planned Tasks" },
  { key: "goal_status", label: "Status" },
  { key: "goal_effort", label: "My Effort (hrs)" },
  { key: "goal_own_rating", label: "Self Rating" },
  { key: "goal_data_source_description", label: "Goal Tracker File Name" },
  { key: "goal_team_members", label: "Associated Team Members" },
];

const PopScreen: React.FC<PopScreenProps> = ({
  isOpen,
  goal,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({ ...goal });

  useEffect(() => {
    setForm({ ...goal });
  }, [goal]);

  if (!isOpen || !goal) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: typeof form) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clone form and transform goal_own_rating if present
    const submitForm = { ...form };
    if (submitForm.goal_own_rating) {
      submitForm.goal_own_rating = submitForm.goal_own_rating.charAt(0).toUpperCase();
    }
    console.log("Form data on submit:", submitForm); // Print all form data (hidden and visible)
    onSubmit(submitForm);
  };

  // Grouped fields for custom layout
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
    { key: "goal_effort", label: "My Effort(in hrs)" },
  ];
  const auditorFields = [
    { key: "goal_auditor_rating", label: "Auditor Rating" },
    { key: "goal_auditor_comments", label: "Auditor Comments" },
  ];

  // Render a field (read-only or editable)
  const renderField = (key: string, label: string) => {
    // Hide these fields from UI
    if (
      [
        "goal_rec_id",
        "goal_emp_id",
        "goal_emp_code",
        "goals_week_co_id",
      ].includes(key)
    )
      return null;

    // Dropdown for Own Rating
    if (key === "goal_own_rating") {
      return (
        <div className="flex flex-col min-w-[100px]">
          <label className="font-semibold mb-1 capitalize">{label}</label>
          <select
            name={key}
            value={form[key] ?? ""}
            onChange={handleChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Select</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
            <option value="Orange">Orange</option>
          </select>
        </div>
      );
    }
    // Dropdown for Status
    if (key === "goal_status") {
      return (
        <div className="flex flex-col min-w-[100px]">
          <label className="font-semibold mb-1 capitalize">{label}</label>
          <select
            name={key}
            value={form[key] ?? ""}
            onChange={handleChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Select</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      );
    }
    if (editableFields.some((field) => field.key === key)) {
      const editableField = editableFields.find((field) => field.key === key);
      if (key === "goal_effort") {
        return (
          <div className="flex flex-col min-w-[50px]">
            <label className="font-semibold mb-1 capitalize">{label}</label>
            <input
              type="number"
              name={key}
              value={form[key] ?? ""}
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
              value={form[key] ?? ""}
              onChange={handleChange}
              className="border rounded px-2 py-2 h-40"
              rows={2}
            />
          </div>
        );
      }
    } else {
      return (
        <div className="flex flex-col min-w-[120px]">
          <label className="font-semibold mb-1  capitalize">{label}</label>
          <div className="bg-gray-300 px-2 py-1 rounded text-gray-700">
            {form[key]}
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="absolute left-0 top-0 w-full h-full z-30 bg-white/80 backdrop-blur-sm flex items-center justify-center"
      style={{ minHeight: "100%", minWidth: "100%" }}
    >
      <div className="relative w-full max-w-[1300px] mx-auto my-8 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] border border-gray-200">
        <h2 className="text-lg font-bold bg-gray-700 text-white px-2 py-2 rounded-t-xl mb-4">Update Goal</h2>
        {/* Top fields in one line */}
        <div className="flex flex-nowrap gap-8 mb-4 mt-2 overflow-x-auto">
          {topFields.map((f) => (
            <div
              key={f.key}
              className="flex flex-col text-sm items-start w-24 min-w-[5rem]"
            >
              {/* <label className="font-semibold mb-1 text-xs">{f.label}</label> */}
              {/* Render value with fixed width */}
              <div className="w-20">{renderField(f.key, f.label)}</div>
            </div>
          ))}
        </div>
        {/* Title/desc/target in one line */}
        <div className="flex flex-nowrap gap-8 mb-4 overflow-x-auto ">
          {titleFields.map((f) => (
            <div
              key={f.key}
              className="flex flex-col text-sm items-start w-full min-w-[5rem]"
            >
              {/* <label className="font-semibold mb-1 text-xs">{f.label}</label> */}
              <div className="w-full">{renderField(f.key, f.label)}</div>
            </div>
          ))}
        </div>
        {/* Own rating and status in one line */}
        <div className="flex flex-nowrap gap-8 mb-4 overflow-x-auto ">
          {ratingFields.map((f) => (
            <div
              key={f.key}
              className="flex flex-col text-sm items-start w-24 min-w-[4rem]"
            >
              <div className="w-30">{renderField(f.key, f.label)}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* All other fields except auditor fields */}
          {Object.entries(goal).map(([key, value]) => {
            if (
              topFields.some((f) => f.key === key) ||
              titleFields.some((f) => f.key === key) ||
              ratingFields.some((f) => f.key === key) ||
              auditorFields.some((f) => f.key === key) ||
              [
                "goal_rec_id",
                "goal_emp_id",
                "goal_emp_code",
                "goals_week_co_id",
              ].includes(key)
            ) {
              return null;
            }
            const editable = editableFields.find((f) => f.key === key);
            return renderField(
              key,
              editable ? editable.label : key.replace(/_/g, " ")
            );
          })}
          {/* Goal team members field (editable) */}
          {renderField("goal_team_members", "Associated Team Members")}
          {/* Auditor fields at the bottom */}
          <div className="flex flex-wrap gap-4 mt-2">
            {auditorFields.map((f) => renderField(f.key, f.label))}
          </div>
          <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-white pt-4 pb-2 z-10">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-900 text-white hover:bg-blue-700"
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
