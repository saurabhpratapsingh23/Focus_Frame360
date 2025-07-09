import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
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

    const handleBulletPoint = (index: number) => {
      // Use execCommand for bullet points, similar to bold/italic/underline
      // This approach works better with contentEditable and doesn't interfere with deletion
      
      // First, ensure the text area is focused
      const textArea = document.querySelector(`[data-textarea-index="${index}"]`) as HTMLDivElement;
      if (textArea) {
        textArea.focus();
        
        // Check if there's selected text
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          if (!range.collapsed) {
            // If text is selected, convert to bullet points
            const selectedText = range.toString();
            const lines = selectedText.split('\n');
            const bulletedLines = lines.map(line => line.trim() ? `• ${line.trim()}` : '').join('\n');
            
            // Use execCommand to insert the bulleted text
            document.execCommand('insertText', false, bulletedLines);
          } else {
            // If no text is selected, insert bullet point at cursor
            // Check if we're at the beginning of a line
            const currentText = textArea.textContent || '';
            const cursorPosition = getCursorPosition(textArea);
            const isAtLineStart = isAtBeginningOfLine(currentText, cursorPosition);
            
            if (isAtLineStart) {
              // Insert bullet point at current position
              document.execCommand('insertText', false, '• ');
            } else {
              // Insert new line with bullet point
              document.execCommand('insertText', false, '\n• ');
            }
          }
        }
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

    const handleFormatting = (index: number, format: 'bold' | 'italic' | 'underline') => {
      // Toggle the formatting state
      setFormattingStates(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [format]: !prev[index]?.[format]
        }
      }));

      // Apply or remove the formatting
      document.execCommand(format, false, undefined);
    };

    const getFormattingState = (index: number, format: 'bold' | 'italic' | 'underline') => {
      return formattingStates[index]?.[format] || false;
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

    // const totals = weekDetails.reduce(
    //   (acc, row) => {
    //     acc.WD += Number(row.WD) || 0;
    //     acc.H += Number(row.H) || 0;
    //     acc.L += Number(row.L) || 0;
    //     acc.WFH += Number(row.WFH) || 0;
    //     acc.WFO += Number(row.WFO) || 0;
    //     acc.ED += Number(row.ED) || 0;
    //     return acc;
    //   },
    //   { WD: 0, H: 0, L: 0, WFH: 0, WFO: 0, ED: 0 }
    // );

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
          <button
            className="ml-4 bg-blue-700 hover:bg-blue-400 text-white font-semibold px-4 py-2 mr-1 rounded shadow"
            onClick={handleAddMore}
          >
            Add More
          </button>
        </div>
        {summarySections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="flex flex-col sm:flex-row sm:items-start sm:gap-6 mt-4">
            {/* Project Dropdown */}
            <div className="mb-4 sm:mb-0 sm:w-48">
              <label className="block font-semibold mb-2 text-sm">Project</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                value={section.selectedProject}
                onChange={e => updateSection(sectionIdx, 'selectedProject', e.target.value)}
              >
                <option value="Project 1">Project 1</option>
                <option value="Project 2">Project 2</option>
                <option value="Project 3">Project 3</option>
              </select>
            </div>
            {/* Summary Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
              {section.summaries.map((text, index) => (
                <div key={index} className="relative">
                  <label className="block font-semibold mb-2 text-sm">
                    {['Tasks Performed', 'Challenges', 'Unfinished Tasks', 'Next Actions'][index]}
                  </label>
                  {/* Show selected project above each box */}
                  <div className="text-xs text-blue-700 font-semibold mb-1">{section.selectedProject}</div>
                  <div className="flex gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => handleFormatting(index, 'bold')}
                      className={`text-sm px-2 py-1 border rounded font-bold transition-colors ${
                        getFormattingState(index, 'bold')
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title="Bold"
                    >B</button>
                    <button
                      type="button"
                      onClick={() => handleFormatting(index, 'italic')}
                      className={`text-sm px-2 py-1 border rounded italic transition-colors ${
                        getFormattingState(index, 'italic')
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title="Italic"
                    >I</button>
                    <button
                      type="button"
                      onClick={() => handleFormatting(index, 'underline')}
                      className={`text-sm px-2 py-1 border rounded underline transition-colors ${
                        getFormattingState(index, 'underline')
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title="Underline"
                    >U</button>
                    <button
                      type="button"
                      onClick={() => handleBulletPoint(index)}
                      className="text-sm px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Bullet Point"
                    >•</button>
                  </div>
                  <div className="relative">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-[180px] border border-blue-900 bg-orange-100 rounded-md p-3 text-sm leading-relaxed shadow-inner overflow-y-auto resize-y focus:outline-none"
                      style={{ whiteSpace: 'pre-wrap' }}
                      data-textarea-index={index}
                      onInput={e => updateSummary(sectionIdx, index, (e.target as HTMLDivElement).innerHTML)}
                      onFocus={() => handleSummaryFocus(index)}
                      onBlur={() => handleSummaryBlur(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' || e.key === 'Delete') {
                          return;
                        }
                      }}
                      spellCheck={true}
                      tabIndex={0}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
</div>




  
  );
};

export default WeeklySummaryEntry;
