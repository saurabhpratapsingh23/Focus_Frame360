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

            <select className="text-sm p-2 mt-2 border rounded">
              <option>Week #19 (13 Apr 2025 - 19 Apr 2025)</option>
            </select>
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
                <tr className="hover:bg-blue-50">
                  <td className="border p-2">Feature Delivery</td>
                  <td className="border p-2">
                    Ensure timely and efficient delivery of customer-committed features (Deliver committed features to production as per sprint/release plans)
                  </td>
                  <td className="border p-2">&ge; 90%</td>
                  <td className="border p-2">%</td>
                  <td className="border p-2">Monthly</td>
                  <td className="border p-2">Sprint/Release Tracker / JIRA/ Azure DevOps</td>
                  <td className="border p-2">&lt; 80%</td>
                  <td className="border p-2">80–89%</td>
                  <td className="border p-2">100</td>
                  <td className="border p-2">
                    <select className="text-sm border rounded p-1">
                      <option>Green</option>
                      <option>Orange</option>
                      <option>Red</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded">My Actions</button>
                  </td>
                </tr>

                <tr>
                  <td colSpan={11} className="bg-blue-50 border-t-2">
                    <div className="p-3 bg-white border rounded">
                      <div className="bg-blue-600 text-white px-4 py-2 font-bold flex justify-between items-center">
                        <span>Key Activities (Under this KPI / GOAL)</span>
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded font-bold text-sm">
                          Save
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mt-3">
                        <div className="md:col-span-9 space-y-2 flex items-start">
                          <div className="mr-4">
                            <select
                              className="border text-white bg-blue-500 rounded p-2 text-xs w-32"
                              value={activityProject}
                              onChange={e => setActivityProject(e.target.value)}
                            >
                              <option>Project</option>
                              <option>Project 1</option>
                              <option>Project 2</option>
                              <option>Project 3</option>
                            </select>
                          </div>
                          <div className="flex-1 space-y-2">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="bg-yellow-100 border rounded p-2 text-sm flex items-center justify-between">
                                <textarea
                                  className="flex-1 border rounded p-1 text-xs mr-2 resize-none overflow-hidden min-h-[32px] max-h-40"
                                  placeholder="Action / Activity Information"
                                  value={activityInfo[i] || ''}
                                  rows={1}
                                  onChange={e => {
                                    const newInfo = [...activityInfo];
                                    newInfo[i] = e.target.value;
                                    setActivityInfo(newInfo);
                                    // Auto-resize
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = target.scrollHeight + 'px';
                                  }}
                                  onInput={e => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = target.scrollHeight + 'px';
                                  }}
                                />
                                <div className="ml-4 flex items-center">
                                  <span className="mr-2">Efforts in (hr)</span>
                                  <input
                                    type="text"
                                    className="border rounded p-1 text-xs w-20"
                                    placeholder="hr"
                                    value={activityEfforts[i]}
                                    onChange={e => {
                                      const newEfforts = [...activityEfforts];
                                      newEfforts[i] = e.target.value;
                                      setActivityEfforts(newEfforts);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-3 space-y-2 text-sm">
                          <button className="bg-red-600 w-full text-white p-2 rounded hover:bg-red-800 text-center flex items-center justify-between">
                            <span>References - SOP / Policies / ..</span>
                            <FiLink className="ml-2" />
                          </button>
                          <button className="bg-yellow-100 border rounded text-center w-full hover:bg-yellow-200 p-2">
                            Enter Project Tracker Details
                          </button>
                          <button className="border rounded text-center w-full p-2 disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed hover:bg-gray-500 active:bg-gray-600" disabled>
                            Next Review (Due on) 23/June
                          </button>
                          <div className="flex bg-white-100 border rounded text-center w-full hover:bg-blue-200 p-2" >My Own Rating
                            <div className="flex-1 mt-1">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={myOwnRating}
                                  onChange={() => setMyOwnRating((prev) => !prev)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:bg-yellow-400 transition-all duration-300"></div>
                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
                                {/* <span className="ml-3 text-sm font-medium text-gray-900">{myOwnRating ? 'ON' : 'OFF'}</span> */}
                              </label>
                            </div>
                            <div className="flex-1 mt-1">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={myOwnRed}
                                  onChange={() => setMyOwnRed((prev) => !prev)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-400 rounded-full peer peer-checked:bg-red-500 transition-all duration-300"></div>
                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
                                {/* <span className="ml-3 text-sm font-medium text-red-600">{myOwnRed ? 'RED ON' : 'RED OFF'}</span> */}
                              </label>
                            </div>
                            <div className="flex-1 mt-1">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={myOwnOrange}
                                  onChange={() => setMyOwnOrange((prev) => !prev)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-400 rounded-full peer peer-checked:bg-orange-400 transition-all duration-300"></div>
                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
                                {/* <span className="ml-3 text-sm font-medium text-orange-600">{myOwnOrange ? 'ORANGE ON' : 'ORANGE OFF'}</span> */}
                              </label>
                            </div>
                          </div>
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
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="border p-2">{row.title}</td>
                    <td className="border p-2">{row.description}</td>
                    <td className="border p-2">{row.target}</td>
                    <td className="border p-2">{row.uom}</td>
                    <td className="border p-2">{row.period}</td>
                    <td className="border p-2">{row.dataSource}</td>
                    <td className="border p-2">{row.red}</td>
                    <td className="border p-2">{row.orange}</td>
                    <td className="border p-2">{row.effort}</td>
                    <td className="border p-2">{row.rating}</td>
                    <td className="border p-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded">My Actions</button>
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
