import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const notify = useCallback((message, severity = "success") => {
    setState({ open: true, message, severity });
  }, []);

  const notifySuccess = useCallback(
    (message) => notify(message, "success"),
    [notify],
  );
  const notifyError = useCallback(
    (message) => notify(message, "error"),
    [notify],
  );

  const handleClose = useCallback((_event, reason) => {
    if (reason === "clickaway") return;
    setState((s) => ({ ...s, open: false }));
  }, []);

  const value = useMemo(
    () => ({ notify, notifySuccess, notifyError }),
    [notify, notifySuccess, notifyError],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={state.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return ctx;
}
