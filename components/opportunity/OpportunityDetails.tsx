'use client'

function Field({ label, value }: any) {
  if (!value) return null

  return (
    <p>
      <span className="font-semibold">{label}:</span> {value}
    </p>
  )
}

export default function OpportunityDetails({ item }: any) {
  const d = item.data || {}

  return (
    <div className="space-y-2 mt-4 text-sm">

      {/* JOB */}
      {item.type === 'job' && (
        <>
          <Field label="Company" value={d.company} />
          <Field label="Role" value={d.role} />
          <Field label="Salary" value={d.salary} />
          <Field label="Experience" value={d.experience} />
          <Field label="Skills" value={d.skills} />
          <Field label="Work Model" value={d.work_model} />
          <Field label="Employment Type" value={d.employment_type} />
          <Field label="Benefits" value={d.benefits} />

          {d.apply_link && (
            <a href={d.apply_link} target="_blank" className="text-cyan-600 underline">
              Apply Here
            </a>
          )}
        </>
      )}

      {/* EVENT */}
      {item.type === 'event' && (
        <>
          <Field label="Venue" value={d.venue} />
          <Field label="Date" value={d.date} />
          <Field label="Organizer" value={d.organizer} />
          <Field label="Category" value={d.category} />
          <Field label="Speakers" value={d.speakers} />
        </>
      )}

      {/* TRAINING */}
      {item.type === 'training' && (
        <>
          <Field label="Duration" value={d.duration} />
          <Field label="Certificate" value={d.certificate} />
          <Field label="Date" value={d.date} />
          <Field label="Prerequisites" value={d.prerequisites} />
          <Field label="Format" value={d.format} />
        </>
      )}

      {/* PLACE */}
      {item.type === 'place' && (
        <>
          <Field label="Name" value={d.name} />
          <Field label="Type" value={d.type} />
          <Field label="Address" value={d.address} />
          <Field label="Capacity" value={d.capacity} />
          <Field label="Price" value={d.price} />
          <Field label="Amenities" value={d.amenities} />
          <Field label="Working Hours" value={d.working_hours} />
          <Field label="Rules" value={d.rules} />
        </>
      )}

      {/* MARKETPLACE */}
      {item.type === 'marketplace' && (
        <>
          <Field label="Stage Name" value={d.stage_name} />
          <Field label="Real Name" value={d.real_name} />
          <Field label="Skills" value={d.skills} />
          <Field label="Experience" value={d.experience} />
          <Field label="Price" value={d.price} />

          {d.portfolio && (
            <a href={d.portfolio} target="_blank" className="text-cyan-600 underline">
              View Portfolio
            </a>
          )}
        </>
      )}

    </div>
  )
}