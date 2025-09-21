// components/dashboards/TenantDashboard.tsx
/*export default function TenantDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Rent Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Balance</span>
              <span className="font-semibold">KSh 15,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date</span>
              <span className="font-semibold">May 5, 2023</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Pay Rent
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Maintenance Requests</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Leaking faucet</p>
                <p className="text-sm text-gray-500">Submitted: 2 days ago</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">In Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Broken window</p>
                <p className="text-sm text-gray-500">Submitted: 1 week ago</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Scheduled</span>
            </div>
          </div>
          <button className="mt-4 w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition">
            New Request
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Lease Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Property</span>
              <span className="font-semibold">Apartment B12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lease Start</span>
              <span className="font-semibold">Jan 1, 2023</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lease End</span>
              <span className="font-semibold">Dec 31, 2023</span>
            </div>
          </div>
          <button className="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
            View Lease Agreement
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3">April 1, 2023</td>
                <td className="px-4 py-3">KSh 15,000</td>
                <td className="px-4 py-3">M-Pesa</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">March 1, 2023</td>
                <td className="px-4 py-3">KSh 15,000</td>
                <td className="px-4 py-3">M-Pesa</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">February 1, 2023</td>
                <td className="px-4 py-3">KSh 15,000</td>
                <td className="px-4 py-3">Bank Transfer</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}*/

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Lease {
  _id: string;
  property: {
    name: string;
    location: {
      address: string;
      city: string;
    };
  };
  startDate: string;
  endDate: string;
  rentAmount: number;
}

interface Payment {
  _id: string;
  amount: number;
  date: string;
  status: string;
  method: string;
}

export default function TenantDashboard() {
  const { user } = useAuth();
  const [lease, setLease] = useState<Lease | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tenant data
    const fetchTenantData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        const leaseData: Lease = {
          _id: '1',
          property: {
            name: 'Sunset Apartments',
            location: {
              address: '123 Main St',
              city: 'Nairobi'
            }
          },
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          rentAmount: 15000
        };

        const paymentsData: Payment[] = [
          { _id: '1', amount: 15000, date: '2023-05-01', status: 'Completed', method: 'M-Pesa' },
          { _id: '2', amount: 15000, date: '2023-04-01', status: 'Completed', method: 'M-Pesa' },
          { _id: '3', amount: 15000, date: '2023-03-01', status: 'Completed', method: 'Bank Transfer' }
        ];

        setLease(leaseData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Rent Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Balance</span>
              <span className="font-semibold">KSh 15,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date</span>
              <span className="font-semibold">May 5, 2023</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Pay Rent
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Maintenance Requests</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Leaking faucet</p>
                <p className="text-sm text-gray-500">Submitted: 2 days ago</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">In Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Broken window</p>
                <p className="text-sm text-gray-500">Submitted: 1 week ago</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Scheduled</span>
            </div>
          </div>
          <button className="mt-4 w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition">
            New Request
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Lease Information</h2>
          {lease ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Property</span>
                <span className="font-semibold">{lease.property.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lease Start</span>
                <span className="font-semibold">{new Date(lease.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lease End</span>
                <span className="font-semibold">{new Date(lease.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No active lease</p>
          )}
          <button className="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
            View Lease Agreement
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">KSh {payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{payment.method}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{payment.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}