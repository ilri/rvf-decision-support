import logo1 from "../assests/Images/Group 7619.svg";
import logo2 from "../assests/Images/Group 7614.svg";
import logo3 from "../assests/Images/Group 7618.svg";
// import logo4 from "../assests/Images/Group 7620.svg";
import logo5 from "../assests/Images/Group 7613.svg";
import logo6 from "../assests/Images/Group 7617.svg";
import logo7 from "../assests/Images/Group 7615.svg";
import logo8 from "../assests/Images/Group 7616.svg";
import CGIAR from "../assests/Images/AICCRA.png";
import Digital from "../assests/Images/Digital innovation.png";
import Health from "../assests/Images/OHRECA.png";
import USAID from "../assests/Images/USAID.png";
import image1 from "../assests/Images/image1.png";
import image2 from "../assests/Images/image2.png";
import image3 from "../assests/Images/image3.png";

export const status200 = 200;
export const status300 = 300;
export const status400 = 400;
export const status401 = 401;
export const status600 = 600;

export const LOCATION = {
  Region: "region",
  Country: "Country",
  State: "County",
  District: "SubCounty",
  Province: "Province",
  Divisions: "Divisions",
};

export const Months = [
  { value: "01", label: "January", id: "Jan" },
  { value: "02", label: "February", id: "Feb" },
  { value: "03", label: "March", id: "Mar" },
  { value: "04", label: "April", id: "Apr" },
  { value: "05", label: "May", id: "May" },
  { value: "06", label: "June", id: "June" },
  { value: "07", label: "July", id: "July" },
  { value: "08", label: "August", id: "Aug" },
  { value: "09", label: "September", id: "Sep" },
  { value: "10", label: "October", id: "Oct" },
  { value: "11", label: "November", id: "Nov" },
  { value: "12", label: "December", id: "Dec" },
];

const apiKey =
  "pk.eyJ1IjoiYmhhbnV0ZWphMzMiLCJhIjoiY2xuMzhheXN5MGQ2MjJxbDcxbHl4cWRmOSJ9.VUf0syvCotgTqgAO8i-J9g";

export const myConst = {
  TITLE_LAYER_URL: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${apiKey}`,
  SATELLITE_TILE_LAYER_URL: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=${apiKey}`,
  TITLE_LAYER_ATTRIBUTE:
    'Weather from <a href="https://openweathermap.org/" alt="World Map and worldwide Weather Forecast online">OpenWeatherMap</a>',
  SATELLITE_TITLE_LAYER_ATTRIBUTE: `© <a href='https://www.mapbox.com/about/maps/' target='_blank'>Mapbox</a>`,
};

export const rvfLegendData = {
  palette: [
    "#898484",
    "#FFEDA0",
    "#FED976",
    "#FEB24C",
    "#FD8D3C",
    "#FC4E2A",
    "#E31A1C",
    "#BD0026",
    "#800026",
  ],
  units: ["-ve", "> 0", "> 2", "> 5", "> 7", "> 10", "> 13", "> 15", "> 18"],
};

export const initialFormData1 = {
  adm0_id: "e58ca297-ca6c-4c61-b496-0af81192b046",
  adm0_name: "Kenya",
  adm1_id: "",
  adm1_name: "",
  adm2_id: undefined,
  adm2_name: undefined,
  api_url: "climate_accumulated_rainfall/chirps",
  basin_name: "",
  end_date: "2007-01-01",
  start_date: "2006-07-01",
  sub_basin_name: "",
  spatial_aggregation: "mean",
};

export const initialFormData2 = {
  adm0_id: "e58ca297-ca6c-4c61-b496-0af81192b046",
  adm0_name: "Kenya",
  adm1_id: "",
  adm1_name: "",
  adm2_id: undefined,
  adm2_name: undefined,
  api_url: "climate_accumulated_rainfall/chirps",
  basin_name: "",
  end_date: "2007-01-01",
  start_date: "2006-07-01",
  sub_basin_name: "",
  temporal_aggregation: "mean",
};

export const initialFormData = {
  adm0_id: "e58ca297-ca6c-4c61-b496-0af81192b046",
  adm0_name: "Kenya",
  adm1_id: "",
  adm1_name: "",
  adm2_id: undefined,
  adm2_name: undefined,
  api_url: "climate_accumulated_rainfall/chirps",
  basin_name: "",
  end_date: "2007-01-01",
  start_date: "2006-07-01",
  sub_basin_name: "",
  source: { label: "CHRIPS" },
};

export const defaultLocation = {
  label: "Kenya",
  latitude: 1.442,
  longitude: 38.4314,
  value: "e58ca297-ca6c-4c61-b496-0af81192b046",
  zoom_level: 5,
};
export const RainfallDefaultLocation = {
  // label: "Embu",
  // latitude: -0.6039,
  // longitude: 37.6265,
  // value: "0f54504a-f014-438a-b078-d68d262e11b8",
  // zoom_level: 9,
  label: "Kenya",
  latitude: 1.442,
  longitude: 38.4314,
  value: "e58ca297-ca6c-4c61-b496-0af81192b046",
  zoom_level: 6,
};

export const defaultSource = {
  label: "CHIRPS",
  url: "climate_accumulated_rainfall/chirps",
  value: "45859653-b95d-4e76-8274-0f199825cda9",
};

export const defaultCounty = {
  // label: "Embu",
  // value: "0f54504a-f014-438a-b078-d68d262e11b8",
  label: "All",
  value: "",
  latitude: 1.442,
  longitude: 38.4314,
  zoom_level: 5,
};

export const logoList = [
  { src: logo1, alt: "logo1", link: "https://www.facebook.com/ilri.org" },
  { src: logo2, alt: "logo2", link: "https://twitter.com/ilri" },
  {
    src: logo3,
    alt: "logo3",
    link: "https://www.slideshare.net/ILRI/",
  },
  // { src: logo4, alt: "logo4", link: "https://www.flickr.com/photos/ilri/albums/" },
  { src: logo5, alt: "logo5", link: "https://www.youtube.com/user/ILRIFILM" },
  {
    src: logo6,
    alt: "logo6",
    link: "https://www.linkedin.com/uas/login?session_redirect=%2Fschool%2F2705833%2F",
  },
  { src: logo7, alt: "logo7", link: "https://www.pinterest.com/ilri/" },
  { src: logo8, alt: "logo8", link: "https://www.instagram.com/whylivestockmatter/" },
];

export const defaultYear = new Date("Sat Jul 01 2006 17:21:31 GMT+0530");

const currentDate = new Date();

export const RainfallinitialFormData = {
  adm0_id: "e58ca297-ca6c-4c61-b496-0af81192b046",
  adm0_name: "Kenya",
  // adm1_id: "0f54504a-f014-438a-b078-d68d262e11b8",
  // adm1_name: "Embu",
  adm1_id: "",
  adm1_name: "",
  adm2_id: undefined,
  adm2_name: undefined,
  basin_name: "",
  sub_basin_name: "",
  spatial_aggregation: "mean",
};
export const RainfallinitialMapFormData = {
  adm0_id: "e58ca297-ca6c-4c61-b496-0af81192b046",
  adm0_name: "Kenya",
  // adm1_id: "0f54504a-f014-438a-b078-d68d262e11b8",
  // adm1_name: "Embu",
  adm1_id: "",
  adm1_name: "",
  adm2_id: undefined,
  adm2_name: undefined,
  basin_name: "",
  sub_basin_name: "",
  temporal_aggregation: "mean",
};

const todayDate = new Date();

// Calculate the end date by adding 15 days to the current date
const endDate = new Date(todayDate);
endDate.setDate(currentDate.getDate() + 15);

// Format the start date and end date as strings in "YYYY-MM-DD" format
const startDateString = currentDate.toISOString().split("T")[0];
const endDateString = endDate.toISOString().split("T")[0];

export const gfsNovaIntial = {
  adm0_name: "Kenya",
  adm1_name: "",
  adm2_name: "",
  spatial_aggregation: "mean",
  parameter_id: "precipitation",
  end_date: endDateString,
  start_date: startDateString,
};

export const gfsNovaTempIntial = {
  adm0_name: "Kenya",
  adm1_name: "",
  adm2_name: "",
  spatial_aggregation: "mean",
  parameter_id: "temperature",
  end_date: endDateString,
  start_date: startDateString,
};

export const defaultPhase = {
  label: "Inter-epidemic period",
  value: "7fd5941c-6fae-47ef-8133-17b34e0f0132",
};
export const defaultCategory = {
  label: "Capacity",
  value: "f79bfefe-a50e-41b0-80a8-c3c0bcf4a363",
};
export const defaultActivity = {
  label: "Laboratory diagnosis",
  value: "d4fe667e-72a6-4336-a622-ad3be658eeaa",
};

export const initialFormTable = {
  phaseName: "Inter-Epidemic Peroid",
  phase: "7fd5941c-6fae-47ef-8133-17b34e0f0132",
  event: null,
  subEvent: null,
  category: null,
  activity: null,
};

export const partnerList = [
  { src: USAID, alt: "logo4" },
  { src: Health, alt: "logo3" },
  { src: CGIAR, alt: "logo1" },
  { src: Digital, alt: "logo2" },
];

export const cardList = [
  {
    src: image1,
    alt: "image1",
    title: "RVF cases expected to rise in February end 2024 in Baringo, Kenya",
    date: "Published on: 7 Feb 2024",
  },
  {
    src: image2,
    alt: "image2",
    title: "Issue 06 - 1 Feb 2024",
    date: "Published on: 1 Feb 2024",
  },
  {
    src: image3,
    alt: "image3",
    title: "Issue 05 - 1 Feb 2024",
    date: "Published on: 1 Feb 2024",
  },
];

export const defaultDescription = `
<p>The simulated rainfall forecast for February 2024 indicates a heightened risk of Rift Valley Fever (RVF) outbreak in Baringo County, Kenya. The anticipated rainfall levels are projected to be above average, creating favorable conditions for disease vectors. Understanding and monitoring such patterns is crucial for proactive measures and preparedness in managing potential health risks in the region.</p>
<h4>Contingency Measures</h4>
<h5>Human Health</h5>
<ul>
    <li>Establish and sustain risk assessment capabilities within national public health services, research, and training institutions for application in RVF contingency planning and response.</li>
    <li>Regularly review and update the RVF contingency plan to ensure its effectiveness.</li>
</ul>
<h5>Animal Health</h5>
<ul>
    <li>Develop and maintain risk assessment capabilities within national public health services, research, and training institutions for use in RVF contingency planning and response.</li>
    <li>Regularly review and update the RVF contingency plan to enhance its relevance and efficacy.</li>
</ul>
<p>By prioritizing and implementing these contingency measures, we can bolster our ability to respond effectively to the complex challenges posed by RVF outbreaks. It underscores the importance of proactive planning, research, and collaboration in safeguarding both human and animal populations from the impacts of climate-sensitive diseases.</p>
`;
export const DOWNLOAD_PAGE_IDS = ["report-page"];

export const emptyPayload = {
  page: 1,
  page_limit: 8,
  country_name: "Kenya",
  county_name: "",
  sub_county_name: "",
  start_date: "",
  end_date: "",
};
export const modelIntialData = {
  adm0_name: "Kenya",
  adm1_name: "",
  adm2_name: "",
};

export const modelDefaultLocation = {
  label: "All",
  value: "e58ca297-ca6c-4c61-b496-0af81192b046",
  latitude: 1.442,
  longitude: 38.4314,
  zoom_level: 6,
};

export const EmailId = "B.BETT@cgiar.org";

export const TemporaryPassword = "Password@123";
