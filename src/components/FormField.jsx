export default function FormField({ 
  label, 
  icon, 
  type = 'number', 
  value, 
  onChange, 
  min = 0, 
  max = 10, 
  step = 0.1,
  options = null 
}) {
  return (
    <div className="mb-3">
      <label className="form-label text-light fw-semibold">
        <i className={`bi ${icon} me-1`}></i>
        {label}
      </label>
      {type === 'select' ? (
        <select 
          className="form-select bg-dark text-light border-secondary"
          value={value}
          onChange={onChange}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="form-control bg-dark text-light border-secondary"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
      )}
    </div>
  )
}