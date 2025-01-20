import NotificationHandle from "./NotificationHandler";
import checkHttpStatus from "../../store/apiUtils/index";

async function baseMethod(serviceMethod, successMsg, errorMsg, ishide) {
  return serviceMethod
    .then(checkHttpStatus)
    .then((response) => {
      if (response?.data?.code === 200) {
        NotificationHandle(200, successMsg, true);
      } else {
        NotificationHandle(
          response.data?.error?.error,
          errorMsg || response.data.message,
          response?.data?.isSuccess
        );
      }
      return response;
    })
    .catch((err) => {
      if (err.response) {
        NotificationHandle(err.response.data.code, err.response.data?.message, false, ishide);
      }
      return err.response;
    });
}
export default baseMethod;
