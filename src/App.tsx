import React, { useState } from "react";
import { Input, SidebarMenu, Toast } from "./components";
import type { SidebarMenuItem } from "./components";
import "./App.scss";

const sidebarItems: SidebarMenuItem[] = [
  { id: "dashboard", label: "Dashboard" },
  {
    id: "projects",
    label: "Projects",
    children: [
      { id: "current", label: "Current" },
      { id: "upcoming", label: "Upcoming" },
      {
        id: "archive",
        label: "Archive",
        children: [
          { id: "2025", label: "2025" },
          { id: "2024", label: "2024" },
        ],
      },
    ],
  },
  { id: "settings", label: "Settings" },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastInstance, setToastInstance] = useState(0);
  const [toastActive, setToastActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const triggerToast = () => {
    setToastInstance((value) => value + 1);
    setToastActive(true);
  };

  return (
    <div className="app-shell">
      <SidebarMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Example workspace"
        items={sidebarItems}
        defaultExpandedIds={["projects"]}
      />

      <main className="app-demo">
        <header className="app-header">
          <div>
            <h1>Component Library Playground</h1>
            <p>
              Interact with the core components implemented for the assessment.
              For additional configurations, run <code>npm run storybook</code>.
            </p>
          </div>
          <button type="button" onClick={() => setSidebarOpen(true)}>
            Open sidebar
          </button>
        </header>

        <section className="app-card">
          <h2>Sign-in example</h2>
          <div className="app-inputs">
            <Input
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              clearable
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              helperText="Use at least 8 characters."
            />
          </div>
          <button
            type="button"
            className="app-submit"
            onClick={triggerToast}
          >
            Submit
          </button>
        </section>
      </main>

      {toastActive && (
        <Toast
          key={toastInstance}
          title="Signed in"
          message="Demo action triggered successfully."
          type="success"
          duration={3000}
          onClose={() => setToastActive(false)}
        />
      )}
    </div>
  );
}

export default App;
