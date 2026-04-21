const steps = ['Submitted', 'ManagerApproved', 'DirectorApproved', 'Paid']

const labelMap = {
  Submitted: 'Submitted',
  ManagerApproved: 'Manager Approved',
  DirectorApproved: 'Director Approved',
  Paid: 'Paid',
}

const StatusTimeline = ({ status }) => {
  const normalizedStatus = status === 'Rejected' ? 'Submitted' : status
  const activeIndex = steps.indexOf(normalizedStatus)
  const safeIndex = activeIndex === -1 ? 0 : activeIndex
  const progressPercent = (safeIndex / (steps.length - 1)) * 100

  return (
    <div>
      <div className="relative h-2 rounded-full bg-white/10 overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const active = index <= safeIndex
          return (
            <div key={step} className="text-center">
              <div className={`mx-auto h-2.5 w-2.5 rounded-full mb-1 ${active ? 'bg-cyan-300' : 'bg-gray-600'}`} />
              <p className={`text-[11px] ${active ? 'text-white' : 'text-gray-500'}`}>
                {labelMap[step]}
              </p>
            </div>
          )
        })}
      </div>

      {status === 'Rejected' && (
        <p className="mt-3 text-xs text-red-300">This claim was rejected during the approval flow.</p>
      )}
    </div>
  )
}

export default StatusTimeline
