import React, { FC, useEffect, useMemo, useState } from 'react';
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
  const [selectedNationality, setSelectedNationality] = useState<string>('All');

  // Fetch users via React Query
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
  const users: User[] = data?.results.slice(0, 20) ?? [];

  // Compute unique nationalities (e.g., ['AU', 'BR', 'CA', ...])
  // Only runs again if `users` changes
  const nationalities = useMemo(() => {
    const uniqueNats = new Set(users.map((user) => user.nat));
    return Array.from(uniqueNats);
  }, [users]);

  // Filter logic: name + nationality
  useEffect(() => {
    // Start with all users
    let updated = [...users];

    // Filter by search term (first + last name)
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      updated = updated.filter((user) =>
        `${user.name.first} ${user.name.last}`
          .toLowerCase()
          .includes(lowerSearch)
      );
    }

    // Filter by selected nationality
    if (selectedNationality !== 'All') {
      updated = updated.filter((user) => user.nat === selectedNationality);
    }

    setFilteredUsers(updated);
  }, [searchTerm, selectedNationality, users]);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="random-users min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">User Directory</h1>

      {/* Stats */}
      <div className="mb-4">
        <p>Total Users: {users.length}</p>
        <p>Displayed Users: {filteredUsers.length}</p>
      </div>

      {/* Search + Nationality Filter */}
      <div className="mb-6 flex items-center gap-4">
        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          className="px-4 py-2 rounded text-black w-64"
        />

        {/* Nationality Dropdown */}
        <select
          value={selectedNationality}
          onChange={(e) => setSelectedNationality(e.target.value)}
          className="px-4 py-2 rounded text-black"
        >
          <option value="All">All</option>
          {nationalities.map((nat) => (
            <option key={nat} value={nat}>
              {nat}
            </option>
          ))}
        </select>
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
