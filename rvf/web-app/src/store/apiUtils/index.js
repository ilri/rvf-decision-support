function checkHttpStatus(response) {
  if (response.status >= 500 && response.status < 600) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  } else {
    return response;
  }
}

export default checkHttpStatus;
