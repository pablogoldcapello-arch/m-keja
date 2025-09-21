// components/RoleSelector.tsx
import { Dispatch, SetStateAction } from 'react';

interface RoleSelectorProps {
  currentRole: 'tenant' | 'landlord' | 'agent' | 'service-provider';
  setCurrentRole: Dispatch<SetStateAction<'tenant' | 'landlord' | 'agent' | 'service-provider'>>;
}

export default function RoleSelector({ currentRole, setCurrentRole }: RoleSelectorProps) {
  const roles = [
    { id: 'tenant', name: 'Tenant', color: 'bg-blue-100 text-blue-800' },
    { id: 'landlord', name: 'Landlord', color: 'bg-purple-100 text-purple-800' },
    { id: 'agent', name: 'Agent', color: 'bg-green-100 text-green-800' },
    { id: 'service-provider', name: 'Service Provider', color: 'bg-yellow-100 text-yellow-800' },
  ];

  return (
    <div className="mb-8 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Switch User Role</h2>
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role.id}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              currentRole === role.id
                ? `${role.color} ring-2 ring-offset-2 ring-opacity-50`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setCurrentRole(role.id as any)}
          >
            {role.name}
          </button>
        ))}
      </div>
    </div>
  );
}