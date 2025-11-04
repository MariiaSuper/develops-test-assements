import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input, type InputProps } from "../components/Input";

const meta: Meta<typeof Input> = {
  title: "Input/TextInput",
  component: Input,
  args: {
    label: "Label",
    placeholder: "Type something…",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Text: Story = {
  args: {
    helperText: "Supports helper text and validation messaging.",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    helperText: "Use the toggle to reveal the password.",
  },
};

const ClearableTemplate = (args: InputProps) => {
  const [value, setValue] = useState("Clear me");
  return (
    <Input
      {...args}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
    />
  );
};

export const Clearable: Story = {
  args: {
    clearable: true,
  },
  render: (args) => <ClearableTemplate {...args} />,
};

export const Number: Story = {
  args: {
    type: "number",
    label: "Quantity",
    helperText: "Supports native numeric inputs.",
    min: 0,
    max: 10,
    defaultValue: 3,
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
    helperText: "Invalid value provided.",
    defaultValue: "12",
  },
};

type DemoFormValues = {
  username: string;
};

const HookFormTemplate = (args: InputProps) => {
  const { control, handleSubmit, watch } = useForm<DemoFormValues>({
    defaultValues: { username: "" },
    mode: "onBlur",
  });

  const onSubmit = () => undefined;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "320px" }}
    >
      <Controller
        name="username"
        control={control}
        rules={{
          required: "Please enter a value.",
          minLength: {
            value: 3,
            message: "Use at least 3 characters.",
          },
        }}
        render={({ field, fieldState }) => (
          <Input
            {...args}
            {...field}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? "Enter at least 3 characters."}
          />
        )}
      />
      <button
        type="submit"
        style={{
          alignSelf: "flex-start",
          padding: "0.6rem 1.2rem",
          borderRadius: "0.6rem",
          border: "none",
          background: "#2563eb",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Submit
      </button>
      <span style={{ color: "#475569" }}>
        Current value: <strong>{watch("username") || "(empty)"}</strong>
      </span>
    </form>
  );
};

export const WithReactHookForm: Story = {
  args: {
    label: "Username",
    placeholder: "At least 3 characters",
  },
  render: (args) => <HookFormTemplate {...args} />,
};
