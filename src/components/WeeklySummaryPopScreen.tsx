import React from 'react';

interface WeeklySummaryPopScreenProps {
  isOpen: boolean;
  data: any;
  onClose: () => void;
}

const WeeklySummaryPopScreen: React.FC<WeeklySummaryPopScreenProps> = ({ isOpen, data, onClose }) => {
  if (!isOpen || !data) return null;
  return (
    <div className="absolute left-0 top-0 w-full h-full z-30 bg-white/80 backdrop-blur-sm flex items-center justify-center" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div className="relative w-full max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Weekly Summary Details</h2>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="font-semibold mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
              <div className="bg-gray-100 px-2 py-1 rounded text-gray-700">{String(value)}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-white pt-4 pb-2 z-10">
          <button type="button" className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummaryPopScreen;