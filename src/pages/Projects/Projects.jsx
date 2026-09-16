import Sidebar from "../../components/Sidebar/Sidebar";
import { sidebarData } from "../../data/PsideBarData";

export default function Projects() {
  return (
    <div className="page-shell">
      <Sidebar sidebarData={sidebarData} />
      <section className="page-panel">
        <h1>Projects</h1>
        <p>Projects and 3D models will be displayed here.</p>
      </section>
    </div>
  );
}