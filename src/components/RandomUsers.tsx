import React, { useEffect, useState, FC } from 'react';
import { RANDOM_USERS_API_URL } from '../constants';

interface User {
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  nat: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

const RandomUsers: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${RANDOM_USERS_API_URL}50`);
        const data = await response.json();
        // Process the data and extract the top 5 users
        setUsers(data.results.slice(0, 5));
      } catch (err: unknown) {
        console.error('Error fetching random users:', err);
        const caughtError: Error = err instanceof Error ? err : new Error(String(err));
        setError(caughtError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="random-users">
      <h2>Random Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index} style={{ listStyleType: 'none', marginBottom: '1rem' }}>
            <img src={user.picture.thumbnail} alt={`${user.name.first} ${user.name.last}`} />
            <div>
              <p>
                <strong>Name:</strong> {user.name.first} {user.name.last}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Nationality:</strong> {user.nat}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RandomUsers;
