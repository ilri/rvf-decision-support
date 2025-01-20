import React, { useState, useEffect, useRef } from "react";
import { Button } from "reactstrap";
import { ReactComponent as ArrowUp } from "../../assests/Images/upArrow.svg";
import { ReactComponent as ArrowDown } from "../../assests/Images/downArrow.svg";
import { convertToFullDate } from "../../helpers";

function MonthComponent({ graphData, onMonthChange, monthArray, ButtonLoader }) {
  const months = monthArray || [];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const defaultOption = months[months.length - 2]; // Initialize with the default option
  const ref = useRef();
  useEffect(() => {
    // Reset selectedOption when graphData.dates is updated
    setSelectedOption(null);
  }, [graphData?.dates]);

  const handleMonthChange = (item) => {
    setSelectedOption(item.label); // Set the selected option
    setIsOpen(false);
    onMonthChange(item.value); // Trigger the change handler with the selected value
  };
  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      // Click outside the component
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const monthsOptions = months
    .map((month) => {
      const fullDate = convertToFullDate(month);
      return {
        value: fullDate,
        label: month,
      };
    })
    .reverse(); // Reverse the months order.
  return (
    <div ref={ref} className="select-month notranslate">
      <Button onClick={handleToggle} className="month-button" disabled={ButtonLoader}>
        {selectedOption || defaultOption}&nbsp;&nbsp;
        <span className="collapse-style">{isOpen ? <ArrowUp /> : <ArrowDown />}</span>
      </Button>
      {isOpen && (
        <div className="options-container">
          {monthsOptions.map((item) => (
            <Button
              key={item.value}
              onClick={() => handleMonthChange(item)}
              className={item.label === selectedOption ? "month-options selected" : "month-options"}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MonthComponent;
