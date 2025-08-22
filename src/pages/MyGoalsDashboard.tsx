import React, { useEffect, useState } from "react";
import { fetchEmployeeGoals } from "../lib/ApiServer";

const MyGoalsDashboard: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchEmployeeGoals()
      .then((data) => {
        setGoals(Array.isArray(data) ? data : [data]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch goals");
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  const paginatedGoals = goals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="bg-white p-2 sm:p-4 rounded-2xl max-w-8xl mx-auto mt-4 shadow-md">
      <div className="overflow-x-auto">
        <h2 className="text-lg sm:text-2xl text-center px-2 py-2 text-white font-bold mb-4 bg-gray-900 rounded-t-xl">
          My Goals{" "}
          <span className="text-gray-100 font-normal text-base">
            [as per my functional responsibilities]
          </span>
        </h2>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">Loading goals...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8">No goals found.</div>
          ) : (
            <>
              {/* Existing table */}
              <table className="min-w-[900px] w-full text-xs sm:text-sm mb-4 text-left">
                <thead className="bg-blue-100 text-gray-800 font-medium ">
                  <tr>
                    <th className="rounded-tl-lg px-2 sm:px-6 py-2 font-bold">Function Division</th>
                    <th className="border border-gray-200 px-3 py-2">Code</th>
                    <th className="border border-gray-200 px-3 py-2">Goal Title</th>
                    <th className="border border-gray-200 px-3 py-2">Description</th>
                    <th className="border border-gray-200 px-3 py-2">Target</th>
                    <th className="border border-gray-200 px-3 py-2">UOM</th>
                    <th className="border border-gray-200 px-3 py-2">Period</th>
                    <th className="border border-gray-200 px-3 py-2">Data Collection</th>
                    <th className="border border-gray-200 w-50 px-3 py-2">Red Threshold</th>
                    <th className="rounded-tr-lg px-2 w-50 py-2">Orange Threshold</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 border border-gray-200">
                  {paginatedGoals.map((goal, index) => (
                    <tr
                      key={goal.goal_id || index}
                      className={`hover:bg-gray-300 ${
                        index % 2 === 1 ? "bg-gray-100" : ""
                      }`}
                    >
                      <td className="border border-gray-300 px-3 py-2 font-semibold">{goal.division}</td>
                      <td className="border border-gray-300 px-3 py-2">{goal.division_code}</td>
                      <td className="border border-gray-300 px-3 py-2 font-bold">{goal.goal_title}</td>
                      <td className="border border-gray-300 px-3 py-2 whitespace-pre-line">
                        {goal.description}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{goal.target_value}</td>
                      <td className="border border-gray-300 px-3 py-2">{goal.unit_of_measure}</td>
                      <td className="border border-gray-300 px-3 py-2">{goal.period}</td>
                      <td className="border border-gray-300 px-3 py-2 whitespace-pre-line">
                        {goal.data_source_description}
                      </td>
                      <td className="border border-gray-300  px-3 py-2"> <span className="text-white text-[11px] sm:text-[13px] rounded-full px-2 py-2 opacity-75 mr-2 bg-red-400">{goal.red_threshold}</span></td>
                      <td className="border border-gray-300  px-3 py-2"><span className="text-white text-[11px] sm:text rounded-full px-2 py-2 opacity-75 mr-2 bg-orange-400">{goal.orange_threshold}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-3 text-sm">
                <div>
                  Rows per page:{" "}
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="border rounded px-2 py-1"
                  >
                    {[5, 10, 25, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                  >
                    Prev
                  </button>
                  <span>
                    Page {page + 1} of {Math.ceil(goals.length / rowsPerPage)}
                  </span>
                  <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.ceil(goals.length / rowsPerPage) - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGoalsDashboard;
