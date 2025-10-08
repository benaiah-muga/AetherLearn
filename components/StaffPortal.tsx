import React, { useState } from 'react';
import { UsersIcon } from './icons/UsersIcon';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UserModal } from './UserModal';
import { ConfirmModal } from './ConfirmModal';
import { SearchIcon } from './icons/SearchIcon';

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

const mockUsers: User[] = [
    { id: 'usr_1', name: 'Alex Ryder', email: 'alex.ryder@email.com', joinDate: '2023-10-26' },
    { id: 'usr_2', name: 'Casey Jordan', email: 'casey.jordan@email.com', joinDate: '2023-11-15' },
    { id: 'usr_3', name: 'Morgan Lee', email: 'morgan.lee@email.com', joinDate: '2024-01-02' },
    { id: 'usr_4', name: 'Taylor Swift', email: 'taylor.swift@email.com', joinDate: '2024-02-20' },
];


export const StaffPortal: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const handleOpenAddModal = () => {
        setUserToEdit(null);
        setIsUserModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setUserToEdit(user);
        setIsUserModalOpen(true);
    };

    const handleOpenDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsConfirmModalOpen(true);
    };

    const handleSaveUser = (user: User) => {
        if (userToEdit) {
            setUsers(users.map(u => u.id === user.id ? user : u));
        } else {
            const newUser = { ...user, id: `usr_${new Date().getTime()}`, joinDate: new Date().toISOString().split('T')[0] };
            setUsers([newUser, ...users]);
        }
        setIsUserModalOpen(false);
        setUserToEdit(null);
    };

    const handleDeleteUser = () => {
        if (selectedUser) {
            setUsers(users.filter(u => u.id !== selectedUser.id));
        }
        setIsConfirmModalOpen(false);
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-4">
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
      </div>
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
        <div className="p-4 sm:p-6 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center">
                <UsersIcon className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-xl font-semibold text-slate-100">All Users</h3>
            </div>
            <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-colors"
            >
                <PlusIcon className="w-5 h-5 mr-1.5" />
                Add User
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">User ID</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Join Date</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                            <td className="px-6 py-4 font-mono text-xs">{user.id}</td>
                            <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.joinDate}</td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button onClick={() => handleOpenEditModal(user)} className="p-2 text-slate-400 hover:text-amber-400" aria-label="Edit user">
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleOpenDeleteModal(user)} className="p-2 text-slate-400 hover:text-red-400" aria-label="Delete user">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <p>{searchQuery ? 'No users match your search.' : 'No users found.'}</p>
                </div>
            )}
        </div>
      </div>
    </div>

    {isUserModalOpen && (
        <UserModal
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            onSave={handleSaveUser}
            user={userToEdit}
        />
    )}
    {isConfirmModalOpen && selectedUser && (
        <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={handleDeleteUser}
            title="Delete User"
            message={`Are you sure you want to permanently delete the user "${selectedUser.name}"? This action cannot be undone.`}
        />
    )}
    </>
  );
};
