import React, { useEffect, useState } from "react";
import "./SidebarMenu.scss";

export interface SidebarMenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  children?: SidebarMenuItem[];
}

export interface SidebarMenuProps {
  open: boolean;
  title?: string;
  items: SidebarMenuItem[];
  defaultExpandedIds?: string[];
  onClose: () => void;
}

const ANIMATION_DURATION = 250;

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  open,
  title = "Menu",
  items,
  defaultExpandedIds = [],
  onClose,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    setExpandedIds(new Set(defaultExpandedIds));
  }, [defaultExpandedIds]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(Array.from(prev));
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderItems = (menuItems: SidebarMenuItem[], level = 0) => {
    return (
      <ul className="sidebar-menu-list">
        {menuItems.map((item) => {
          const childItems = Array.isArray(item.children) ? item.children : [];
          const isExpanded = expandedIds.has(item.id);
          const hasChildren = childItems.length > 0;

          return (
            <li key={item.id}>
              <div className={`sidebar-menu-item sidebar-menu-item--level-${level}`}>
                {item.href ? (
                  <a
                    className="sidebar-menu-button"
                    href={item.href}
                    onClick={(event) => {
                      item.onClick?.();
                      if (hasChildren) {
                        event.preventDefault();
                        toggleItem(item.id);
                      } else {
                        onClose();
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="sidebar-menu-button"
                    onClick={() => {
                      item.onClick?.();
                      if (hasChildren) {
                        toggleItem(item.id);
                      } else {
                        onClose();
                      }
                    }}
                  >
                    {item.label}
                  </button>
                )}
                {hasChildren && (
                  <button
                    type="button"
                    className={`sidebar-menu-toggle ${isExpanded ? "is-open" : ""}`}
                    aria-label={isExpanded ? "Collapse section" : "Expand section"}
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="sidebar-menu-toggle-icon">{isExpanded ? "−" : "+"}</span>
                  </button>
                )}
              </div>
              {hasChildren && isExpanded && (
                <div className="sidebar-menu-children">{renderItems(childItems, level + 1)}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`sidebar-menu-overlay ${open ? "is-open" : ""}`}>
      <div className={`sidebar-menu-panel ${open ? "is-open" : ""}`}>
        <header className="sidebar-menu-header">
          <h2 className="sidebar-menu-title">{title}</h2>
          <button
            type="button"
            className="sidebar-menu-close"
            aria-label="Close menu"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <nav className="sidebar-menu-body">{renderItems(items)}</nav>
      </div>
      <button
        type="button"
        className="sidebar-menu-backdrop"
        aria-label="Close menu"
        onClick={onClose}
      />
    </div>
  );
};

export default SidebarMenu;
