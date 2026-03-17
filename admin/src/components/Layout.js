import React from "react";
import Sidebar from "./Sidebar";

function Layout({ title, subtitle, children }) {
  return (
    <div className="admin">
      <Sidebar />
      <main className="admin__content">
        <header className="admin__header">
          <div>
            <h1 className="admin__title">{title}</h1>
            {subtitle && <p className="admin__subtitle">{subtitle}</p>}
          </div>
        </header>
        <section className="admin__body">{children}</section>
      </main>
    </div>
  );
}

export default Layout;
