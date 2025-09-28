import React, { useState, useEffect } from 'react';
import { createAircraft, getAircraftById, updateAircraft } from '../api/aircraft';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateEditAircraft() {
  const [tail, setTail] = useState('');
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    if(editing) getAircraftById(id).then(a=>setTail(a.tail_number));
  }, [editing, id]);

  const save = () => {
    const fn = editing ? updateAircraft(id, { tail_number: tail }) : createAircraft({ tail_number: tail });
    fn.then(()=>nav('/aircraft'));
  };

  return (
    <div>
      <h2>{editing ? 'Edit' : 'New'} Aircraft</h2>
      <div className="mb-3">
        <label className="form-label">Tail Number</label>
        <input className="form-control" value={tail} onChange={e=>setTail(e.target.value)} />
      </div>
      <button className="btn btn-success me-2" onClick={save} disabled={!tail}>Save</button>
      <button className="btn btn-link" onClick={()=>nav('/aircraft')}>Cancel</button>
    </div>
  );
}