import React from "react";

export default function PageHeader({ title, badge, primaryAction, secondaryAction }) {
  return (
    <section className="page-header">
      <div className="page-header__main">
        <div>
          <h2 className="page-header__title">{title}</h2>
          {badge && <span className="page-header__badge">{badge}</span>}
        </div>

        <div className="page-header__actions">
          {secondaryAction && (
            <button
              className="button button--secondary"
              type="button"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              className="button button--primary"
              type="button"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
