import React, { useState } from 'react';
import { FiLink } from "react-icons/fi";

// Mock data for table rows
const mockRows = [
  {
    title: 'Feature Delivery',
    description: 'Ensure timely and efficient delivery of customer-committed features (Deliver committed features to production as per sprint/release plans)',
    target: '\u2265 90%',
    uom: '%',
    period: 'Monthly',
    dataSource: 'Sprint/Release Tracker / JIRA/ Azure DevOps',
    red: '< 80%',
    orange: '80–89%',
    effort: '100',
    rating: 'Green',
  },
  {
    title: 'Bug Resolution',
    description: 'Resolve critical bugs within defined SLAs to maintain product quality.',
    target: '\u2265 95%',
    uom: '%',
    period: 'Weekly',
    dataSource: 'Bug Tracker / JIRA',
    red: '< 85%',
    orange: '85–94%',
    effort: '40',
    rating: 'Orange',
  },
  {
    title: 'Code Review',
    description: 'Complete code reviews for all pull requests within 24 hours.',
    target: '100%',
    uom: '%',
    period: 'Weekly',
    dataSource: 'GitHub / Azure DevOps',
    red: '< 90%',
    orange: '90–99%',
    effort: '20',
    rating: 'Red',
  },
];

const WeeklyGoalsAction: React.FC = () => {
  const [activityEfforts, setActivityEfforts] = useState(["", "", ""]);
  const [activityToggles, setActivityToggles] = useState<("red" | "orange" | "green")[]>(["green", "green", "green"]);
  const [myOwnRating, setMyOwnRating] = useState(false);
  const [myOwnRed, setMyOwnRed] = useState(false);
  const [myOwnOrange, setMyOwnOrange] = useState(false);
  const [activityProject, setActivityProject] = useState("Project");
  const [activityInfo, setActivityInfo] = useState(["", "", ""]);
  // State to track which row is selected for the main table
  const [selectedRow, setSelectedRow] = useState(mockRows[0]);
  const [goalsActivities, setGoalsActivities] = useState("");
  const [roadblocks, setRoadblocks] = useState("");
  const [pendingWork, setPendingWork] = useState("");
  const [nextActions, setNextActions] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [overallStatus, setOverallStatus] = useState("In Progress");
  const [efforts, setEfforts] = useState("");
  const [projectTrackerInfo, setProjectTrackerInfo] = useState("");
  const [myOwnRatingField, setMyOwnRatingField] = useState("Green");
  const [auditorRating, setAuditorRating] = useState("");
  const [auditorComments, setAuditorComments] = useState("");

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <main className="flex-1  p-6 bg-white">
          <h4 className="text-lg font-bold text-white bg-blue-900 px-4 py-4 rounded-t-md">Weekly Goals Action</h4>

          <div className="flex flex-wrap justify-between items-center gap-4 mb-4 ">
            <button className="border border-blue-600 mt-2 text-blue-600 font-bold px-4 py-2 rounded hover:bg-blue-900 hover:text-white">
              Activities / Functional KPI wise Tracker
            </button>

            <div className="flex items-center gap-4">
              <div className="w-36">
                <div className="bg-gray-200 h-5 mt-2 rounded overflow-hidden">
                  <div
                    className="bg-yellow-400 h-5 text-center text-xs font-bold text-black"
                    style={{ width: '65%' }}
                  >
                    65%
                  </div>
                </div>
                <div className="text-center text-xs mt-1">Efforts in hrs</div>
              </div>
              <div className="w-36">
                <div className="bg-gray-200 h-5 mt-2 rounded overflow-hidden">
                  <div
                    className="bg-blue-600 h-5 text-center text-xs font-bold text-white"
                    style={{ width: '55%' }}
                  >
                    55%
                  </div>
                </div>
                <div className="text-center text-xs mt-1">Functional Info</div>
              </div>
            </div>

           
          </div>

          <div>
            <table className="min-w-full table-auto border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Target</th>
                  <th className="border p-2">UOM</th>
                  <th className="border p-2">Period</th>
                  <th className="border p-2">Data Source</th>
                  <th className="border p-2">Red</th>
                  <th className="border p-2">Orange</th>
                  <th className="border p-2">Effort</th>
                  <th className="border p-2">Rating</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedRow && (
                  <tr className="hover:bg-blue-50">
                    <td className="border p-2">{selectedRow.title}</td>
                    <td className="border p-2">{selectedRow.description}</td>
                    <td className="border p-2">{selectedRow.target}</td>
                    <td className="border p-2">{selectedRow.uom}</td>
                    <td className="border p-2">{selectedRow.period}</td>
                    <td className="border p-2">{selectedRow.dataSource}</td>
                    <td className="border p-2">{selectedRow.red}</td>
                    <td className="border p-2">{selectedRow.orange}</td>
                    <td className="border p-2">{selectedRow.effort}</td>
                    <td className="border p-2">
                      {selectedRow.rating === 'Green' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-green-500 align-middle" title="Green"></span>
                      )}
                      {selectedRow.rating === 'Orange' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-orange-400 align-middle" title="Orange"></span>
                      )}
                      {selectedRow.rating === 'Red' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-red-500 align-middle" title="Red"></span>
                      )}
                    </td>
                    <td className="border p-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded">My Actions</button>
                    </td>
                  </tr>
                )}

                <tr>
                  <td colSpan={11} className="bg-blue-50 border-t-2">
                    <div className="p-3 bg-blue-100 border rounded">
                      <div className="bg-blue-600 text-white px-4 py-2 font-bold flex justify-between items-center">
                        <span>Actions and Task Performed (Against the above Goal)</span>
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded font-bold text-sm">
                          Save
                        </button>
                      </div>
                      {/* Added 5 textarea input fields below the heading */}
                      <div className="flex flex-row gap-3 mt-4">
                        <textarea
                          className="flex-1 border bg-white rounded p-2 text-sm min-w-[180px] max-w-xs"
                          placeholder="Goals Activities for this week"
                          value={goalsActivities}
                          onChange={e => setGoalsActivities(e.target.value)}
                          rows={2}
                        />
                        <textarea
                          className="flex-1 border bg-white rounded p-2 text-sm min-w-[140px] max-w-xs"
                          placeholder="Roadblocks"
                          value={roadblocks}
                          onChange={e => setRoadblocks(e.target.value)}
                          rows={2}
                        />
                        <textarea
                          className="flex-1 border bg-white rounded p-2 text-sm min-w-[140px] max-w-xs"
                          placeholder="Pending work"
                          value={pendingWork}
                          onChange={e => setPendingWork(e.target.value)}
                          rows={2}
                        />
                        <textarea
                          className="flex-1 border bg-white rounded p-2 text-sm min-w-[140px] max-w-xs"
                          placeholder="Next actions"
                          value={nextActions}
                          onChange={e => setNextActions(e.target.value)}
                          rows={2}
                        />
                        <textarea
                          className="flex-1 border bg-white rounded p-2 text-sm min-w-[140px] max-w-xs"
                          placeholder="Team members"
                          value={teamMembers}
                          onChange={e => setTeamMembers(e.target.value)}
                          rows={2}
                        />
                      </div>
                      {/* Status and ratings row */}
                      <div className="mt-8">
                        <div className="flex flex-row gap-10 bg-gray-300 mb-4 p-2 border border-blue-400">
                          <label className="text-lg font-bold min-w-[160px]">Overall status:</label>
                          <label className="text-lg font-bold min-w-[100px]">Efforts:</label>
                          <label className="text-lg font-bold min-w-[180px]">Project tracker Info</label>
                          <label className="text-lg font-bold min-w-[120px]">My Own Rating</label>
                          <label className="text-lg font-bold min-w-[120px]">Auditor's Rating</label>
                          <label className="text-lg font-bold min-w-[180px]">Auditor's Comments</label>
                        </div>
                        <div className="flex flex-row p-2 gap-12">
                          <select
                            className="border bg-white rounded p-2 text-sm min-w-[160px]"
                            value={overallStatus}
                            onChange={e => setOverallStatus(e.target.value)}
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Un-Touched">Un-Touched</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <input
                            type="Number"
                            className="border bg-white rounded p-2 text-sm w-2 min-w-[100px]"
                            placeholder="100"
                            value={efforts}
                            onChange={e => setEfforts(e.target.value)}
                          />
                          <input
                            type="text"
                            className="border bg-white rounded p-2 text-sm min-w-[180px]"
                            placeholder="Enter Tracker File Name & Link"
                            value={projectTrackerInfo}
                            onChange={e => setProjectTrackerInfo(e.target.value)}
                          />
                          <select
                            className="border bg-white rounded p-2 text-sm min-w-[120px]"
                            value={myOwnRatingField}
                            onChange={e => setMyOwnRatingField(e.target.value)}
                          >
                            <option value="Green">Green</option>
                            <option value="Orange">Orange</option>
                            <option value="Red">Red</option>
                          </select>
                          <select
                            className="border bg-white rounded p-2 text-sm min-w-[120px]"
                            value={auditorRating}
                            onChange={e => setAuditorRating(e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Green">Green</option>
                            <option value="Orange">Orange</option>
                            <option value="Red">Red</option>
                          </select>
                          <input
                            type="text"
                            className="border bg-white rounded p-2 text-sm min-w-[180px]"
                            placeholder="Enter Tracker File Name & Link"
                            value={auditorComments}
                            onChange={e => setAuditorComments(e.target.value)}
                          />
                        </div>
                      </div>

                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Render mock data table below Key Activities */}
          <div className="mt-8">
            <h5 className="text-md font-bold mb-2">KPI/Goal Data (Read Only)</h5>
            <table className="min-w-full table-auto border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Target</th>
                  <th className="border p-2">UOM</th>
                  <th className="border p-2">Period</th>
                  <th className="border p-2">Data Source</th>
                  <th className="border p-2">Red</th>
                  <th className="border p-2">Orange</th>
                  <th className="border p-2">Effort</th>
                  <th className="border p-2">Rating</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-blue-50 ${selectedRow === row ? 'bg-yellow-200' : ''}`}
                  >
                    <td className="border p-2">{row.title}</td>
                    <td className="border p-2">{row.description}</td>
                    <td className="border p-2">{row.target}</td>
                    <td className="border p-2">{row.uom}</td>
                    <td className="border p-2">{row.period}</td>
                    <td className="border p-2">{row.dataSource}</td>
                    <td className="border p-2">{row.red}</td>
                    <td className="border p-2">{row.orange}</td>
                    <td className="border p-2">{row.effort}</td>
                    <td className="border p-2">
                      {row.rating === 'Green' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-green-500 align-middle" title="Green"></span>
                      )}
                      {row.rating === 'Orange' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-orange-400 align-middle" title="Orange"></span>
                      )}
                      {row.rating === 'Red' && (
                        <span className="inline-block w-4 h-4 rounded-full bg-red-500 align-middle" title="Red"></span>
                      )}
                    </td>
                    <td className="border p-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded" onClick={() => setSelectedRow(row)}>My Actions</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WeeklyGoalsAction;
