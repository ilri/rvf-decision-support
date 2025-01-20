import React from "react";
// import { useSelector, shallowEqual } from "react-redux";
import Loader from "react-spinners/FadeLoader";

function GlobalLoader({ loader, width, height, borderRadius }) {
  const isLoading = loader;

  const loaderStyle = {
    width: width || "100%",
    height: height || "100%",
    borderRadius: borderRadius || "none",
  };

  return isLoading ? (
    <div className="backdrop-loader" id="loader" style={loaderStyle}>
      <div className="overlay loader-text-alignmant">
        <Loader color="#962129" margin={2} size={20} />
        <div className="loadet-text mt-3">
          <p> Loading... </p>
        </div>
      </div>
    </div>
  ) : null;
}

export default GlobalLoader;
