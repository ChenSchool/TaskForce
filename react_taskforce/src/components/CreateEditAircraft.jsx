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
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-airplane me-2"></i>
                {editing ? 'Edit' : 'New'} Aircraft
              </h2>
              <div className="mb-3">
                <label htmlFor="tailNumber" className="form-label">Tail Number</label>
                <input 
                  type="text"
                  id="tailNumber"
                  className="form-control" 
                  value={tail} 
                  onChange={e=>setTail(e.target.value)} 
                  placeholder="Enter aircraft tail number"
                />
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={save} disabled={!tail}>
                  <i className="bi bi-save me-2"></i>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={()=>nav('/aircraft')}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Aircraft
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}