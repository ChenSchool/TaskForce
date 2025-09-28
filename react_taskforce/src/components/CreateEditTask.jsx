import React, { useState, useEffect } from 'react';
import { getAllAircraft } from '../api/aircraft';
import { getTaskById, createTask, updateTask } from '../api/tasks';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateEditTask() {
  const [desc, setDesc] = useState('');
  const [shift, setShift] = useState('1st');
  const [status, setStatus] = useState('Incomplete');
  const [date, setDate] = useState('');
  const [aircraft, setAircraft] = useState([]);
  const [aircraftId, setAircraftId] = useState('');
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    getAllAircraft().then(setAircraft);
    if (editing) {
      getTaskById(id).then(t => {
        setDesc(t.description);
        setShift(t.shift);
        setStatus(t.status);
        setDate(t.date);
        setAircraftId(t.aircraft_id);
      });
    }
  }, [editing, id]);

  const save = () => {
    const data = { description: desc, shift, status, date, aircraft_id: aircraftId };
    const fn = editing ? updateTask(id, data) : createTask(data);
    fn.then(() => nav('/tasks'));
  };

  return (
    <div>
      <h2>{editing ? 'Edit' : 'New'} Task</h2>
      <div className="mb-3">
        <label>Aircraft</label>
        <select className="form-select" value={aircraftId} onChange={e=>setAircraftId(e.target.value)}>
          <option value="">-- Select --</option>
          {aircraft.map(a => <option key={a.id} value={a.id}>{a.tail_number}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label>Shift</label>
        <select className="form-select" value={shift} onChange={e=>setShift(e.target.value)}>
          <option>1st</option><option>2nd</option><option>3rd</option>
        </select>
      </div>
      <div className="mb-3">
        <label>Status</label>
        <select className="form-select" value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Incomplete</option><option>Complete</option>
        </select>
      </div>
      <div className="mb-3">
        <label>Date</label>
        <input type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)} />
      </div>
      <div className="mb-3">
        <label>Description</label>
        <textarea className="form-control" value={desc} onChange={e=>setDesc(e.target.value)} />
      </div>
      <button className="btn btn-success me-2" onClick={save} disabled={!desc || !date || !aircraftId}>Save</button>
      <button className="btn btn-link" onClick={()=>nav('/tasks')}>Cancel</button>
    </div>
  );
}