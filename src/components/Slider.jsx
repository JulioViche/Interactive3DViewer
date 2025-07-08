export default function Slider({ 
    icon, 
    label, 
    value, 
    onChange, 
    min = 0.1, 
    max = 2.0, 
    step = 0.1,
    badgeColor = 'bg-primary'
}) {
    return (
        <div className="mb-0">
            <label className="form-label text-light fw-semibold">
                <i className={`bi ${icon} me-1`}></i>
                {label}: 
                <span className={`badge ${badgeColor} ms-2`}>{value.toFixed(1)}</span>
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
            <div className="d-flex justify-content-between">
                <small className="text-muted">
                <i className="bi bi-speedometer2 me-1"></i>Slow
                </small>
                <small className="text-muted">
                Fast<i className="bi bi-lightning ms-1"></i>
                </small>
            </div>
        </div>
    )
}