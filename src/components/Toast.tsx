import { ToastContainer, toast } from "react-toastify";
import React from "react";
export const notify = (message: string) =>
  toast.error(message, {
    position: toast.POSITION.BOTTOM_CENTER,
  });

export default (): JSX.Element => {
  return (
    <>
      <ToastContainer autoClose={1500} limit={3} theme="dark" hideProgressBar />
    </>
  );
};
