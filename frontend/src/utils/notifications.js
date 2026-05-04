import Swal from 'sweetalert2';

/**
 * Sanitize message by removing internal URLs like localhost
 * @param {string} msg 
 * @returns {string}
 */
const sanitizeMessage = (msg) => {
  if (typeof msg !== 'string') return msg;
  return msg.replace(/https?:\/\/localhost:\d+/gi, 'the server');
};

/**
 * Show a success message box
 * @param {string} title 
 * @param {string} text 
 */
export const showSuccess = (title, text = '') => {
  return Swal.fire({
    title: sanitizeMessage(title),
    text: sanitizeMessage(text),
    icon: 'success',
    confirmButtonColor: '#3085d6',
    timer: 3000,
    timerProgressBar: true,
  });
};

/**
 * Show an error message box
 * @param {string} title 
 * @param {string} text 
 */
export const showError = (title, text = '') => {
  return Swal.fire({
    title: sanitizeMessage(title),
    text: sanitizeMessage(text),
    icon: 'error',
    confirmButtonColor: '#d33',
  });
};

/**
 * Show a confirmation dialog
 * @param {string} title 
 * @param {string} text 
 * @returns {Promise<boolean>}
 */
export const showConfirm = (title, text = '') => {
  return Swal.fire({
    title: sanitizeMessage(title),
    text: sanitizeMessage(text),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    return result.isConfirmed;
  });
};

/**
 * Show a simple toast notification
 * @param {string} message 
 * @param {string} icon - 'success' | 'error' | 'warning' | 'info'
 */
export const showToast = (message, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon,
    title: sanitizeMessage(message)
  });
};

