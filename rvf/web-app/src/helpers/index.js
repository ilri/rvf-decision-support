export function renderReactOptionsArraystate(
  optionsList,
  label,
  value,
  latitude,
  longitude,
  zoom_level,
  code,
  isCommodity,
  min_year,
  max_year,
  is_monthly,
  is_daily,
  available_years,
  avialble_months
) {
  const array = [];
  if (Array.isArray(optionsList)) {
    if (isCommodity) {
      optionsList.map((eachValue) =>
        array.push({
          label: eachValue[label],
          value: eachValue[value],
          min_year: eachValue[min_year],
          max_year: eachValue[max_year],
          is_monthly: eachValue[is_monthly],
          is_daily: eachValue[is_daily],
          available_years: eachValue[available_years],
          avialble_months: eachValue[avialble_months],
        })
      );
    } else {
      optionsList.map((eachValue) =>
        array.push({
          label: eachValue[label],
          value: eachValue[value],
          latitude: eachValue[latitude],
          longitude: eachValue[longitude],
          zoom_level: eachValue[zoom_level],
          code: eachValue[code],
        })
      );
    }
  } else {
    // eslint-disable-next-line no-console
    console.error("optionsList is not an array");
  }

  return array;
}

export const Years = Array.from({ length: 21 }, (_, index) => {
  const year = 2000 + index;
  return {
    value: year.toString(),
    label: year.toString(),
    id: year,
  };
});

export function renderSourceArray(optionsList, name, value, url) {
  const array = [];

  optionsList.map((eachValue) =>
    array.push({
      label: eachValue[name],
      value: eachValue[value],
      url: eachValue[url],
    })
  );
  return array;
}

function getMonthName(month) {
  if (typeof month === "number") {
    // Ensure the month is within a valid range (1 to 12)
    if (month >= 1 && month <= 12) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthNames[month - 1]; // Adjust for 0-based index
    } else {
      return "";
    }
  } else if (typeof month === "string") {
    // Convert the input month to title case
    return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  } else {
    return "";
  }
}
export function formatDateRange(startDate) {
  if (!startDate) {
    return "Invalid Date Range";
  }

  // Create a date object from the input string
  const startDateObj = new Date(startDate);

  // Calculate the end date as 6 months from the start date
  const endDateObj = new Date(startDateObj);
  endDateObj.setMonth(startDateObj.getMonth() + 5);

  // Extract year and month values
  const startYear = startDateObj.getFullYear();
  const startMonth = getMonthName(startDateObj.toLocaleDateString("en-US", { month: "short" })); // Get the month name in title case
  const endYear = endDateObj.getFullYear();
  const endMonth = getMonthName(endDateObj.toLocaleDateString("en-US", { month: "short" })); // Get the month name in title case

  return `${startMonth} ${startYear}-${endMonth} ${endYear}`;
}

export function formatMonthRange(startDate) {
  if (!startDate) {
    return "Invalid Date Range";
  }
  const startDateObj = new Date(startDate);
  const startYear = startDateObj.getFullYear();
  const startMonth = getMonthName(startDateObj.getMonth() + 1);
  return `${startMonth}-${startYear}`;
}
export function getColor(positiveCases) {
  if (positiveCases) {
    return positiveCases > 18
      ? "#800026"
      : positiveCases > 15
        ? "#BD0026"
        : positiveCases > 13
          ? "#E31A1C"
          : positiveCases > 10
            ? "#FC4E2A"
            : positiveCases > 7
              ? "#FD8D3C"
              : positiveCases > 5
                ? "#FEB24C"
                : positiveCases > 2
                  ? "#FED976"
                  : "#FFEDA0";
  } else {
    return "#898484";
  }
}
export function style(cases) {
  return {
    fillColor: getColor(cases),
    weight: 1,
    opacity: 1,
    color: "black",
    dashArray: "0",
    fillOpacity: 1,
  };
}

export function filterGeoJSONByCounty(geoJSON, selectedCounty, type) {
  if (!selectedCounty) {
    return [];
  }

  // Find all features that match the selected county by its name_1 property
  const selectedFeatures = geoJSON.features.filter((feature) => {
    return feature.properties[type] === selectedCounty.label;
  });

  if (selectedFeatures.length === 0) {
    return []; // Return an empty array if the selected county is not found
  }

  // Create a new GeoJSON object with the selected features
  return {
    type: "FeatureCollection",
    features: selectedFeatures,
  };
}

export function getEndDate(selectedMonth) {
  if (selectedMonth) {
    // Parse the selectedMonth (assumes it's in "YYYY-MM-DD" format)
    const [year, month] = selectedMonth.split("-");
    // Calculate the last day of the month
    const lastDay = new Date(year, month, 0);
    // Format the end date as 'YYYY-MM-DD' (e.g., '2023-05-31')
    const endOfMonth = `${year}-${month}-${lastDay.getDate()}`;
    return endOfMonth;
  }
  return null;
}

export function getStartDate(endDateString) {
  if (endDateString) {
    const endDate = new Date(endDateString);

    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 5);
    startDate.setDate(1);

    const formattedStartDate = startDate.toISOString().split("T")[0];

    return formattedStartDate;
  }
  return null;
}

export function getMonthYearArray(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setMonth(end.getMonth() + 2, 0);
  // Check if the start date is after the end date
  if (start > end) {
    return [];
  }

  const currentDate = new Date(start);
  const result = [];

  while (currentDate <= end) {
    const yearMonth = `${currentDate.toLocaleString("default", {
      month: "short",
    })}-${currentDate.getFullYear()}`;
    result.push(yearMonth);

    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Check if the last day of the month is the end date
    if (lastDayOfMonth.getTime() === end.getTime()) {
      break;
    }

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Remove the last element if the end date is not the last day of its month
  if (
    result.length > 0 &&
    result[result.length - 1] !==
      `${(currentDate - 1).toLocaleString("default", {
        month: "short",
      })}-${currentDate.getFullYear()}`
  ) {
    // result.pop();
  }

  return result;
}

export function convertToFullDate(monthYearString) {
  if (!monthYearString || typeof monthYearString !== "string") {
    return null;
  }

  const monthAbbreviations = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  const parts = monthYearString.split("-");
  if (parts.length !== 2) {
    return null;
  }

  const [month, year] = parts;
  const parsedMonth = monthAbbreviations[month];
  if (!parsedMonth || parsedMonth < 1 || parsedMonth > 12) {
    return null;
  }

  const parsedYear = parseInt(year, 10);
  if (Number.isNaN(parsedYear)) {
    return null;
  }

  // Use UTC to avoid timezone issues
  const formattedDate = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
  return formattedDate.toISOString().split("T")[0];
}

export function generateTimestamp() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  return `Report Generated On : ${day}-${month}-${year}`;
}

export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export const countNonEmptyValues = (obj) => {
  let count = 0;
  for (const key in obj) {
    if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
      count++;
    }
  }
  return count;
};
