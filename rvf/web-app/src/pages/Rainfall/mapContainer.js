import React, { useEffect, useState, useRef, createRef } from "react";
import { MapContainer, TileLayer, LayersControl, LayerGroup, GeoJSON, Marker } from "react-leaflet";
import L from "leaflet";
import _ from "lodash";
import * as ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import "leaflet-side-by-side";
import { myConst } from "../../Constants";
import CustomLegend from "../../components/Common/customLegend";
import countyBoundaries from "../../components/boundaries/county.json";
import subCountyBoundaries from "../../components/boundaries/sub_county.json";
import { filterGeoJSONByCounty } from "../../helpers";
import Popup from "../Dashboard/popUp";
import MonthComponent from "./months";
import loader from "../../assests/Images/loading-buffering .gif";
import Legend from "../../components/Common/legend";
import { useLocation } from "react-router-dom";

function RenderMapContainer({
  MapData,
  MapData2,
  selectedLocation,
  indicatorList,
  isSubCounty,
  isCountry,
  isCounty,
  monthArray,
  graphData,
  handleMonthChange,
  formattedDateRange,
  isLoader,
  ButtonLoader,
  colHeight,
  previewMode,
}) {
  const location = useLocation();
  const isCreateBulletinPath = location.pathname == "/create-news-bulletin";
  const [position, setPosition] = useState([1.442, 38.4314]);
  const [zoom, setZoom] = useState(isCreateBulletinPath ? 5 : 6);
  const mapRef = useRef();
  const layerRef = useRef([]);
  const [maps, setMaps] = useState(null);
  const [mapControl, setMapControl] = useState({});
  const [layerControl, setLayerControl] = useState({
    firstLayer: {},
    secondLayer: {},
  });
  const [countyBoundry, setCountyBoundry] = useState(null);
  const isRainfall = true;
  const [loaderLatLng, setLoaderLatLng] = useState({
    lat: 1.442,
    lng: 38.4314,
  });
  const LoaderIcon = new L.Icon({ iconUrl: loader, iconSize: [80, 80] });
  const { Overlay } = LayersControl;
  const sideBySideControlRef = useRef();
  useEffect(() => {
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      setPosition([selectedLocation.latitude, selectedLocation.longitude]);
      setLoaderLatLng({
        lat: selectedLocation?.latitude,
        lng: selectedLocation?.longitude,
      });
      setZoom(selectedLocation.zoom_level);
    }
  }, [selectedLocation, MapData, MapData2]);
  useEffect(() => {
    if (
      !_.isEmpty(selectedLocation) &&
      // !_.isEmpty(MapData) &&
      !_.isEmpty(MapData2)
    ) {
      setCountyBoundry(null);
      let filteredCountyBoundary;

      if (isCountry || selectedLocation.label === "Kenya" || selectedLocation.label === "All") {
        filteredCountyBoundary = countyBoundaries;
      } else if (isSubCounty) {
        filteredCountyBoundary = filterGeoJSONByCounty(
          subCountyBoundaries,
          selectedLocation,
          "name_2"
        );
      } else if (isCounty || selectedLocation.label === "Embu") {
        filteredCountyBoundary = filterGeoJSONByCounty(
          subCountyBoundaries,
          selectedLocation,
          "name_1"
        );
      }

      const updatedCountyBoundry = { ...filteredCountyBoundary }; // Creating a copy of countyBoundry
      updatedCountyBoundry.features = updatedCountyBoundry?.features?.map((feature) => {
        feature.properties.colour = null; // Initialize colour to null
        feature.properties.value = null; // Initialize value to null

        // Find the matching data for the current feature
        const matchingData = MapData2?.map_data.find((data) => {
          if (data.sub_county_name) {
            // If both county_name and sub_county_name exist, match on both
            return (
              data.county_name === feature.properties.name_1 &&
              data.sub_county_name === feature.properties.name_2
            );
          } else {
            // If only county_name exists, match on county_name
            return data.county_name === feature.properties.name_1;
          }
        });

        // If matching data is found, update the properties
        if (matchingData) {
          feature.properties.colour = matchingData.colour;
          feature.properties.value = matchingData.value;
        }

        return feature;
      });

      setCountyBoundry(updatedCountyBoundry);
    } else {
      setCountyBoundry(null);
    }
  }, [selectedLocation, isCountry, isSubCounty, isCounty, MapData2]);
  function highlightFeature(e, value) {
    const layer = e.target;
    layer.setStyle({
      fillColor: value.colour !== null && value.colour !== undefined ? value.colour : "transparent",
      weight: 3,
      opacity: 1,
      color: "black",
      dashArray: "0",
      fillOpacity: 1,
    });
    layer.bringToFront();
  }

  // Reseting the GeoJson Layer back to origianl style whenever mouse is out
  const resetHighlight = (e, value) => {
    const layer = e.target;
    layer.setStyle({
      fillColor: value.colour !== null && value.colour !== undefined ? value.colour : "transparent",
      weight: 1,
      opacity: 1,
      color: "black",
      fillOpacity: 1,
    });

    layer.bringToFront();
  };

  // Gets zoom into the GeoJson layer when clicked on it
  function zoomToFeature(e) {
    maps.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feat, layer, cases) {
    const popupContent = ReactDOMServer.renderToString(
      <Popup data={feat} isRainfall={isRainfall} />
    );

    layer.on({
      mouseover: (e) => {
        highlightFeature(e, cases);
        layer?.bindTooltip(popupContent, {
          sticky: true,
          // direction: "left",
          className: "tool-tip-style",
        });
        layer?.openTooltip();
        layer?.getTooltip().setOpacity(1);
      },
      mouseout: (e) => {
        resetHighlight(e, cases);
        layer?.unbindTooltip();
        layer?.closeTooltip();
      },
      click: (e) => {
        if (cases) {
          zoomToFeature(e);
        }
      },
    });
  }
  useEffect(() => {
    setMaps(mapRef.current);
  }, [mapRef.current]);
  useEffect(() => {
    layerRef.current = [];
    if (indicatorList.length) {
      indicatorList.forEach(() => {
        const ref2 = createRef();
        layerRef.current.push(ref2);
      });
    }
  }, [indicatorList]);

  const removeMapLayers = () => {
    let previousParamRef = "";
    if (layerRef?.current?.length) {
      layerRef.current.map((i, index) => {
        previousParamRef = layerRef.current[index];
        // Clear the layers using clearLayers method
        previousParamRef.current.clearLayers();
        return null;
      });
    }
    if (!_.isEmpty(layerControl?.firstLayer)) {
      maps?.removeControl(layerControl?.firstLayer);
    }
    if (!_.isEmpty(layerControl?.secondLayer)) {
      maps?.removeControl(layerControl?.secondLayer);
    }
    if (!_.isEmpty(mapControl)) {
      maps?.removeControl(mapControl);
    }
    setMapControl("");
    setLayerControl({
      firstLayer: {},
      secondLayer: {},
    });
  };

  useEffect(() => {
    if (layerRef.current) {
      const currentParamRef = layerRef.current[0];
      if (!_.isEmpty(currentParamRef) && !_.isEmpty(currentParamRef?.current) && MapData2) {
        currentParamRef.current._url = MapData?.map_data?.map_url;
        removeMapLayers();
        if (currentParamRef.current._url) {
          maps.createPane("top");
          maps.getPane("top").style.zIndex = "599";
          const firstLayer = L.tileLayer(currentParamRef.current._url, {
            pane: "top",
          });
          firstLayer.addTo(maps);
          const secondLayer = L.tileLayer(
            "https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/c4a64509ba8997[…]7ddd-3c2dbc996c33f0abbee5207529765b4f/tiles/{z}/{x}/{y}"
          );
          secondLayer.addTo(maps);
          const control = L.control.sideBySide(firstLayer, secondLayer);
          control.addTo(maps);
          setMapControl(control);
          setLayerControl({ firstLayer, secondLayer });
          sideBySideControlRef.current = control;
        }
      }
      if (MapData?.map_url && MapData2 && maps) {
        maps.eachLayer((layer) => {
          maps.removeLayer(layer);
        });

        if (sideBySideControlRef.current) {
          sideBySideControlRef.current.remove();
          sideBySideControlRef.current = null;
        }
      }
    }
  }, [MapData, MapData2, maps]);

  // Custom function to set the view of the map
  function setMapView(map, center) {
    if (map) {
      map.setView(center, zoom);
    }
  }
  useEffect(() => {
    if (isLoader && maps) {
      // If isLoader is true, remove the layers immediately
      removeMapLayers();
    }
  }, [isLoader, maps, MapData, MapData2]);

  useEffect(() => {
    if (maps) {
      setMapView(maps, position, zoom);
    }
  }, [maps, position, zoom]);

  const renderParamLayer = (paramList) => {
    if (paramList && paramList?.length) {
      return paramList?.map((item, index) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <Overlay>
            <LayerGroup ref={layerRef.current[index]}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url=""
                options={{ opacity: 1.0 }}
              />
            </LayerGroup>
          </Overlay>
        );
      });
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      key={colHeight}
      style={{
        height: isCreateBulletinPath ? `${colHeight}px` : "620px",
        width: "95%",
        borderRadius: "20px",
        zIndex: 0,
        // cursor: previewMode ? "not-allowed" : "pointer",
      }}
      whenReady={(mapes) => {
        mapRef.current = mapes.target;
      }}
      zoomControl={previewMode ? false : true}
      dragging={previewMode ? false : true}
      doubleClickZoom={previewMode ? false : true}
      scrollWheelZoom={previewMode ? false : true}
      keyboard={previewMode ? false : true}
      touchZoom={previewMode ? false : true}
      boxZoom={previewMode ? false : true}
    >
      {isLoader ? (
        <Marker position={[loaderLatLng?.lat, loaderLatLng?.lng]} icon={LoaderIcon} />
      ) : (
        ""
      )}
      <LayersControl>
        <LayersControl.BaseLayer name="Satellite View">
          <TileLayer url={myConst.SATELLITE_TILE_LAYER_URL} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Streets View">
          <TileLayer url={myConst.TITLE_LAYER_URL} />
        </LayersControl.BaseLayer>
      </LayersControl>
      {selectedLocation && (
        <div className={`${isCreateBulletinPath ? "title-map1" : "title-map notranslate"}`}>
          <p className="title">
            <span className="notranslate">
              {selectedLocation?.label === "All" ? "Kenya" : selectedLocation?.label}
            </span>
            <br /> ({formattedDateRange})
          </p>
        </div>
      )}
      <LayersControl position="topleft">{renderParamLayer(indicatorList)}</LayersControl>
      {countyBoundry &&
        (MapData || MapData2) &&
        countyBoundry?.features.map((item) => {
          if (!_.isEmpty(item)) {
            return (
              <GeoJSON
                key={item?.state_name}
                data={item}
                style={(feat) => {
                  return {
                    fillColor:
                      feat.properties.colour !== null && feat.properties.colour !== undefined
                        ? feat.properties.colour
                        : "transparent",
                    weight: 1,
                    opacity: 1,
                    color: "black",
                    dashArray: "0",
                    fillOpacity: 1,
                  };
                }}
                onEachFeature={
                  !previewMode
                    ? (feat, layer) => onEachFeature(feat, layer, feat?.properties)
                    : null
                }
              />
            );
          }
          return null;
        })}
      {!MapData && !MapData2 && !isLoader ? (
        <div className="legend3">
          <p className="legend-title1">
            Rainfall and Risk data are not available <br /> for the selected month
          </p>
        </div>
      ) : (
        ""
      )}
      <LayersControl position="bottomleft">
        {!MapData && MapData2 && !isLoader && !isCreateBulletinPath
          ? ""
          : // <div className="legend">
            //   <p className="legend-title1">
            //     Rainfall data is not available <br /> for the selected month
            //   </p>
            // </div>
            MapData
            ? MapData2 && (
                <CustomLegend
                  palette={MapData?.map_data?.palette}
                  units=""
                  indicator={indicatorList[0]?.label}
                  name="Rainfall"
                  max={MapData?.map_data?.max}
                  min={MapData?.map_data?.min}
                  isRainfall={isRainfall}
                />
              )
            : isLoader
              ? ""
              : null}
      </LayersControl>
      {!isCreateBulletinPath && (
        <LayersControl>
          <MonthComponent
            graphData={graphData}
            monthArray={monthArray}
            onMonthChange={handleMonthChange}
            ButtonLoader={ButtonLoader}
          />
        </LayersControl>
      )}
      {!_.isEmpty(MapData2) && selectedLocation && <Legend legend={MapData2.legend} />}
    </MapContainer>
  );
}

export default React.memo(RenderMapContainer);
