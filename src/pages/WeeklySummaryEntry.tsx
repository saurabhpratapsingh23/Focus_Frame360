import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import WeeklyGoalsAction from "./WeeklyGoalsAction";
import '../App.css'

interface WeekDetail {
    weekStart: string;
    weekEnd: string;
    WD: number;
    H: number;
    L: number;
    WFH: number;
    WFO: number;
    ED: number;
    Efforts: string;
    Status: string;
}

const defaultRow: WeekDetail = {
    weekStart: '',
    weekEnd: '',
    WD: 0,
    H: 0,
    L: 0,
    WFH: 0,
    WFO: 0,
    ED: 0,
    Efforts: '',
    Status: 'In-Progress',
};

const WeeklySummaryEntry: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { editIndex, weekDetail } = (location.state || {}) as { editIndex?: number | null, weekDetail?: WeekDetail };

    const [weekDetails, setWeekDetails] = useState<WeekDetail[]>([]);
    const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
    const [editRow, setEditRow] = useState<WeekDetail | null>(null);

    const [summaries, setSummaries] = useState<string[]>(['', '', '', '']);
    const [summaryFocus, setSummaryFocus] = useState<boolean[]>([false, false, false, false]);
    const [formattingStates, setFormattingStates] = useState<{
      [key: number]: { bold: boolean; italic: boolean; underline: boolean; }
    }>({});
    const placeholders = [
      'List key accomplishments, deliverables, etc.',
      'Mention any blockers, dependencies or issues.',
      'Carry-forward or uncompleted tasks.',
      'Plan for next sprint/week.',
    ];

    const [selectedProject, setSelectedProject] = useState('Project 1');

    const [summarySections, setSummarySections] = useState([
      { selectedProject: 'Project 1', summaries: ['', '', '', ''] }
    ]);

    // Create refs for each section and each summary box
    const summaryRefs = useRef<Array<Array<HTMLDivElement | null>>>([]);
    // Ensure refs array matches the number of sections and boxes
    useEffect(() => {
      summaryRefs.current = summarySections.map(
        (section, sectionIdx) =>
          section.summaries.map((_, summaryIdx) =>
            summaryRefs.current[sectionIdx]?.[summaryIdx] || null
          )
      );
    }, [summarySections.length]);

    useEffect(() => {
      const stored = localStorage.getItem('weekDetails');
      let initial: WeekDetail[] = stored ? JSON.parse(stored) : [{ ...defaultRow }];
      setWeekDetails(initial);
      
      // Use editData from props if available, otherwise use location state
      const finalEditIndex = editIndex;
      const finalWeekDetail = weekDetail;
      
      if (typeof finalEditIndex === 'number' && finalWeekDetail) {
        setEditRowIndex(finalEditIndex);
        setEditRow({ ...finalWeekDetail });
      } else if (finalEditIndex === null) {
        setEditRowIndex(initial.length);
        setEditRow({ ...defaultRow });
      }
    }, [editIndex, weekDetail]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!editRow) return;
      const { name, value } = e.target;
      setEditRow({ ...editRow, [name]: name === 'Efforts' || name === 'Status' ? value : Number(value) || value });
    };

    const handleSave = () => {
      if (editRowIndex === null || !editRow) return;
      const updated = [...weekDetails];
      if (editRowIndex < weekDetails.length) {
        updated[editRowIndex] = editRow;
      } else {
        updated.push(editRow);
      }
      setWeekDetails(updated);
      localStorage.setItem('weekDetails', JSON.stringify(updated));
      navigate('/app/weeklysummary');
    };

    const handleCancel = () => {
      navigate('/app/weeklysummary');
    };

    const handleDelete = (idx: number) => {
      const updated = weekDetails.filter((_, i) => i !== idx);
      setWeekDetails(updated);
      localStorage.setItem('weekDetails', JSON.stringify(updated));
    };

    const handleEdit = (idx: number) => {
      setEditRowIndex(idx);
      setEditRow({ ...weekDetails[idx] });
    };

    const handleAdd = () => {
      setEditRowIndex(weekDetails.length);
      setEditRow({ ...defaultRow });
    };

    const handleInput = (index: number, html: string) => {
      const updated = [...summaries];
      // Clean up the HTML and ensure proper text handling
      let cleanedHtml = html;
      
      // Remove trailing <br> for empty lines
      cleanedHtml = cleanedHtml.replace(/<br>$/, '');
      
      // Ensure we don't lose content due to React interference
      if (cleanedHtml !== updated[index]) {
        updated[index] = cleanedHtml;
        setSummaries(updated);
      }
    };

    const handleSummaryFocus = (index: number) => {
      const updated = [...summaryFocus];
      updated[index] = true;
      setSummaryFocus(updated);
    };

    const handleSummaryBlur = (index: number) => {
      const updated = [...summaryFocus];
      updated[index] = false;
      setSummaryFocus(updated);
    };

    // Handler to add a new summary section
    const handleAddMore = () => {
      setSummarySections([
        ...summarySections,
        { selectedProject: 'Project 1', summaries: ['', '', '', ''] }
      ]);
    };

    // Handler to update project or summaries in a section
    const updateSection = (idx: number, field: string, value: string) => {
      setSummarySections(sections =>
        sections.map((section, i) =>
          i === idx
            ? { ...section, [field]: value }
            : section
        )
      );
    };
    const updateSummary = (sectionIdx: number, summaryIdx: number, value: string) => {
      setSummarySections(sections =>
        sections.map((section, i) =>
          i === sectionIdx
            ? { ...section, summaries: section.summaries.map((s, j) => (j === summaryIdx ? value : s)) }
            : section
        )
      );
    };

    // Formatting handlers using refs
    const handleFormatting = (sectionIdx: number, summaryIdx: number, format: 'bold' | 'italic' | 'underline') => {
      const ref = summaryRefs.current[sectionIdx]?.[summaryIdx];
      if (ref) {
        ref.focus();
        document.execCommand(format, false, undefined);
      }
    };

    const handleBulletPoint = (sectionIdx: number, summaryIdx: number) => {
      const ref = summaryRefs.current[sectionIdx]?.[summaryIdx];
      if (ref) {
        ref.focus();
        document.execCommand('insertUnorderedList', false, undefined);
      }
    };

    // On blur, update state with the current HTML
    const handleBlur = (sectionIdx: number, summaryIdx: number) => {
      const ref = summaryRefs.current[sectionIdx]?.[summaryIdx];
      if (ref) {
        updateSummary(sectionIdx, summaryIdx, ref.innerHTML);
      }
    };

    const getCursorPosition = (element: HTMLElement): number => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
      }
      return 0;
    };

    const isAtBeginningOfLine = (text: string, position: number): boolean => {
      if (position === 0) return true;
      
      const beforeCursor = text.substring(0, position);
      const lines = beforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];
      
      return currentLine === '';
    };

    const getFormattingState = (index: number, format: 'bold' | 'italic' | 'underline') => {
      return formattingStates[index]?.[format] || false;
    };

  

  return (
    <div>
    <div className="container mx-auto py-6 font-sans text-gray-900">
      <div className="bg-white rounded-md shadow p-4">  
      <h2 className="text-lg font-bold text-white bg-blue-900 px-4 py-2 rounded-t-md">Weekly Summary</h2>
        <table className="w-full text-center text-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                'Week Start Date', 'Week End Date', 'WD', 'H', 'L',
                'WFH', 'WFO', 'ED', 'Efforts (D & Hrs)', 'Status', 'Actions'
              ].map((th) => (
                <th key={th} className="p-2 border font-medium">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Only show the editable row (edit or add) */}
            {editRow && (
              <tr>
                <td className="p-2 border">
                  <input
                    type="date"
                    name="weekStart"
                    value={editRow.weekStart}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-black text-white px-3 py-2 appearance-none border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="date"
                    name="weekEnd"
                    value={editRow.weekEnd}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-black text-white px-3 py-2 appearance-none border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    name="WD"
                    value={editRow.WD}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-yellow-300 text-black px-3 py-2 border-none focus:ring-2 focus:ring-yellow-500 font-semibold text-center"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    name="H"
                    value={editRow.H}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-yellow-300 text-black px-3 py-2 border-none focus:ring-2 focus:ring-yellow-500 font-semibold text-center"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    name="L"
                    value={editRow.L}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-yellow-300 text-black px-3 py-2 border-none focus:ring-2 focus:ring-yellow-500 font-semibold text-center"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    name="WFH"
                    value={editRow.WFH}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-yellow-300 text-black px-3 py-2 border-none focus:ring-2 focus:ring-yellow-500 font-semibold text-center"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    name="WFO"
                    value={editRow.WFO}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-yellow-300 text-black px-3 py-2 border-none focus:ring-2 focus:ring-yellow-500 font-semibold text-center"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    name="ED"
                    value={editRow.ED}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-yellow-300 text-black px-3 py-2 border-none focus:ring-2 focus:ring-yellow-500 font-semibold text-center"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    name="Efforts"
                    value={editRow.Efforts}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-yellow-300 text-black px-3 py-2 border-none focus:ring-2 focus:ring-yellow-500 font-semibold text-center"
                    style={{ minWidth: 0 }}
                  />
                </td>
                <td className="p-2 border">
                  <select
                    name="Status"
                    value={editRow.Status}
                    onChange={handleChange}
                    className="w-full text-xs rounded-md bg-yellow-300 text-black px-3 py-2 border-none focus:ring-2 focus:ring-yellow-500 font-semibold text-center"
                    style={{ minWidth: 0 }}
                  >
                    <option value="In-Progress">In-Progress</option>
                    <option value="un-touched">Untouched</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <button className="text-green-600 hover:text-green-800 mr-2" title="Save" onClick={handleSave}>💾</button>
                  <button className="text-gray-500 hover:text-gray-700" title="Cancel" onClick={handleCancel}>✖️</button>
                </td>
              </tr>
            )}
          </tbody>
          
        </table>
         {/* Legend Section */}
    <div className="bg-white rounded-md shadow p-4 text-xs text-gray-600">
    WD = Working Days, H = Holidays, L = Leaves, WFH = Working from Home, WFO = Working from Office, ED =  Extra day(s);
    <strong className="ml-2">[Displaying last 12 Weeks]</strong>
  </div>
      </div>
      
    </div>
   

 {/* Weekly Summary Section */}
 <div className="bg-white rounded-md shadow p-6 mt-8">
        <div className="flex justify-between bg-blue-900 rounded-t-md items-center">
          <h2 className="text-lg font-bold text-white bg-blue-900 px-4 py-2 rounded-t-md">Weekly Summary</h2>
          {/* <button
            className="ml-4 bg-blue-700 hover:bg-blue-400 text-white font-semibold px-4 py-2 mr-1 rounded shadow"
            onClick={handleAddMore}
          >
            Add More
          </button> */}
        </div>
        {/* Four labeled textarea boxes below the summary header, all on a single line */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="flex-1 min-w-0">
            <label className="block border border-blue-300 p-2 bg-blue-300 rounded-t-md text-sm font-semibold mb-1" htmlFor="achievement-summary">Achievement Summary</label>
            <textarea
              id="achievement-summary"
              className="w-full min-h-[80px] border border-gray-300 mt-2 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="List key accomplishments, deliverables, etc."
            />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block border border-blue-300 p-2 bg-blue-300 rounded-t-md text-sm font-semibold mb-1" htmlFor="roadblocks">Road Blocks/Challenges</label>
            <textarea
              id="roadblocks"
              className="w-full min-h-[80px] border border-gray-300 mt-2 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Mention any blockers, dependencies or issues."
            />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block border border-blue-300 p-2 bg-blue-300 rounded-t-md text-sm font-semibold mb-1" htmlFor="next-action">Next action plan</label>
            <textarea
              id="next-action"
              className="w-full min-h-[80px] border border-gray-300 mt-2 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Plan for next sprint/week."
            />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block border border-blue-300 p-2 bg-blue-300 rounded-t-md text-sm font-semibold mb-1" htmlFor="unfinished-tasks">Unfinished Tasks</label>
            <textarea
              id="unfinished-tasks"
              className="w-full min-h-[80px] border border-gray-300 mt-2 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Carry-forward or uncompleted tasks."
            />
          </div>
        </div>
      </div>
      <WeeklyGoalsAction/>
</div>




  
  );
};

export default WeeklySummaryEntry;
