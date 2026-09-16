import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { sidebarData } from "../../data/AsideBarData";

export default function Articles() {
  return (
    <div className="page-shell">
      <Sidebar sidebarData={sidebarData} />
      <section className="page-panel">
        <h1>
          <center>
            Articles by Armen Lozone
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