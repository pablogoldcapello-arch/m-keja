// components/dashboards/ServiceProviderDashboard.tsx
export default function ServiceProviderDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Service Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Jobs</span>
              <span className="font-semibold">4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed This Month</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Rating</span>
              <span className="font-semibold">4.7 ★</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Earnings</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Payments</span>
              <span className="font-semibold">KSh 8,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Earned This Month</span>
              <span className="font-semibold">KSh 32,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total YTD</span>
              <span className="font-semibold">KSh 145,000</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Payment History
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Schedule</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Today's Appointments</p>
                <p className="text-sm text-gray-500">3 scheduled jobs</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tomorrow</p>
                <p className="text-sm text-gray-500">2 scheduled jobs</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">This Week</p>
                <p className="text-sm text-gray-500">11 total jobs</p>
              </div>
            </div>
          </div>
          <button className="mt-4 w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition">
            View Calendar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Current Jobs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3">#J-2837</td>
                <td className="px-4 py-3">Apartment B12</td>
                <td className="px-4 py-3">Plumbing - Leaking faucet</td>
                <td className="px-4 py-3">Today, 10:00 AM</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Scheduled</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Details</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">#J-2836</td>
                <td className="px-4 py-3">House C5</td>
                <td className="px-4 py-3">Electrical - Power outage</td>
                <td className="px-4 py-3">Today, 2:00 PM</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">In Progress</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Update</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">#J-2834</td>
                <td className="px-4 py-3">Studio A3</td>
                <td className="px-4 py-3">HVAC - AC not cooling</td>
                <td className="px-4 py-3">April 18, 2023</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Invoice</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}