// components/dashboards/LandlordDashboard.tsx
export default function LandlordDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Portfolio Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Properties</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Occupancy Rate</span>
              <span className="font-semibold">87.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold">KSh 120,000</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Rent Collection</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Collected This Month</span>
              <span className="font-semibold">KSh 105,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold">KSh 15,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Arrears</span>
              <span className="font-semibold">KSh 0</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            View Financial Reports
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Maintenance Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Pending Requests</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">In Progress</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">2</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Completed This Month</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">5</span>
            </div>
          </div>
          <button className="mt-4 w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition">
            Manage Requests
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden hover:shadow-md transition">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold">Property {item}</h3>
                <p className="text-sm text-gray-600">2 Bedroom Apartment</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold">KSh 15,000</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Occupied</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}