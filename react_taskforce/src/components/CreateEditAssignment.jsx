/**
 * CreateEditAssignment component.
 * Form for assigning multiple personnel to a task with shift validation ensuring all personnel match the task's shift.
 */
import React, { useState, useEffect } from 'react';
import { getAllTasks } from '../api/tasks';
import { getAllPersonnel } from '../api/personnel';
import { getAssignmentById, createAssignment, updateAssignment } from '../api/assignments';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getErrorMessage } from '../utils/validation';
import { toast } from 'react-toastify';

/**
 * Assignment form component with dynamic personnel addition, role selection, and shift consistency validation.
 */
export default function CreateEditAssignment() {
  const [taskId, setTaskId] = useState('');
  const [lines, setLines] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const [validationError, setValidationError] = useState('');
  const nav = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const editing = Boolean(id);
  const activeShift = location.state?.shift; // Get the shift passed from ListAssignment

  useEffect(() => {
    getAllTasks().then(setTasks);
    getAllPersonnel().then(setPeople);
    if (editing) {
      getAssignmentById(id).then(a => {
        setTaskId(a.task_id);
        // Ensure lines is always an array
        setLines(a.lines || []);
      });
    }
  }, [editing, id]);

  // Get the selected task's shift
  const getTaskShift = () => {
    const task = tasks.find(t => t.id === Number(taskId));
    return task ? task.shift : null;
  };

  // Validate that all selected personnel are from the same shift as the task
  const validateShifts = () => {
    const taskShift = getTaskShift();
    if (!taskShift) {
      setValidationError('');
      return true;
    }

    // Check each personnel in lines
    for (const line of lines) {
      if (line.personnel_id) {
        const person = people.find(p => p.id === Number(line.personnel_id));
        if (person && person.shift !== taskShift) {
          setValidationError(`${person.name} is on ${person.shift} shift, but the task is for ${taskShift} shift. All personnel must be on the same shift as the task.`);
          return false;
        }
      }
    }

    setValidationError('');
    return true;
  };

  // Validate whenever lines or taskId changes
  useEffect(() => {
    if (taskId && lines.length > 0) {
      validateShifts();
    } else {
      setValidationError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, taskId]);

  const addLine = () => setLines([...lines, { personnel_id: '', role: '' }]);
  const updateLine = (idx, key, value) => {
    const updated = [...lines];
    updated[idx][key] = value;
    setLines(updated);
  };
  const removeLine = idx => setLines(lines.filter((_, i) => i !== idx));

  const save = async () => {
    // Validate task selection
    if (!taskId) {
      setValidationError('Please select a task before saving.');
      toast.error('Task selection is required. Please select a task.');
      return;
    }

    // Validate at least one personnel assignment
    if (lines.length === 0) {
      setValidationError('Please add at least one personnel assignment.');
      toast.error('At least one personnel assignment is required.');
      return;
    }

    // Validate all lines have both personnel and role
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].personnel_id) {
        setValidationError(`Row ${i + 1}: Personnel selection is required.`);
        toast.error(`Row ${i + 1}: Please select a personnel member.`);
        return;
      }
      if (!lines[i].role) {
        setValidationError(`Row ${i + 1}: Role selection is required.`);
        toast.error(`Row ${i + 1}: Please select a role for the personnel.`);
        return;
      }
    }

    // Validate shift matching
    if (!validateShifts()) {
      toast.error(validationError);
      return;
    }

    try {
      const data = { task_id: taskId, lines };
      if (editing) {
        await updateAssignment(id, data);
        toast.success('Assignment updated successfully!');
      } else {
        await createAssignment(data);
        toast.success('Assignment created successfully!');
      }
      nav('/assignments', { state: { shift: activeShift } });
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setValidationError(errorMsg);
      toast.error(`Failed to ${editing ? 'update' : 'create'} assignment: ${errorMsg}`);
    }
  };

  // Filter tasks to show only those matching the active shift (when creating new assignment)
  const filteredTasks = !editing && activeShift ? tasks.filter(t => t.shift === activeShift) : tasks;
  
  // Filter personnel to show only those matching the task's shift OR active shift (when no task selected yet)
  const filteredPeople = taskId 
    ? people.filter(p => p.shift === getTaskShift()) 
    : (!editing && activeShift ? people.filter(p => p.shift === activeShift) : people);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-clipboard-check me-2"></i>
                {editing ? 'Edit' : 'New'} Assignment
              </h2>
              
              {validationError && (
                <div className="alert alert-danger" role="alert">
                  {validationError}
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="taskId" className="form-label">Task {activeShift && `(${activeShift} Shift)`}</label>
                <select id="taskId" className="form-select" value={taskId} onChange={e => setTaskId(e.target.value)}>
                  <option value="">-- Select Task --</option>
                  {filteredTasks.map(t => (<option key={t.id} value={t.id}>{t.description} ({t.shift} shift)</option>))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Personnel Assignments</label>
                {lines.map((line, i) => (
                  <div key={i} className="row g-2 mb-2">
                    <div className="col">
                      <select className="form-select" value={line.personnel_id} onChange={e => updateLine(i, 'personnel_id', e.target.value)}>
                        <option value="">-- Person --</option>
                        {filteredPeople.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.shift} shift)</option>))}
                      </select>
                    </div>
                    <div className="col">
                      <select className="form-select" value={line.role} onChange={e => updateLine(i, 'role', e.target.value)}>
                        <option value="">-- Role --</option>
                        <option>Captain</option>
                        <option>Coordinator</option>
                        <option>Collaborator</option>
                        <option>Trainee</option>
                      </select>
                    </div>
                    <div className="col-auto">
                      <button type="button" className="btn btn-outline-danger" onClick={() => removeLine(i)}>×</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={addLine}>
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Person
                </button>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={save} disabled={!taskId || lines.length === 0 || validationError}>
                  <i className="bi bi-save me-2"></i>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={() => nav('/assignments', { state: { shift: activeShift } })}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}