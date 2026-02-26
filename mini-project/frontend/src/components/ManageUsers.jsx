import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users"); 
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= VERIFY TOGGLE ================= */
  const toggleVerify = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/users/verify/${id}`, {
        is_verified: !currentStatus,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */
  if (loading) return <h3>Loading users...</h3>;

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>OTP</th>
            <th>Verified</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.otp}</td>
              <td>
                {user.is_verified ? "✅ Yes" : "❌ No"}
              </td>
              <td>
                {new Date(user.created_at).toLocaleString()}
              </td>

              <td>
                <button
                  onClick={() =>
                    toggleVerify(user.id, user.is_verified)
                  }
                >
                  Toggle Verify
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;