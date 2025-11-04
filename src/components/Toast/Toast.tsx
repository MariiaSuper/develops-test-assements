import React, { useEffect, useRef, useState } from "react";
import "./Toast.scss";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastTransition = "fade" | "slide";

export interface ToastProps {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  dismissible?: boolean;
  onClose?: () => void;
  transition?: ToastTransition;
}

const SLIDE_DURATION = 300;
const FADE_DURATION = 350;
const DEFAULT_DURATION = 3000;

export const Toast: React.FC<ToastProps> = ({
  message,
  title,
  type = "info",
  duration = DEFAULT_DURATION,
  dismissible = true,
  onClose,
  transition = "slide",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const autoDismissTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedDuration = duration !== undefined && duration <= 0 ? DEFAULT_DURATION : duration;
  const transitionDuration = transition === "fade" ? FADE_DURATION : SLIDE_DURATION;
  const hasPresentedRef = useRef(false);

  const clearTimeoutRef = (ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  };

  useEffect(() => {
    if (!hasPresentedRef.current) {
      hasPresentedRef.current = true;
      setIsVisible(true);
      return undefined;
    }

    if (isVisible) {
      setShouldRender(true);
      clearTimeoutRef(hideTimeout);

      if (dismissible && resolvedDuration > 0) {
        clearTimeoutRef(autoDismissTimeout);
        autoDismissTimeout.current = setTimeout(() => {
          setIsVisible(false);
        }, resolvedDuration);
      } else {
        clearTimeoutRef(autoDismissTimeout);
      }
    } else {
      clearTimeoutRef(autoDismissTimeout);
      clearTimeoutRef(hideTimeout);
      hideTimeout.current = setTimeout(() => {
        setShouldRender(false);
        onClose?.();
      }, transitionDuration);
    }

    return () => {
      clearTimeoutRef(autoDismissTimeout);
      clearTimeoutRef(hideTimeout);
    };
  }, [dismissible, isVisible, onClose, resolvedDuration, transitionDuration]);

  useEffect(() => {
    return () => {
      clearTimeoutRef(autoDismissTimeout);
      clearTimeoutRef(hideTimeout);
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`toast toast--${type} toast--transition-${transition} ${
        isVisible ? "toast--visible" : ""
      }`}
    >
      <div className="toast-content">
        {title && <h4 className="toast-title">{title}</h4>}
        <p className="toast-message">{message}</p>
      </div>
      {dismissible && (
        <button
          type="button"
          className="toast-close"
          aria-label="Close notification"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Toast;
