import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { sidebarData } from "../../data/TTsideBarData";

export default function TechTrees() {
  return (
    <div className="page-shell">
      <Sidebar sidebarData={sidebarData} />
      <section className="page-panel">
        <h1>
          <center>
            Tech Trees by Armen Lozone
          </center>
        </h1>
        <br />
        <center>
          <Outlet />
        </center>
      </section>
    </div>
  );
}