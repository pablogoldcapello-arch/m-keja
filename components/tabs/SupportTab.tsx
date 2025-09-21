// components/tabs/SupportTab.tsx
interface SupportTabProps {
  role: string;
}

export default function SupportTab({ role }: SupportTabProps) {
  const tickets = [
    { id: 1, subject: "Leaking faucet in kitchen", status: "In Progress", date: "2023-05-10" },
    { id: 2, subject: "AC not cooling properly", status: "Resolved", date: "2023-04-28" },
    { id: 3, subject: "Internet connectivity issues", status: "Open", date: "2023-05-12" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Support Center</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Create New Ticket</h3>
          <p className="text-gray-600 text-sm mb-4">Submit a new support request for assistance</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            New Support Ticket
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Emergency Contact</h3>
          <p className="text-gray-600 text-sm mb-4">For urgent issues requiring immediate attention</p>
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Call Emergency Line
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">FAQ & Resources</h3>
          <p className="text-gray-600 text-sm mb-4">Find answers to common questions and guides</p>
          <button className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50">
            View Knowledge Base
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Your Support Tickets</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tickets.map(ticket => (
            <div key={ticket.id} className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{ticket.subject}</p>
                  <p className="text-sm text-gray-500">Opened on {ticket.date}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ticket.status === 'Resolved' 
                    ? 'bg-green-100 text-green-800' 
                    : ticket.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}