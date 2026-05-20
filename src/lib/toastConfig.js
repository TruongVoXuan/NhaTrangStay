// Toast configuration
// Import this in your main App.js or index.js

import { toast } from "react-toastify";

/**
 * Default toast configuration
 * Can be overridden per toast call
 */
export const defaultToastConfig = {
  position: "top-right",
  autoClose: false, // Không tự đóng, phải click nút X
  hideProgressBar: true, // Ẩn thanh progress bar
  closeOnClick: false, // Không đóng khi click vào toast
  pauseOnHover: true,
  draggable: true,
  closeButton: true, // Hiển thị nút X để đóng
};

/**
 * Custom toast functions with default config
 */
export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    ...defaultToastConfig,
    ...options,
  });
};

export const showErrorToast = (message, options = {}) => {
  toast.error(message, {
    ...defaultToastConfig,
    ...options,
  });
};

export const showInfoToast = (message, options = {}) => {
  toast.info(message, {
    ...defaultToastConfig,
    ...options,
  });
};

export const showWarningToast = (message, options = {}) => {
  toast.warning(message, {
    ...defaultToastConfig,
    ...options,
  });
};

/**
 * Toast với auto close (cho các thông báo không quan trọng)
 */
export const showAutoCloseToast = (type, message, duration = 3000) => {
  const options = {
    ...defaultToastConfig,
    autoClose: duration,
    hideProgressBar: false,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }
};

/**
 * Apply default config to ToastContainer
 * Use in App.js:
 *
 * import { ToastContainer } from 'react-toastify';
 * import { defaultToastConfig } from './lib/toastConfig';
 *
 * <ToastContainer {...defaultToastConfig} />
 */
export default defaultToastConfig;
