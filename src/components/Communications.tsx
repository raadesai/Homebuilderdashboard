export default function Communications() {
  const messages = [
    {
      id: 1,
      sender: 'Mike Johnson',
      role: 'Project Manager',
      message: 'Foundation inspection passed! We can proceed with backfilling tomorrow.',
      timestamp: '2 hours ago',
      type: 'update'
    },
    {
      id: 2,
      sender: 'Sarah Wilson',
      role: 'Homeowner',
      message: 'Great news! When do you expect to start the framing phase?',
      timestamp: '1 hour ago',
      type: 'message'
    },
    {
      id: 3,
      sender: 'Mike Johnson',
      role: 'Project Manager',
      message: 'We should start framing on Monday, March 4th. Weather looks good for next week.',
      timestamp: '45 minutes ago',
      type: 'message'
    },
    {
      id: 4,
      sender: 'System',
      role: 'Notification',
      message: 'Framing materials have been delivered to the job site.',
      timestamp: '30 minutes ago',
      type: 'notification'
    }
  ]

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'update': return '📢'
      case 'message': return '💬'
      case 'notification': return '🔔'
      default: return '💬'
    }
  }

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'update': return 'border-l-blue-500 bg-blue-50'
      case 'message': return 'border-l-green-500 bg-green-50'
      case 'notification': return 'border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Communications</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          New Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Recent Messages</h3>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`p-6 border-l-4 ${getMessageColor(message.type)}`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{getMessageIcon(message.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{message.sender}</h4>
                          <p className="text-sm text-gray-500">{message.role}</p>
                        </div>
                        <span className="text-sm text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Team</h3>
            <div className="space-y-4">
              {[
                { name: 'Mike Johnson', role: 'Project Manager', status: 'online' },
                { name: 'Sarah Wilson', role: 'Homeowner', status: 'online' },
                { name: 'Tom Builder', role: 'Lead Contractor', status: 'offline' },
                { name: 'Lisa Electric', role: 'Electrician', status: 'offline' },
              ].map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Assistant</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  "What's the typical timeline for foundation work?"
                </p>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Ask AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}