import React, { useState } from 'react';

/**
 * Collapsible table showing nightly (consolidated) or individual session results
 */
const ResultsTable = ({ results, rawSessions = [], ignoreFirstNinety = false }) => {
  const [showTable, setShowTable] = useState(true);
  const [viewMode, setViewMode] = useState('nightly'); // 'nightly' or 'individual'

  // For individual view with trimmed mode, filter out sessions without trimmed data
  const filteredRawSessions = ignoreFirstNinety
    ? rawSessions.filter(s => s.trimmed_flScore != null)
    : rawSessions;

  const displayData = viewMode === 'nightly' ? results : filteredRawSessions;
  // Reverse order so newest appears first
  const reversedResults = [...displayData].sort((a, b) => b.date - a.date);

  const getVal = (result, key) => {
    // For nightly view, consolidation already picked the right scores
    if (viewMode === 'nightly') return result[key];
    // For individual view, use trimmed scores when toggle is on
    if (ignoreFirstNinety && result[`trimmed_${key}`] != null) {
      return result[`trimmed_${key}`];
    }
    return result[key];
  };

  const getDur = (result) => {
    if (viewMode === 'nightly') return result.durationMinutes;
    if (ignoreFirstNinety && result.trimmed_durationMinutes != null) {
      return result.trimmed_durationMinutes;
    }
    return result.durationMinutes;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">
          {viewMode === 'nightly' ? 'Nightly Results' : 'Individual Sessions'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'nightly' ? 'individual' : 'nightly')}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-4 rounded transition-colors border border-white/20"
          >
            {viewMode === 'nightly' ? 'Show Individual' : 'Show Nightly'}
          </button>
          <button
            onClick={() => setShowTable(!showTable)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
          >
            {showTable ? '▲ Hide Table' : '▼ Show Table'}
          </button>
        </div>
      </div>

      {showTable && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white">
              <thead className="border-b border-white/20">
                <tr>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">{viewMode === 'nightly' ? 'Filename(s)' : 'Filename'}</th>
                  {viewMode === 'nightly' && <th className="text-center py-3 px-4">Sessions</th>}
                  <th className="text-center py-3 px-4">Duration</th>
                  <th className="text-center py-3 px-4">Sleep Disruption</th>
                  <th className="text-center py-3 px-4">Flow Limitation</th>
                  <th className="text-center py-3 px-4">Regularity</th>
                  <th className="text-center py-3 px-4">Periodicity</th>
                  <th className="text-center py-3 px-4">EAI</th>
                </tr>
              </thead>
              <tbody>
                {reversedResults.map((result, idx) => {
                  const fl = getVal(result, 'flScore');
                  const pi = getVal(result, 'periodicityIndex');
                  const rs = getVal(result, 'regularityScore');
                  const eai = getVal(result, 'eai');
                  const dur = getDur(result);
                  const composite = ((fl + pi + rs) / 3 + eai) / 2;
                  return (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        {result.date.toLocaleDateString()}
                        {result.isNap && <span className="ml-2 text-xs bg-yellow-500/30 text-yellow-200 px-2 py-0.5 rounded">NAP</span>}
                      </td>
                      <td className="py-3 px-4 text-xs text-blue-200">{result.filename}</td>
                      {viewMode === 'nightly' && (
                        <td className="py-3 px-4 text-center text-sm text-gray-300">
                          {result.sessionCount || 1}
                        </td>
                      )}
                      <td className="py-3 px-4 text-center text-sm">
                        {dur >= 60
                          ? `${(dur / 60).toFixed(1)}h`
                          : `${Math.round(dur)}m`
                        }
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-pink-300">{composite.toFixed(1)}</td>
                      <td className="py-3 px-4 text-center font-semibold text-orange-300">{fl.toFixed(1)}</td>
                      <td className="py-3 px-4 text-center font-semibold text-green-300">{rs.toFixed(1)}</td>
                      <td className="py-3 px-4 text-center font-semibold text-blue-300">{pi.toFixed(1)}</td>
                      <td className="py-3 px-4 text-center font-semibold text-purple-300">{eai.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-blue-200 text-xs mt-4">
            {viewMode === 'nightly'
              ? `Total nights analyzed: ${results.length} | You can continue adding more files to expand your dataset`
              : `Total sessions: ${filteredRawSessions.length}${ignoreFirstNinety && filteredRawSessions.length < rawSessions.length ? ` (${rawSessions.length - filteredRawSessions.length} too short to trim)` : ''} | You can continue adding more files to expand your dataset`
            }
          </p>
        </>
      )}

      {!showTable && (
        <p className="text-blue-200 text-sm">
          {viewMode === 'nightly'
            ? `${results.length} nights analyzed | Click "Show Table" to view results`
            : `${filteredRawSessions.length} sessions | Click "Show Table" to view results`
          }
        </p>
      )}
    </div>
  );
};

export default ResultsTable;
