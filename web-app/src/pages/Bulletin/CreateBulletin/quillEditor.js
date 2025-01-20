import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const jsonData = {
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "The simulated rainfall forecast for February 2024 indicates a heightened risk of Rift Valley Fever (RVF) outbreak in Baringo County, Kenya. The anticipated rainfall levels are projected to be above average, creating favorable conditions for disease vectors. Understanding and monitoring such patterns is crucial for proactive measures and preparedness in managing potential health risks in the region.",
      },
    },
    {
      type: "header",
      data: {
        text: "Contingency Measures",
        level: 4,
      },
    },
    {
      type: "header",
      data: {
        text: "Human Health:",
        level: 5,
      },
    },
    {
      type: "list",
      data: {
        style: "unordered",
        items: [
          "Establish and sustain risk assessment capabilities within national public health services, research, and training institutions for application in RVF contingency planning and response.",
          "Regularly review and update the RVF contingency plan to ensure its effectiveness.",
        ],
      },
    },
    {
      type: "header",
      data: {
        text: "Animal Health:",
        level: 5,
      },
    },
    {
      type: "list",
      data: {
        style: "unordered",
        items: [
          "Develop and maintain risk assessment capabilities within national public health services, research, and training institutions for use in RVF contingency planning and response.",
          "Regularly review and update the RVF contingency plan to enhance its relevance and efficacy.",
        ],
      },
    },
    {
      type: "paragraph",
      data: {
        text: "By prioritizing and implementing these contingency measures, we can bolster our ability to respond effectively to the complex challenges posed by RVF outbreaks. It underscores the importance of proactive planning, research, and collaboration in safeguarding both human and animal populations from the impacts of climate-sensitive diseases.",
      },
    },
  ],
};

const maxLimit = 2500;
const maxLines = 20;

const QuillTextEditor = (props) => {
  const { onEditorChange } = props;
  const [editorHtml, setEditorHtml] = useState("");

  useEffect(() => {
    const convertToHtml = (jsonData) => {
      return jsonData.blocks
        .map((block) => {
          switch (block.type) {
            case "header":
              return `<h${block.data.level} style="font-weight: bold;">${block.data.text}</h${block.data.level}>`;
            case "paragraph":
              return `<p style="font-size: smaller;">${block.data.text}</p>`;
            case "list":
              return `<${block.data.style === "ordered" ? "ol" : "ul"}>${block.data.items
                .map((item) => `<li>${item}</li>`)
                .join("")}</${block.data.style === "ordered" ? "ol" : "ul"}>`;
            default:
              return "";
          }
        })
        .join("");
    };

    const preFilledContent = convertToHtml(jsonData);
    setEditorHtml(preFilledContent);
  }, []);

  // const handleEditorChange = (content, delta, source, editor) => {
  //   const textLength = editor.getLength();
  //   if (textLength <= maxLimit) {
  //     setEditorHtml(content);
  //     onEditorChange(content);
  //   } else {
  //     // Truncate the content if it exceeds the maximum limit
  //     const truncatedContent = editorHtml.substring(0, maxLimit);
  //     setEditorHtml(truncatedContent);
  //     onEditorChange(truncatedContent);
  //   }
  // };

  const handleEditorChange = (content, delta, source, editor) => {
    // Get the text from the editor content
    const text = editor.getText();

    // Split the text into lines
    const lines = text.split("\n");

    // Check if the number of lines exceeds the maximum limit
    if (lines.length <= maxLines) {
      const textLength = editor.getLength();
      if (textLength <= maxLimit) {
        setEditorHtml(content);
        onEditorChange(content);
      } else {
        // Truncate the content if it exceeds the maximum limit
        const truncatedContent = editorHtml.substring(0, maxLimit);
        setEditorHtml(truncatedContent);
        onEditorChange(truncatedContent);
      }
    } else {
      // If the limit is exceeded, truncate the content to fit the limit
      const lastNewlineIndex = content.lastIndexOf("\n");
      const truncatedContent = content.substring(0, lastNewlineIndex);
      setEditorHtml(truncatedContent);
      onEditorChange(truncatedContent);
    }
  };

  const toolbarOptions = [
    ["bold", "italic", "underline"],
    ["link"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ size: [16] }],
  ];

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={editorHtml}
        // defaultValue={preFilledContent}
        onChange={handleEditorChange}
        modules={{
          toolbar: toolbarOptions,
        }}
        className="editor-div notranslate"
      />
    </div>
  );
};

export default QuillTextEditor;
