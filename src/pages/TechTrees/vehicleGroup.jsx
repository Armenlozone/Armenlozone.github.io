import { useState } from "react";
import VehicleCard from "./vehicleCard";

export default function VehicleGroup({ group }) {

    const [collapsed, setCollapsed] = useState(false);

    const vehicles = group?.vehicles || [];

    return (
        <div className="vehicle-group">

            <button
                type="button"
                className={`vehicle-group-toggle ${collapsed ? "collapsed" : "open"}`}
                onClick={() => setCollapsed(prev => !prev)}
            >
                <span className="vehicle-group-arrow">
                    ▼
                </span>

                <span className="vehicle-group-title">
                    {group.title}
                </span>
            </button>


            {!collapsed && (
                <div className="vehicle-group-content">

                    {vehicles.map((vehicle, index) => (

                        <div
                            key={
                                vehicle.id ||
                                `group-vehicle-${index}`
                            }
                            className="vehicle-group-node"
                        >

                            <VehicleCard
                                vehicle={vehicle}
                            />

                            {index < vehicles.length - 1 && (
                                <div className="tech-tree-arrow">
                                    ↓
                                </div>
                            )}

                        </div>

                    ))}

                    {vehicles.length === 0 && (
                        <div className="vehicle-group-empty">
                            Empty group
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}