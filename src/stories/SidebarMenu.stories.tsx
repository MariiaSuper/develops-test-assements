import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  SidebarMenu,
  type SidebarMenuItem,
  type SidebarMenuProps,
} from "../components/SidebarMenu";

const singleLevelItems: SidebarMenuItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "inbox", label: "Inbox" },
  { id: "settings", label: "Settings" },
];

const nestedItems: SidebarMenuItem[] = [
  {
    id: "analytics",
    label: "Analytics",
    children: [
      { id: "realtime", label: "Realtime overview" },
      { id: "audience", label: "Audience insights" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    children: [
      {
        id: "current",
        label: "Current",
        children: [
          { id: "alpha", label: "Alpha team" },
          { id: "beta", label: "Beta team" },
        ],
      },
      { id: "archive", label: "Archive" },
    ],
  },
  { id: "settings", label: "Account settings" },
];

const meta: Meta<typeof SidebarMenu> = {
  title: "Feedback/SidebarMenu",
  component: SidebarMenu,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "Workspace",
    onClose: () => undefined,
    open: true,
    items: singleLevelItems,
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SidebarMenu>;

export const SingleLevel: Story = {
  tags: ["!autodocs"],
};

export const NestedMenus: Story = {
  args: {
    items: nestedItems,
    defaultExpandedIds: ["analytics", "projects", "current"],
  },
  tags: ["!autodocs"],
};

const InteractiveTemplate = (args: SidebarMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <button
        type="button"
        style={{
          padding: "0.6rem 1rem",
          fontSize: "1rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          cursor: "pointer",
        }}
        onClick={() => setOpen(true)}
      >
        Open menu
      </button>
      <SidebarMenu
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        defaultExpandedIds={["projects"]}
      />
    </div>
  );
};

export const Interactive: Story = {
  args: {
    items: nestedItems,
    open: false,
  },
  render: (args) => <InteractiveTemplate {...args} />,
};
