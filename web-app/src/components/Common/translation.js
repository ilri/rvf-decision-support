import React, { useEffect, useState } from "react";

function GoogleTranslate() {
  const [error, setError] = useState(false);
  const [googleTranslateElementCalled, setGoogleTranslateElementCalled] = useState(false);

  useEffect(() => {
    // Create a script element
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElement";
    script.async = true;

    // Define the initialization function
    window.googleTranslateElement = () => {
      if (window.google && window.google.translate) {
        // Initialize Google Translate
        window.google.translate.TranslateElement(
          {
            defaultLanguage: "en",
            pageLanguage: "en",
            includedLanguages: "en,fr",
            // includedLanguages: "bn,de,nl,en,es,it,fr",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: true,
            multilanguagePage: true,
          },
          "google_translate_element"
        );
      } else {
        // Handle the case when Google Translate fails to load
        setError(true);
      }
      setGoogleTranslateElementCalled(true);
    };

    // Load the script
    script.onerror = () => {
      // Handle script load error
      setError(true);
    };

    document.body.appendChild(script);

    // Clean up by removing the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const googleTranslateElement = document.getElementById("google_translate_element");
    if (googleTranslateElement) {
      googleTranslateElement.addEventListener("click", handleTranslateClick);
    }

    return () => {
      if (googleTranslateElement) {
        googleTranslateElement.removeEventListener("click", handleTranslateClick);
      }
    };
  }, []);

  const handleTranslateClick = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const observer = new MutationObserver(handleMutation);
    const targetNode = document.getElementById("google_translate_element");
    const config = { childList: true, subtree: true };
    if (targetNode) {
      observer.observe(targetNode, config);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleMutation = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Apply your styling here
        const elements = document.querySelectorAll(
          "#google_translate_element .VIpgJd-ZVi9od-xl07Ob-lTBxed"
        );
        if (elements.length > 1) {
          for (let i = 1; i < elements.length; i++) {
            elements[i].style.display = "none";
          }
        }
      }
    }
  };

  useEffect(() => {
    if (googleTranslateElementCalled) {
      // Override the styles of language links in the iframe content
      const iframe = document.querySelector(".VIpgJd-ZVi9od-xl07Ob-OEVmcd");
      if (iframe) {
        // Wait for the iframe to load its content
        iframe.addEventListener("load", handleIframeLoad);
      }
    }
  }, [googleTranslateElementCalled]);

  const handleIframeLoad = () => {
    const iframe = document.querySelector(".VIpgJd-ZVi9od-xl07Ob-OEVmcd");
    // iframe.style.maxWidth = "90px";
    iframe.style.marginTop = "0.2%";
    iframe.style.borderRadius = "12px";
    if (iframe) {
      const iframeContent = iframe.contentDocument || iframe.contentWindow.document;
      const targetElement = iframeContent.querySelector(".VIpgJd-ZVi9od-vH1Gmf, #\\:1\\.menuBody");
      if (targetElement) {
        // Apply custom styles here
        targetElement.style.padding = "12%";
        targetElement.style.borderRadius = "12px";
        targetElement.style.minWidth = "70px";
        // const anchorElements = targetElement.getElementsByTagName("a");
        // const anchorElement = targetElement.querySelector("VIpgJd-ZVi9od-vH1Gmf-ibnC6b");
        // console.log(anchorElement, "ppp");
        // const anchorArray = Array.from(anchorElements);
        // const anchorArray = Array.prototype.slice.call(anchorElements);
        // console.log(anchorArray, "mmm1"); // Convert HTMLCollection to array
        // anchorArray.forEach((anchor) => {
        //   console.log(anchor, "dfg");
        //   // Apply custom styles or perform other actions with the anchor element
        // });
      }
    }
  };

  return (
    <div id="google_translate_element">
      {error && <p>Translation feature is not available at the moment.</p>}
    </div>
  );
}

export default GoogleTranslate;
