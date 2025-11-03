import React, { useState, useEffect } from 'react';
import { getAllUsers, deactivateUser } from '../api/users';
import { getAssignmentsByPersonnelId, deleteAssignmentsByPersonnelId } from '../api/assignments';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ListUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAssignmentWarning, setShowAssignmentWarning] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userAssignments, setUserAssignments] = useState([]);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleDeleteClick = async (userId) => {
    try {
      // Check if user has any assignments
      const assignments = await getAssignmentsByPersonnelId(userId);
      
      if (assignments && assignments.length > 0) {
        // User has assignments - show warning modal
        setUserToDelete(userId);
        setUserAssignments(assignments);
        setShowAssignmentWarning(true);
      } else {
        // No assignments - show normal confirmation
        setUserToDelete(userId);
        setUserAssignments([]);
        setShowConfirm(true);
      }
    } catch (err) {
      toast.error('Failed to check user assignments');
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete !== null) {
      try {
        await deactivateUser(userToDelete);
        toast.success('User deleted successfully!');
        load();
        setShowConfirm(false);
        setUserToDelete(null);
      } catch (err) {
        toast.error('Failed to delete user: ' + err.message);
        setShowConfirm(false);
        setUserToDelete(null);
      }
    }
  };

  const handleDeleteWithAssignments = async () => {
    if (userToDelete !== null) {
      try {
        // First delete all assignments
        await deleteAssignmentsByPersonnelId(userToDelete);
        
        // Then delete the user
        await deactivateUser(userToDelete);
        
        toast.success('User and their assignments deleted successfully!');
        load();
        setShowAssignmentWarning(false);
        setUserToDelete(null);
        setUserAssignments([]);
      } catch (err) {
        toast.error('Failed to delete user: ' + err.message);
        setShowAssignmentWarning(false);
        setUserToDelete(null);
        setUserAssignments([]);
      }
    }
  };

  const handleCancelDeleteWithAssignments = () => {
    toast.info('Cannot delete a user that is still assigned to tasks');
    setShowAssignmentWarning(false);
    setUserToDelete(null);
    setUserAssignments([]);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setUserToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Manager':
        return 'bg-danger';
      case 'Production Lead':
        return 'bg-warning';
      case 'Supervisor':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Users</h2>
          <div className="export-buttons">
            <button className="btn btn-light" onClick={() => navigate('/users/new')}>
              <i className="bi bi-plus-circle"></i> Create User
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="table-responsive">
          <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.name || '-'}</td>
              <td>{u.email || '-'}</td>
              <td>
                <span className={`badge ${getRoleBadgeClass(u.role)}`}>
                  {u.role}
                </span>
              </td>
              <td>{formatDate(u.last_login)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/users/${u.id}`)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  {currentUser?.id !== u.id && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteClick(u.id)}
                    >
                      <i className="bi bi-trash"></i> Deactivate
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
      {showConfirm && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deactivation</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to deactivate this user?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                <button className="btn btn-danger" onClick={handleConfirmDelete}>Deactivate</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignmentWarning && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle"></i> User Has Active Task Assignments
                </h5>
                <button type="button" className="btn-close" onClick={handleCancelDeleteWithAssignments}></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  <strong>This user is currently assigned to {userAssignments.length} task(s):</strong>
                </p>
                <ul className="list-group mb-3">
                  {userAssignments.map((assignment, index) => (
                    <li key={index} className="list-group-item">
                      <strong>Task:</strong> {assignment.task_description} <br />
                      <strong>Role:</strong> {assignment.role}
                    </li>
                  ))}
                </ul>
                <p className="text-danger fw-bold">
                  Do you want to delete all of these assignments as well?
                </p>
                <ul>
                  <li><strong>Yes:</strong> Delete the user AND all their task assignments</li>
                  <li><strong>No:</strong> Cancel deletion (user cannot be deleted while assigned to tasks)</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelDeleteWithAssignments}>
                  <i className="bi bi-x-circle"></i> No, Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteWithAssignments}>
                  <i className="bi bi-trash"></i> Yes, Delete User and Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
