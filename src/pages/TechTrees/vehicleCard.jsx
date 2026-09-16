import { useState } from "react";
import VehicleDetailsModal from "./vehicleDetailsModal";

export default function VehicleCard({
    vehicle
}) {

    const [showDetails, setShowDetails] =
        useState(false);


    if (!vehicle) {
        return null;
    }


    function openDetails() {
        setShowDetails(true);
    }


    function closeDetails() {
        setShowDetails(false);
    }


    function handleKeyDown(event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            openDetails();
        }
    }


    return (
        <>
            <button
                type="button"
                className="vehicle-card"
                onClick={openDetails}
                onKeyDown={handleKeyDown}
            >

                {vehicle.image && (
                    <img
                        src={vehicle.image}
                        alt=""
                        className="vehicle-card-image"
                    />
                )}


                <span className="vehicle-card-name">
                    {vehicle.name}
                </span>

            </button>


            {showDetails && (
                <VehicleDetailsModal
                    vehicle={vehicle}
                    onClose={closeDetails}
                />
            )}

        </>
    );
}