import { useEffect, useState } from 'react';

export default function UserProfile({ userId = 1 }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, maxWidth: 520 }}>
      <h2>User Profile</h2>

      {loading && <div role="status">Loading user data...</div>}

      {error && (
        <div role="alert" style={{ color: 'crimson' }}>
          Error: {error}
        </div>
      )}

      {user && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Website:</strong> {user.website}</p>
        </div>
      )}

      {!loading && !error && !user && <div>No user data.</div>}
    </div>
  );
}
