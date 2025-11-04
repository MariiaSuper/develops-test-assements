import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toast, type ToastProps } from "../components/Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  args: {
    message: "Changes saved successfully.",
    title: "Success",
    dismissible: true,
    duration: 0,
    transition: "slide",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

const Template = (args: ToastProps) => {
  const [version, setVersion] = useState(0);
  const [visible, setVisible] = useState(true);

  const showToast = () => {
    setVersion((value) => value + 1);
    setVisible(true);
  };

  return (
    <div>
      <button
        type="button"
        style={{
          position: "fixed",
          right: "1.5rem",
          bottom: "6rem",
          padding: "0.5rem 1rem",
        }}
        onClick={showToast}
      >
        Show toast
      </button>
      {visible && (
        <Toast
          key={`${version}-${args.transition ?? "slide"}`}
          {...args}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
};

export const Success: Story = {
  render: (args) => <Template {...args} />,
};

export const Warning: Story = {
  args: {
    type: "warning",
    title: "Heads up!",
    message: "Something might require your attention.",
  },
  render: (args) => <Template {...args} />,
};

export const Error: Story = {
  args: {
    type: "error",
    title: "Request failed",
    message: "We couldn't save your changes. Try again later.",
  },
  render: (args) => <Template {...args} />,
};

export const Fade: Story = {
  args: {
    transition: "fade",
    title: "Fade only",
    message: "This toast cross-fades without sliding.",
  },
  render: (args) => <Template {...args} />,
};

export const Slide: Story = {
  args: {
    transition: "slide",
    title: "Slide in",
    message: "Slides from the right when shown and exits the same way.",
  },
  render: (args) => <Template {...args} />,
};

export const Persistent: Story = {
  args: {
    title: "Pinned",
    message: "Dismissible is disabled so this toast stays visible.",
    dismissible: false,
    duration: 0,
  },
  render: (args) => <Template {...args} />,
};
