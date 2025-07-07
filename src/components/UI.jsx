import React, { useState, useEffect } from 'react';

export const UI = () => {
    // Estados para la UI
    const [selectedAnimation, setSelectedAnimation] = useState('circular');
    const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Estados para el drag and drop
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });

    const animations = [
        { value: 'circular', label: 'Circular', description: 'Movimiento circular uniforme alrededor del objeto' },
        { value: 'pendulum', label: 'Péndulo', description: 'Oscilación pendular' },
        { value: 'spiral', label: 'Espiral', description: 'Movimiento en espiral ascendente' },
        { value: 'eccentric', label: 'Excéntrico', description: 'Órbita excéntrica irregular' },
        { value: 'tornado', label: 'Tornado', description: 'Espiral descendente tipo tornado' },
        { value: 'vibration', label: 'Vibración', description: 'Movimiento vibratorio rápido' }
    ];

    // Handlers para drag and drop
    const handleMouseDown = (e) => {
        // Solo permitir drag desde el header
        if (e.target.closest('.drag-handle')) {
            setIsDragging(true);
            setDragStartPosition({ x: e.clientX, y: e.clientY });
            const rect = e.currentTarget.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            e.preventDefault();
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // Limitar dentro de la ventana
            const maxX = window.innerWidth - 300;
            const maxY = window.innerHeight - 100;
            
            setPosition({
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY))
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Event listeners para mouse
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.userSelect = '';
            };
        }
    }, [isDragging, dragOffset]);

    // Handler para cambio de animación
    const handleAnimationChange = (event) => {
        const animation = event.target.value;
        setSelectedAnimation(animation);
        
        if (window.rendererControls && isAnimationEnabled) {
            window.rendererControls.changeAnimation(animation);
        }
    };

    // Handler para toggle de animación
    const toggleAnimation = () => {
        const newState = !isAnimationEnabled;
        setIsAnimationEnabled(newState);
        
        if (window.rendererControls) {
            if (newState) {
                window.rendererControls.changeAnimation(selectedAnimation);
            } else {
                window.rendererControls.changeAnimation('manual');
            }
        }
    };

    // Handler para cambio de velocidad
    const handleSpeedChange = (event) => {
        const speed = parseFloat(event.target.value);
        setAnimationSpeed(speed);
        
        if (window.rendererControls) {
            window.rendererControls.changeAnimationSpeed(speed * 0.05);
        }
    };

    // Handler para toggle de colapsar
    const handleHeaderClick = (e) => {
        // Calcular la distancia desde el mouseDown inicial
        const distance = Math.sqrt(
            Math.pow(e.clientX - dragStartPosition.x, 2) + 
            Math.pow(e.clientY - dragStartPosition.y, 2)
        );
        
        // Solo colapsar si fue un click (distancia mínima) y no un drag
        if (distance < 5) {
            setIsCollapsed(!isCollapsed);
        }
    };

    const currentAnimationInfo = animations.find(anim => anim.value === selectedAnimation);

    return (
        <div 
            className="position-fixed" 
            style={{ 
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 1050,
                cursor: isDragging ? 'grabbing' : 'default'
            }}
            onMouseDown={handleMouseDown}
        >
            <div 
                className="card bg-dark text-white border-secondary" 
                style={{ 
                    maxWidth: '300px',
                    transition: isDragging ? 'none' : 'all 0.3s ease'
                }}
            >
                {/* Header movible */}
                <div 
                    className="card-header bg-dark border-secondary d-flex justify-content-between align-items-center drag-handle"
                    style={{ 
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onClick={handleHeaderClick}
                >
                    <h6 className="card-title mb-0 d-flex align-items-center">
                        <i className="bi bi-grip-vertical me-2 text-muted"></i>
                        Control de Animaciones
                    </h6>
                    <button 
                        className="btn btn-sm btn-outline-light border-0"
                        type="button"
                    >
                        <i className={`bi bi-chevron-${isCollapsed ? 'down' : 'up'}`}></i>
                    </button>
                </div>
                
                {/* Contenido colapsable */}
                <div 
                    className={`collapse ${isCollapsed ? '' : 'show'}`}
                    style={{ 
                        transition: 'height 0.3s ease',
                    }}
                >
                    <div className="card-body">
                        {/* Switch para habilitar/deshabilitar animaciones */}
                        <div className="form-check form-switch mb-3">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={isAnimationEnabled}
                                onChange={toggleAnimation}
                            />
                            <label className="form-check-label text-white">
                                {isAnimationEnabled ? 'Animación Automática' : 'Control Manual'}
                            </label>
                        </div>
                        
                        {/* Selector de animación */}
                        <div className="mb-3">
                            <label className="form-label fw-bold text-white">Tipo de Animación:</label>
                            <select 
                                className="form-select bg-dark text-white border-secondary"
                                value={selectedAnimation}
                                onChange={handleAnimationChange}
                                disabled={!isAnimationEnabled}
                            >
                                {animations.map(anim => (
                                    <option key={anim.value} value={anim.value} className="bg-dark text-white">
                                        {anim.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Control de velocidad */}
                        <div className="mb-3">
                            <label className="form-label fw-bold text-white">Velocidad: {animationSpeed}x</label>
                            <input 
                                type="range" 
                                className="form-range"
                                min="0.1" 
                                max="3" 
                                step="0.1"
                                value={animationSpeed}
                                onChange={handleSpeedChange}
                                disabled={!isAnimationEnabled}
                            />
                        </div>

                        {/* Información sobre la animación seleccionada */}
                        <div className="alert alert-secondary mb-0">
                            <small className="fw-bold">
                                {isAnimationEnabled ? 'Descripción:' : 'Modo Manual Activo'}
                            </small>
                            <br />
                            <small>
                                {isAnimationEnabled 
                                    ? currentAnimationInfo?.description 
                                    : 'Arrastra el mouse para rotar y usa la rueda para acercar/alejar'
                                }
                            </small>
                        </div>
                    </div>
                </div>

                {/* Mini indicador cuando está colapsado */}
                {isCollapsed && (
                    <div className="card-footer bg-dark border-secondary py-1">
                        <small className="text-muted d-flex justify-content-between">
                            <span>{isAnimationEnabled ? currentAnimationInfo?.label : 'Manual'}</span>
                            <span>{isAnimationEnabled ? `${animationSpeed}x` : ''}</span>
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
};