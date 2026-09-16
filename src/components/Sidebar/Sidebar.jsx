import { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Sidebar.css";

export default function Sidebar({ sidebarData }) {
    const [sidebarPinned, setSidebarPinned] = useState(false);
    const [sidebarHovered, setSidebarHovered] = useState(false);
    const [search, setSearch] = useState("");
    const [pinnedSections, setPinnedSections] = useState({});
    const [hoveredSection, setHoveredSection] = useState(null);

    const sidebarExpanded = sidebarPinned || sidebarHovered;

    return (
        <aside
            className={`sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}
            onMouseEnter={() => setSidebarHovered(true)}
            onMouseLeave={() => setSidebarHovered(false)}
        >
            <div className="sidebar-header">
                <button
                    className="collapse-btn"
                    onClick={() => setSidebarPinned(prev => !prev)}
                >
                    🖈
                </button>

                {sidebarExpanded && (
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                )}
            </div>

            {sidebarData.map(section => {
                const expanded =
                    pinnedSections[section.id] ||
                    hoveredSection === section.id;

                return (
                    <div
                        className="sidebar-section"
                        onMouseLeave={() => setHoveredSection(null)}
                        key={section.id}
                    >
                        <div className="section-title-row">
                            <button
                                className="section-title"
                                onClick={() =>
                                    setPinnedSections(prev => ({
                                        ...prev,
                                        [section.id]: !prev[section.id]
                                    }))
                                }
                            >
                                <img
                                    src={section.icon}
                                    alt=""
                                    className="section-icon"
                                    onError={event =>
                                        event.currentTarget.classList.add("image-load-error")
                                    }
                                />

                                {sidebarExpanded && <span>{section.title}</span>}
                            </button>

                            {sidebarExpanded && (
                                <button
                                    className={`section-hover-trigger${expanded ? " expanded" : ""}`}
                                    aria-label={`${expanded ? "Close" : "Open"} ${section.title}`}
                                    onMouseEnter={() => setHoveredSection(section.id)}
                                >
                                    &#8250;
                                </button>
                            )}
                        </div>

                        {sidebarExpanded && expanded && (
                            <ul>
                                {section.children
                                    .filter(item =>
                                        item.title
                                            .toLowerCase()
                                            .includes(search.toLowerCase())
                                    )
                                    .map(item => (
                                        <li key={item.id}>
                                            <NavLink
                                                to={item.link}
                                                className={({ isActive }) =>
                                                    isActive ? "active" : ""
                                                }
                                            >
                                                <img
                                                    src={item.icon}
                                                    className="country-icon"
                                                    alt=""
                                                    onError={event =>
                                                        event.currentTarget.classList.add("image-load-error")
                                                    }
                                                />
                                                <span>{item.title}</span>
                                            </NavLink>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}