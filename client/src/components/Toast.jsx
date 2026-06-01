import React, { useState, useEffect } from "react";
   import "./Toast.css";

   export const showToast = (message, type = "success") => {
     const event = new CustomEvent("show-toast", { detail: { message, type } });
     window.dispatchEvent(event);
   };

   function Toast() {
     const [toast, setToast] = useState(null);

     useEffect(() => {
       const handleShowToast = (e) => {
         const { message, type } = e.detail;
         setToast({ message, type });
       };

       window.addEventListener("show-toast", handleShowToast);
       return () => window.removeEventListener("show-toast", handleShowToast);
     }, []);

     useEffect(() => {
       if (toast) {
         const timer = setTimeout(() => {
           setToast(null);
         }, 4000); // 4 seconds before fading
         return () => clearTimeout(timer);
       }
     }, [toast]);

     if (!toast) return null;

     return (
       <div className={`toast-banner glass-panel ${toast.type}`}>
         <span className="toast-icon">
           {toast.type === "success" ? "✨" : "⚠️"}
         </span>
         <span className="toast-message">{toast.message}</span>
       </div>
     );
   }

   export default Toast;
