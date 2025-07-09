import React from "react";
import { mockAPIData } from "../lib/mockAPIData";

const goalsData = mockAPIData.goals_data;

const MyGoalsDashboard: React.FC = () => {
  return (
    <div className="container  mx- py-1 px-2">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-white bg-blue-900 px-4 py-2 rounded-t-md">
          My Goals{" "}
          <span className="text-gray-100 font-normal text-base">
            [as per my functional responsibilities]
          </span>
        </h2>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border px-3 py-2">Function Division</th>
                <th className="border px-3 py-2">Code</th>
                <th className="border px-3 py-2">Goal Title</th>
                <th className="border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Target</th>
                <th className="border px-3 py-2">UOM</th>
                <th className="border px-3 py-2">Period</th>
                <th className="border px-3 py-2">Data Collection</th>
                <th className="border px-3 py-2">Red Threshold</th>
                <th className="border px-3 py-2">Orange Threshold</th>
              </tr>
            </thead>
            <tbody>
              {goalsData.map((goal, index) => (
                <tr
                  key={index}
                  className={` hover:bg-gray-300 ${index % 2 === 1 ? 'bg-gray-100' : ''}`}
                >
                  <td className="border px-3 py-2">{goal.division}</td>
                  <td className="border px-3 py-2">{goal.code}</td>
                  <td className="border px-3 py-2">{goal.title}</td>
                  <td className="border px-3 py-2 whitespace-pre-line">
                    {goal.desc}
                  </td>
                  <td className="border px-3 py-2">{goal.target}</td>
                  <td className="border px-3 py-2">{goal.uom}</td>
                  <td className="border px-3 py-2">{goal.period}</td>
                  <td className="border px-3 py-2 whitespace-pre-line">
                    {goal.dataCollection}
                  </td>
                  <td className="border px-3 py-2">{goal.red}</td>
                  <td className="border px-3 py-2">{goal.orange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyGoalsDashboard; 