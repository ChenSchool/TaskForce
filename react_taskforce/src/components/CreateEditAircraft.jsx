/**
 * CreateEditAircraft component.
 * Form for creating new aircraft or editing existing aircraft with tail number validation.
 */
import React, { useState, useEffect } from 'react';
import { createAircraft, getAircraftById, updateAircraft } from '../api/aircraft';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../utils/validation';
import { toast } from 'react-toastify';

/**
 * Aircraft form component with client-side validation and toast notifications.
 */
export default function CreateEditAircraft() {
  const [tail, setTail] = useState('');
  const [error, setError] = useState('');
  const [tailError, setTailError] = useState('');
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    if(editing) getAircraftById(id).then(a=>setTail(a.tail_number));
  }, [editing, id]);

  const save = async () => {
    setError('');
    setTailError('');

    // Client-side validation
    if (!tail || tail.trim() === '') {
      setTailError('Tail number is required');
      setError('Aircraft tail number is required. Please enter a valid tail number.');
      toast.error('Aircraft tail number is required. Please enter a valid tail number.');
      return;
    }

    if (tail.length < 2) {
      setTailError('Tail number must be at least 2 characters');
      setError('Aircraft tail number must be at least 2 characters long.');
      toast.error('Aircraft tail number must be at least 2 characters long.');
      return;
    }

    try {
      if (editing) {
        await updateAircraft(id, { tail_number: tail });
        toast.success('Aircraft updated successfully!');
      } else {
        await createAircraft({ tail_number: tail });
        toast.success('Aircraft created successfully!');
      }
      nav('/aircraft');
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(`Failed to ${editing ? 'update' : 'create'} aircraft: ${errorMsg}`);
    }
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
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="tailNumber" className="form-label">Tail Number *</label>
                <input 
                  type="text"
                  id="tailNumber"
                  className={`form-control ${tailError ? 'is-invalid' : ''}`}
                  value={tail} 
                  onChange={e=>setTail(e.target.value.toUpperCase())} 
                  placeholder="Enter aircraft tail number"
                  style={{ textTransform: 'uppercase' }}
                />
                {tailError && (
                  <div className="invalid-feedback">{tailError}</div>
                )}
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