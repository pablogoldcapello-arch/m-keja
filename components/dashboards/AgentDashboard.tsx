// components/dashboards/AgentDashboard.tsx
export default function AgentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Portfolio Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Managed Properties</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Landlords</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vacancy Rate</span>
              <span className="font-semibold">8.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Commission Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold">KSh 36,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Month</span>
              <span className="font-semibold">KSh 32,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">YTD</span>
              <span className="font-semibold">KSh 145,800</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            View Commission Reports
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tasks & Reminders</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lease Renewals</p>
                <p className="text-sm text-gray-500">3 renewals due next week</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Urgent</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Property Viewings</p>
                <p className="text-sm text-gray-500">5 scheduled today</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Today</span>
            </div>
          </div>
          <button className="mt-4 w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition">
            View All Tasks
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3">John Doe</td>
                <td className="px-4 py-3">Apartment B12</td>
                <td className="px-4 py-3">April 15, 2023</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Under Review</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Review</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Jane Smith</td>
                <td className="px-4 py-3">House C5</td>
                <td className="px-4 py-3">April 14, 2023</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Documents Requested</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Follow Up</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Michael Johnson</td>
                <td className="px-4 py-3">Studio A3</td>
                <td className="px-4 py-3">April 12, 2023</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Approved</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Send Lease</button>
                </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}