import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboard';
import { getAllTasks } from '../api/tasks';
import { getAllPersonnel } from '../api/personnel';
import { getAllAircraft } from '../api/aircraft';
import { getAllAssignments } from '../api/assignments';
import { getAllTraining } from '../api/training';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [training, setTraining] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, tasksData, personnelData, aircraftData, assignmentsData, trainingData] = await Promise.all([
        getDashboardStats(),
        getAllTasks(),
        getAllPersonnel(),
        getAllAircraft(),
        getAllAssignments(),
        getAllTraining()
      ]);
      setStats(statsData);
      setTasks(tasksData.slice(0, 5)); // Show first 5
      setPersonnel(personnelData.slice(0, 5));
      setAircraft(aircraftData.slice(0, 5));
      setAssignments(assignmentsData.slice(0, 5));
      setTraining(trainingData.slice(0, 5));
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="page-container">
      <div className="page-header justify-content-center align-items-center">
        <h1 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>Dashboard</h1>
      </div>

      {/* Two Column Layout with Preview Windows */}
      <div style={{maxWidth: '1600px', margin: '0 auto', padding: '0 20px'}}>
        <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-6 col-md-12">
          {/* Tasks Preview */}
          <div className="card mb-4">
            <div 
              className="card-header" 
              style={{cursor: 'pointer', padding: '1rem 3rem', textAlign: 'center', position: 'relative'}}
              onClick={() => navigate('/tasks')}
            >
              <h3 className="mb-0" style={{fontSize: '1.75rem', fontWeight: '600'}}>
                <i className="bi bi-list-task me-2"></i>
                Tasks ({stats?.taskStatsByStatus.reduce((sum, s) => sum + s.count, 0) || 0})
              </h3>
              <i className="bi bi-arrow-right-circle" style={{fontSize: '1.5rem', position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)'}}></i>
            </div>
            <div className="card-body" style={{padding: '10px', display: 'flex', justifyContent: 'center'}}>
              <div style={{ maxHeight: '350px', overflowY: 'auto', width: '95%', margin: '0 auto' }}>
                <table className="table table-hover mb-0">
                  <thead style={{position: 'sticky', top: 0, backgroundColor: '#1e3a5f', color: 'white', zIndex: 1}}>
                    <tr>
                      <th className="text-center">Aircraft</th>
                      <th className="text-center">Description</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length > 0 ? tasks.map(t => (
                      <tr key={t.id} onClick={() => navigate('/tasks')} style={{cursor: 'pointer'}}>
                        <td className="text-center">{aircraft.find(a => a.id === t.aircraft_id)?.tail_number || t.aircraft_id}</td>
                        <td className="text-center">{t.description.substring(0, 30)}...</td>
                        <td className="text-center">
                          <span className={`badge ${t.status === 'Complete' ? 'bg-success' : 'bg-warning'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="text-center text-muted">No tasks</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Personnel Preview */}
          <div className="card mb-4">
            <div 
              className="card-header" 
              style={{cursor: 'pointer', padding: '1rem 3rem', textAlign: 'center', position: 'relative'}}
              onClick={() => navigate('/personnel')}
            >
              <h3 className="mb-0" style={{fontSize: '1.75rem', fontWeight: '600'}}>
                <i className="bi bi-people me-2"></i>
                Personnel ({personnel.length})
              </h3>
              <i className="bi bi-arrow-right-circle" style={{fontSize: '1.5rem', position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)'}}></i>
            </div>
            <div className="card-body" style={{padding: '10px', display: 'flex', justifyContent: 'center'}}>
              <div style={{ maxHeight: '350px', overflowY: 'auto', width: '95%', margin: '0 auto' }}>
                <table className="table table-hover mb-0">
                  <thead style={{position: 'sticky', top: 0, backgroundColor: '#1e3a5f', color: 'white', zIndex: 1}}>
                    <tr>
                      <th className="text-center">Name</th>
                      <th className="text-center">Shift</th>
                      <th className="text-center">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personnel.length > 0 ? personnel.map(p => (
                      <tr key={p.id} onClick={() => navigate('/personnel')} style={{cursor: 'pointer'}}>
                        <td className="text-center">{p.name}</td>
                        <td className="text-center">{p.shift}</td>
                        <td className="text-center">{p.role}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="text-center text-muted">No personnel</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Aircraft Preview */}
          <div className="card mb-4">
            <div 
              className="card-header" 
              style={{cursor: 'pointer', padding: '1rem 3rem', textAlign: 'center', position: 'relative'}}
              onClick={() => navigate('/aircraft')}
            >
              <h3 className="mb-0" style={{fontSize: '1.75rem', fontWeight: '600'}}>
                <i className="bi bi-airplane me-2"></i>
                Aircraft ({aircraft.length})
              </h3>
              <i className="bi bi-arrow-right-circle" style={{fontSize: '1.5rem', position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)'}}></i>
            </div>
            <div className="card-body" style={{padding: '10px', display: 'flex', justifyContent: 'center'}}>
              <div style={{ maxHeight: '350px', overflowY: 'auto', width: '95%', margin: '0 auto' }}>
                <table className="table table-hover mb-0">
                  <thead style={{position: 'sticky', top: 0, backgroundColor: '#1e3a5f', color: 'white', zIndex: 1}}>
                    <tr>
                      <th className="text-center">ID</th>
                      <th className="text-center">Tail Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aircraft.length > 0 ? aircraft.map(a => (
                      <tr key={a.id} onClick={() => navigate('/aircraft')} style={{cursor: 'pointer'}}>
                        <td className="text-center">{a.id}</td>
                        <td className="text-center">{a.tail_number}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="2" className="text-center text-muted">No aircraft</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-6 col-md-12">
          {/* Assignments Preview */}
          <div className="card mb-4">
            <div 
              className="card-header" 
              style={{cursor: 'pointer', padding: '1rem 3rem', textAlign: 'center', position: 'relative'}}
              onClick={() => navigate('/assignments')}
            >
              <h3 className="mb-0" style={{fontSize: '1.75rem', fontWeight: '600'}}>
                <i className="bi bi-clipboard-check me-2"></i>
                Assignments ({stats?.totalAssignments || 0})
              </h3>
              <i className="bi bi-arrow-right-circle" style={{fontSize: '1.5rem', position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)'}}></i>
            </div>
            <div className="card-body" style={{padding: '10px', display: 'flex', justifyContent: 'center'}}>
              <div style={{ maxHeight: '350px', overflowY: 'auto', width: '95%', margin: '0 auto' }}>
                <table className="table table-hover mb-0">
                  <thead style={{position: 'sticky', top: 0, backgroundColor: '#1e3a5f', color: 'white', zIndex: 1}}>
                    <tr>
                      <th className="text-center">Task</th>
                      <th className="text-center">Personnel</th>
                      <th className="text-center">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length > 0 ? assignments.map((a, idx) => (
                      <tr key={a.assignment_id || idx} onClick={() => navigate('/assignments')} style={{cursor: 'pointer'}}>
                        <td className="text-center">{a.task_description}</td>
                        <td className="text-center">{a.personnel_name}</td>
                        <td className="text-center">{a.assignment_role}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="text-center text-muted">No assignments</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Training Preview */}
          <div className="card mb-4">
            <div 
              className="card-header" 
              style={{cursor: 'pointer', padding: '1rem 3rem', textAlign: 'center', position: 'relative'}}
              onClick={() => navigate('/training')}
            >
              <h3 className="mb-0" style={{fontSize: '1.75rem', fontWeight: '600'}}>
                <i className="bi bi-book me-2"></i>
                Training ({stats?.training.total || 0})
              </h3>
              <i className="bi bi-arrow-right-circle" style={{fontSize: '1.5rem', position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)'}}></i>
            </div>
            <div className="card-body" style={{padding: '10px', display: 'flex', justifyContent: 'center'}}>
              <div style={{ maxHeight: '350px', overflowY: 'auto', width: '95%', margin: '0 auto' }}>
                <table className="table table-hover mb-0">
                  <thead style={{position: 'sticky', top: 0, backgroundColor: '#1e3a5f', color: 'white', zIndex: 1}}>
                    <tr>
                      <th className="text-center">Personnel</th>
                      <th className="text-center">Phase</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {training.length > 0 ? training.map((t, idx) => (
                      <tr key={idx} onClick={() => navigate('/training')} style={{cursor: 'pointer'}}>
                        <td className="text-center">{personnel.find(p => p.id === t.personnel_id)?.name || t.personnel_id}</td>
                        <td className="text-center">{t.phase}</td>
                        <td className="text-center">
                          <span className={`badge ${t.complete ? 'bg-success' : 'bg-warning'}`}>
                            {t.complete ? 'Complete' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="text-center text-muted">No training records</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Archives Preview */}
          <div className="card mb-4">
            <div 
              className="card-header" 
              style={{cursor: 'pointer', padding: '1rem 3rem', textAlign: 'center', position: 'relative'}}
              onClick={() => navigate('/archives')}
            >
              <h3 className="mb-0" style={{fontSize: '1.75rem', fontWeight: '600'}}>
                <i className="bi bi-archive me-2"></i>
                Archives
              </h3>
              <i className="bi bi-arrow-right-circle" style={{fontSize: '1.5rem', position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)'}}></i>
            </div>
            <div className="card-body text-center py-5">
              <i className="bi bi-archive" style={{fontSize: '3rem', color: '#1e3a5f'}}></i>
              <p className="mt-3 mb-0 text-muted">Click to view archived data</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
