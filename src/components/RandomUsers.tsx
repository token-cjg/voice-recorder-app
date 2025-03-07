import React, { FC, useEffect, useState } from 'react';
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  // Process the data and extract the top 5 users
  const users: User[] = data?.results.slice(0, 5) ?? [];

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = users.filter((user) =>
        `${user.name.first} ${user.name.last}`
          .toLowerCase()
          .includes(lowerSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="random-users">
      {/* Stats */}
      <div className="mb-4">
        <p>Total Users: {users.length}</p>
        <p>Displayed Users: {filteredUsers.length}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          className="px-4 py-2 rounded text-black w-64"
        />
      </div>

      {/* Grid of Users */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-4 flex flex-col items-center text-center shadow"
          >
            <img
              src={user.picture.large}
              alt={`${user.name.first} ${user.name.last}`}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold mb-1">
              {user.name.first} {user.name.last}
            </h2>
            <p className="mb-1 text-gray-300">{user.email}</p>
            <p className="text-gray-400">Nationality: {user.nat}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RandomUsers;
