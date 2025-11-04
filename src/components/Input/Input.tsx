import React, { useEffect, useId, useMemo, useState } from "react";
import { EyeClosedIcon, EyeOpenIcon } from "../../icons";
import "./Input.scss";

export type InputType = "text" | "password" | "email" | "number";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  error?: boolean;
  clearable?: boolean;
  type?: InputType;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  id,
  label,
  helperText,
  error = false,
  className,
  type = "text",
  clearable = false,
  onClear,
  value,
  defaultValue,
  onChange,
  ...rest
}, ref) => {
  const initialValue = useMemo(() => {
    if (value !== undefined && value !== null) {
      return String(value);
    }
    if (defaultValue !== undefined && defaultValue !== null) {
      return String(defaultValue);
    }
    return "";
  }, [defaultValue, value]);

  const [internalValue, setInternalValue] = useState<string>(initialValue);
  const [showPassword, setShowPassword] = useState(false);

  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isControlled = useMemo(() => value !== undefined, [value]);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value === undefined || value === null ? "" : String(value));
    }
  }, [isControlled, value]);

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(initialValue);
    }
  }, [initialValue, isControlled]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }

    const syntheticEvent = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    onClear?.();
  };

  const effectiveType =
    type === "password" && showPassword ? "text" : type ?? "text";

  const hasControls =
    type === "password" ||
    (clearable &&
      ((isControlled ? value : internalValue) !== undefined &&
        (isControlled ? value : internalValue) !== ""));

  const wrapperClasses = [
    "input-wrapper",
    error ? "input-wrapper--error" : "",
    hasControls ? "input-wrapper--with-controls" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const helperClasses = ["input-helper", error ? "input-helper--error" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={["input-field", className].filter(Boolean).join(" ")}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={wrapperClasses}>
        <input
          id={inputId}
          className="input-element"
          type={effectiveType}
          value={isControlled ? (value as string) : internalValue}
          onChange={handleChange}
          ref={ref}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            className="input-control-button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeClosedIcon className="input-control-icon" />
            ) : (
              <EyeOpenIcon className="input-control-icon" />
            )}
            <span className="input-sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </button>
        )}
        {clearable && (isControlled ? value : internalValue) && (
          <button
            type="button"
            className="input-control-button"
            aria-label="Clear input"
            onClick={handleClear}
          >
            ×
          </button>
        )}
      </div>
      {helperText && <p className={helperClasses}>{helperText}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
