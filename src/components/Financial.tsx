export default function Financial() {
  const budgetItems = [
    { category: 'Foundation', budgeted: 45000, spent: 42000, status: 'on_track' },
    { category: 'Framing', budgeted: 35000, spent: 0, status: 'pending' },
    { category: 'Electrical', budgeted: 18000, spent: 0, status: 'pending' },
    { category: 'Plumbing', budgeted: 15000, spent: 0, status: 'pending' },
    { category: 'HVAC', budgeted: 22000, spent: 0, status: 'pending' },
  ]

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0)
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0)
  const percentageUsed = (totalSpent / totalBudget) * 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Budget</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${totalBudget.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Amount Spent</h3>
          <p className="text-2xl font-bold text-orange-600">
            ${totalSpent.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Remaining</h3>
          <p className="text-2xl font-bold text-green-600">
            ${(totalBudget - totalSpent).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {percentageUsed.toFixed(1)}% used
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-orange-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentageUsed}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Budget Breakdown</h3>
        </div>
        <div className="divide-y">
          {budgetItems.map((item, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{item.category}</h4>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${item.spent.toLocaleString()} / ${item.budgeted.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.spent > 0 ? 
                      `${((item.spent / item.budgeted) * 100).toFixed(1)}% used` : 
                      'Not started'
                    }
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.spent / item.budgeted > 0.9 ? 'bg-red-500' :
                    item.spent / item.budgeted > 0.7 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(item.spent / item.budgeted) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y">
          {[
            { description: 'Concrete delivery - Foundation', amount: -15000, date: '2024-02-28', type: 'expense' },
            { description: 'Foundation contractor payment', amount: -27000, date: '2024-02-25', type: 'payment' },
            { description: 'Budget adjustment - Additional rebar', amount: -500, date: '2024-02-20', type: 'change_order' },
          ].map((transaction, index) => (
            <div key={index} className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 capitalize">{transaction.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}