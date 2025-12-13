import { createContext,  ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(undefined);

const defaultToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export default function ContextApp({ children }) {
  // Toast Function
  const showToast = (
    message,
    type = "default"
  ) => {
    switch (type) {
      case "warn":
        toast.warn(message, defaultToastOptions);
        break;
      case "success":
        toast.success(message, defaultToastOptions);
        break;
      case "error":
        toast.error(message, defaultToastOptions);
        break;
      case "info":
        toast.info(message, defaultToastOptions);
        break;
      default:
        toast(message, defaultToastOptions);
        break;
    }
  };

  return (
    <AppContext.Provider value={{ showToast }}>
      <ToastContainer />
      {children}
    </AppContext.Provider>
  );
}