"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toaster() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3500}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      theme="colored"
      toastClassName="!rounded-xl !font-semibold"
    />
  );
}
