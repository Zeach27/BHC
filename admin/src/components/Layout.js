import React from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

function Layout({ title, subtitle, actions, children }) {
  return (
    <div className="admin">
      <Sidebar />
      <main className="admin__content">
        <TopNavbar />
        <div className="admin__body">
          <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 className="page-header__title">{title}</h1>
              {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header__actions">{actions}</div>}
          </header>
          <section>{children}</section>
        </div>
      </main>
    </div>
  );
}

export default Layout;
