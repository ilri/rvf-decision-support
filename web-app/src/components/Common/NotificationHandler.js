import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { status200, status300, status400, status600 } from "../../Constants";

/*  -------function that handle all type of error and success notifications----*/
function NotificationHandle(status, message, isSuccess, ishide) {
  let content;
  if (status >= status200 && status < status300 && isSuccess) {
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  } else if (status >= status400 && status < status600) {
    // Do not show notification for status 400
    content = message;
  } else {
    if (status >= status200 && status < status300) {
      content = message;
    }
    if (!ishide) {
      if (content) {
        toast.error(content, {
          position: "top-right",
          autoClose: 5000,
          transition: Slide,
        });
      }
    }
  }
}

export default NotificationHandle;
