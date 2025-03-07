import React, { FC } from 'react';
import { RANDOM_USERS_API_URL } from '../constants';
import { useQuery } from '@tanstack/react-query';

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
  const { data, error, isLoading } = useQuery({
    queryKey: ['randomUsers'],
    queryFn: async () => {
      const response = await fetch(`${RANDOM_USERS_API_URL}50`);
      if (!response.ok) {
        throw new Error('Error fetching random users');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  // Process the data and extract the top 5 users
  const users: User[] = data?.results.slice(0, 5) ?? [];

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
