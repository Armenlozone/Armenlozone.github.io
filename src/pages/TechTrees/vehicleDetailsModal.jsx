import { createPortal } from 'react-dom';

export default function VehicleDetailsModal({
    vehicle,
    onClose
}) {
    if (!vehicle) {
        return null;
    }

    const modal = (
        <div
            className="vehicle-modal-backdrop"
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                backgroundColor: 'rgba(0,0,0,0.5)',
                // ensure clicks/hover do NOT pass through to elements behind the backdrop
                pointerEvents: 'auto'
            }}
            onMouseDown={(event) => {
                // only close when clicking the backdrop itself (not the modal content)
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="vehicle-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="vehicle-modal-title"
                style={{ pointerEvents: 'auto' }}
            >

                <header className="vehicle-modal-header">

                    <h2 id="vehicle-modal-title">
                        {vehicle.name}
                    </h2>

                    <button
                        type="button"
                        className="vehicle-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </header>


                <div className="vehicle-modal-content">

                    {vehicle.image && (
                        <div className="vehicle-modal-image-wrapper">

                            <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                className="vehicle-modal-image"
                            />

                        </div>
                    )}


                    {vehicle.description && (
                        <div className="vehicle-modal-description">

                            <h3>
                                Description
                            </h3>

                            <p>
                                {vehicle.description}
                            </p>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );

    // Render modal into document.body so it's not affected by ancestor transforms/styles
    if (typeof document !== 'undefined') {
        return createPortal(modal, document.body);
    }

    return null;
}
