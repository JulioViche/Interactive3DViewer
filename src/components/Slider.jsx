export default function Slider({ 
    icon, 
    label, 
    value, 
    onChange, 
    min = 0.1, 
    max = 2.0, 
    step = 0.1,
}) {
    return (
        <div className="mb-3">
            <label className="form-label text-light fw-bold d-flex justify-content-between">
                <span>
                    <i className={`bi ${icon} me-2`}></i>
                    {label}
                </span>
                <span className="badge">{value.toFixed(1)}x</span>
            </label>
            <input
                type="range"
                className="form-range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}