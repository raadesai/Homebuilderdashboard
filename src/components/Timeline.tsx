export default function Timeline() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Timeline</h2>
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          <div className="space-y-8">
            {[
              {
                phase: 'Pre-Construction',
                date: 'Jan 15 - Feb 14',
                status: 'completed',
                description: 'Planning, permits, and site preparation completed.',
                milestones: ['Permits approved', 'Site survey completed', 'Material orders placed']
              },
              {
                phase: 'Foundation',
                date: 'Feb 15 - Mar 1',
                status: 'in_progress',
                description: 'Excavation and foundation work in progress.',
                milestones: ['Excavation complete', 'Footings poured', 'Foundation walls (75% complete)']
              },
              {
                phase: 'Framing',
                date: 'Mar 2 - Mar 23',
                status: 'upcoming',
                description: 'Structural framing and roof installation.',
                milestones: ['Floor framing', 'Wall framing', 'Roof installation']
              },
              {
                phase: 'Mechanical',
                date: 'Mar 24 - Apr 7',
                status: 'upcoming',
                description: 'Plumbing, electrical, and HVAC rough-in.',
                milestones: ['Plumbing rough-in', 'Electrical rough-in', 'HVAC installation']
              },
            ].map((phase, index) => (
              <div key={index} className="relative flex items-start space-x-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  phase.status === 'completed' ? 'bg-green-500 text-white' :
                  phase.status === 'in_progress' ? 'bg-blue-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {phase.status === 'completed' ? '✓' : 
                   phase.status === 'in_progress' ? '⚡' : '○'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{phase.phase}</h3>
                    <span className="text-sm text-gray-500">{phase.date}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{phase.description}</p>
                  
                  <div className="space-y-2">
                    {phase.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          phase.status === 'completed' ? 'bg-green-500' :
                          phase.status === 'in_progress' && idx < 2 ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}></div>
                        <span className="text-sm text-gray-700">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}