// components/tabs/PaymentsTab.tsx
interface PaymentsTabProps {
  role: string;
}

export default function PaymentsTab({ role }: PaymentsTabProps) {
  const payments = [
    { id: 1, date: "2023-05-15", amount: 15000, property: "Sunset Apartments", status: "Completed" },
    { id: 2, date: "2023-04-15", amount: 15000, property: "Sunset Apartments", status: "Completed" },
    { id: 3, date: "2023-03-15", amount: 15000, property: "Sunset Apartments", status: "Completed" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payments History</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Request Payment
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {payments.map(payment => (
            <div key={payment.id} className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Rent Payment</p>
                <p className="text-sm text-gray-500">{payment.property} - {payment.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">KSh {payment.amount.toLocaleString()}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  payment.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}