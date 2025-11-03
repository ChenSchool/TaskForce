import React, { useState, useEffect } from 'react';
import { getAllTasks } from '../api/tasks';
import { getAllPersonnel } from '../api/personnel';
import { getAssignmentById, createAssignment, updateAssignment } from '../api/assignments';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateEditAssignment() {
  const [taskId, setTaskId] = useState('');
  const [lines, setLines] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const [validationError, setValidationError] = useState('');
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

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

  const save = () => {
    if (!validateShifts()) {
      return;
    }
    const data = { task_id: taskId, lines };
    const fn = editing ? updateAssignment(id, data) : createAssignment(data);
    fn.then(() => nav('/assignments'));
  };

  // Filter personnel to show only those matching the task's shift
  const filteredPeople = taskId ? people.filter(p => p.shift === getTaskShift()) : people;

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
                <label htmlFor="taskId" className="form-label">Task</label>
                <select id="taskId" className="form-select" value={taskId} onChange={e => setTaskId(e.target.value)}>
                  <option value="">-- Select Task --</option>
                  {tasks.map(t => (<option key={t.id} value={t.id}>{t.description} ({t.shift} shift)</option>))}
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
                <button className="btn btn-secondary" onClick={() => nav('/assignments')}>
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