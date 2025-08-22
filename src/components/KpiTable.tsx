import React from 'react';
import { weekly_goals } from '../lib/ApiServer';

interface KpiTableProps {
  weeklyGoals: any[];
}

const KpiTable: React.FC<KpiTableProps> = ({ weeklyGoals }) => (
    <div>
       <h2 className="text-2xl font-bold round bg-gray-400 text-gray mt-4  mb-4 rounded-t-md py-2 w-full border-gray-400 pl-4">Key Parameters Matrix</h2>
      <div className="overflow-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-300 text-center">
            <tr>
              {[
                'goal_id',
                'goal_title',
                'goal_description',
                'goal_target',
                'week_start_date',
                'week_end_date',
                'action_performed',
                'effort',
                'status',
                'own_rating',
                'challenges',
                'unfinished_tasks'
              ].map((header) => (
                <th key={header} className="border px-3 py-2 text-sm text-gray-800">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              let lastGoalId: string | null = null;
              let groupeffort = 0;
              let rows: React.ReactNode[] = [];
              for (let i = 0; i < weeklyGoals.length; i++) {
                const row = weeklyGoals[i];
                const isRepeat = row.goal_id === lastGoalId;
                const display = {
                  goal_id: isRepeat ? '' : row.goal_id,
                  goal_title: isRepeat ? '' : row.goal_title,
                  goal_description: isRepeat ? '' : row.goal_description,
                  goal_target: isRepeat ? '' : row.goal_target,
                };
                // Add effort for this row
                groupeffort += typeof row.effort === 'string' ? parseFloat(row.effort) || 0 : row.effort || 0;
                // Check if next row is a new goal or end of data
                const isLastOfGroup = i === weeklyGoals.length - 1 || weeklyGoals[i + 1].goal_id !== row.goal_id;
                rows.push(
                  <tr className="text-center" key={i}>
                    <td className="border px-2 py-1 font-semibold">{display.goal_id}</td>
                    <td className="border px-2 py-1">{display.goal_title}</td>
                    <td className="border px-2 py-1">{display.goal_description}</td>
                    <td className="border px-2 py-1">{display.goal_target}</td>
                    <td className="border px-2 py-1">{row.week_start_date}</td>
                    <td className="border px-2 py-1">{row.week_end_date}</td>
                    <td className="border px-2 py-1 whitespace-pre-line">{row.action_performed}</td>
                    <td className="border px-2 py-1">{row.effort}</td>
                    <td className="border px-2 py-1">{row.status}</td>
                    <td className="border px-2 py-1">{row.own_rating}</td>
                    <td className="border px-2 py-1">{row.challenges}</td>
                    <td className="border px-2 py-1">{row.unfinished_tasks}</td>
                  </tr>
                );
                if (isLastOfGroup) {
                  rows.push(
                    <tr className="text-center font-bold bg-gray-100" key={`total-${row.goal_id}-${i}`}>
                      <td className="border px-2 py-1" colSpan={7}></td>
                      <td className="border px-2 py-1">{groupeffort.toFixed(2)}</td>
                      <td className="border px-2 py-1" colSpan={4}>Total effort</td>
                    </tr>
                  );
                  groupeffort = 0;
                }
                lastGoalId = row.goal_id;
              }
              return rows;
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
  export default KpiTable;