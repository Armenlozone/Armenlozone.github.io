import { useState } from "react";
import VehicleCard from "./vehicleCard";
import VehicleGroup from "./vehicleGroup";

export default function TechTreeRank({ rank }) {

    const [collapsed, setCollapsed] = useState(false);

    function toggleCollapsed() {
        setCollapsed(prev => !prev);
    }

    if (!rank) {
        return null;
    }

    return (
        <section
            className={
                `tech-tree-rank ${collapsed ? "collapsed" : "open"}`
            }
        >

            <div
                className="tech-tree-rank-header"
                onClick={toggleCollapsed}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleCollapsed();
                    }
                }}
                aria-label={
                    collapsed ? "Expand rank" : "Collapse rank"
                }
                aria-expanded={!collapsed}
            >

                <button
                    type="button"
                    className={
                        `tech-tree-rank-toggle ${collapsed ? "collapsed" : "open"}`
                    }
                    onClick={(event) => {
                        event.stopPropagation();
                        toggleCollapsed();
                    }}
                    aria-label={
                        collapsed
                            ? "Expand rank"
                            : "Collapse rank"
                    }
                >
                    <span className="tech-tree-rank-arrow">
                        ▼
                    </span>
                </button>

                <h2>
                    Rank {rank.rank}
                </h2>

            </div>


            {!collapsed && (

                <div className="tech-tree-scroll">

                    <div className="tech-tree-columns">

                        {rank.columns?.map((column) => (

                            <div
                                key={column.id}
                                className="tech-tree-column"
                            >

                                {(column.items || []).map(
                                    (item, index) => {

                                        /*
                                         * Empty position
                                         */
                                        if (!item) {
                                            return (
                                                <div
                                                    key={`empty-${column.id}-${index}`}
                                                    className="tech-tree-node empty-node"
                                                />
                                            );
                                        }

                                        const nextItem =
                                            column.items[index + 1];

                                        /*
                                         * Vehicle
                                         */
                                        if (
                                            item.type ===
                                            "vehicle"
                                        ) {

                                            return (
                                                <div
                                                    key={
                                                        item.vehicle?.id ||
                                                        `vehicle-${column.id}-${index}`
                                                    }
                                                    className="tech-tree-node"
                                                >

                                                    <VehicleCard
                                                        vehicle={
                                                            item.vehicle
                                                        }
                                                    />

                                                    {nextItem && (
                                                        <div className="tech-tree-arrow">
                                                            ↓
                                                        </div>
                                                    )}

                                                </div>
                                            );
                                        }


                                        /*
                                         * Group
                                         */
                                        if (
                                            item.type ===
                                            "group"
                                        ) {

                                            return (
                                                <div
                                                    key={
                                                        item.group?.id ||
                                                        `group-${column.id}-${index}`
                                                    }
                                                    className="tech-tree-node"
                                                >

                                                    <VehicleGroup
                                                        group={
                                                            item.group
                                                        }
                                                    />

                                                    {nextItem && (
                                                        <div className="tech-tree-arrow">
                                                            ↓
                                                        </div>
                                                    )}

                                                </div>
                                            );
                                        }


                                        /*
                                         * Unknown item type
                                         */
                                        return null;
                                    }
                                )}

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </section>
    );
}