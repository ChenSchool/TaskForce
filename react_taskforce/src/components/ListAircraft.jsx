import React, { useState, useEffect } from 'react';
import { getAllAircraft, deleteAircraft } from '../api/aircraft';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, exportToPDF } from '../utils/export';

export default function ListAircraft() {
  const [list, setList] = useState([]);
  const nav = useNavigate();

  useEffect(() => { getAllAircraft().then(setList); }, []);

  const handleExportCSV = () => {
    exportToCSV(list, 'aircraft');
  };

  const handleExportPDF = () => {
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Tail Number', dataKey: 'tail_number' }
    ];
    exportToPDF(list, 'aircraft', 'Aircraft List', columns);
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Aircraft Data</h2>
          <div className="export-buttons">
            <button className="btn btn-success btn-sm me-2" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
            </button>
            <button className="btn btn-danger btn-sm me-2" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf"></i> Export PDF
            </button>
            <button className="btn btn-light" onClick={()=>nav('/aircraft/new')}>
              <i className="bi bi-plus-circle"></i> Add Aircraft
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Aircraft Tail Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(a => (
                <tr key={a.id}>
                  <td>{a.tail_number}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-outline-primary" onClick={()=>nav(`/aircraft/${a.id}`)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>{ if(window.confirm('Delete this aircraft?')) deleteAircraft(a.id).then(()=>getAllAircraft().then(setList)); }}>
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}