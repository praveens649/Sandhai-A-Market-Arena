import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`toast ${type}`}>
      {type === "success" ? (
        <CheckCircle size={20} />
      ) : (
        <AlertCircle size={20} />
      )}

      <span>{message}</span>

      <button onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;