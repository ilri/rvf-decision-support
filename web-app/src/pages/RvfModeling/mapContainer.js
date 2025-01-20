import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, LayersControl, GeoJSON, Marker } from "react-leaflet";
import L from "leaflet";
import _ from "lodash";
import * as ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import "leaflet-side-by-side";
import { myConst } from "../../Constants";
import countyBoundaries from "../../components/boundaries/county.json";
import subCountyBoundaries from "../../components/boundaries/sub_county.json";
import { filterGeoJSONByCounty } from "../../helpers";
import Popup from "../Dashboard/popUp";
import loader from "../../assests/Images/loading-buffering .gif";
// import Legend from "../../components/Common/legend";
import CustomLegend from "../../components/Common/customLegend";

function RenderMapContainer({
  forcastMapData,
  selectedLocation,
  isSubCounty,
  isCountry,
  isCounty,
  isLoader,
  month,
}) {
  const [position, setPosition] = useState([1.442, 38.4314]);
  const customLayerRef = useRef();
  const [zoom, setZoom] = useState(6);
  const [maps, setMaps] = useState(null);
  const [countyBoundry, setCountyBoundry] = useState(null);
  const [loaderLatLng, setLoaderLatLng] = useState({
    lat: 1.442,
    lng: 38.4314,
  });
  const LoaderIcon = new L.Icon({ iconUrl: loader, iconSize: [80, 80] });
  useEffect(() => {
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      setPosition([selectedLocation.latitude, selectedLocation.longitude]);
      setLoaderLatLng({
        lat: selectedLocation?.latitude,
        lng: selectedLocation?.longitude,
      });
      setZoom(selectedLocation.zoom_level);
    }
  }, [selectedLocation, forcastMapData]);
  useEffect(() => {
    if (!_.isEmpty(selectedLocation)) {
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
      } else if (isCounty || selectedLocation.label === "Elegeyo-marakwet") {
        filteredCountyBoundary = filterGeoJSONByCounty(
          subCountyBoundaries,
          selectedLocation,
          "name_1"
        );
      }
      setCountyBoundry(filteredCountyBoundary);
    }
  }, [selectedLocation, isCountry, isSubCounty, isCounty]);

  function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
      fillColor: "transparent",
      weight: 3,
      opacity: 1,
      color: "black",
      dashArray: "0",
      fillOpacity: 1,
    });
    layer.bringToFront();
  }

  // Reseting the GeoJson Layer back to origianl style whenever mouse is out
  const resetHighlight = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillColor: "transparent",
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
    const popupContent = ReactDOMServer.renderToString(<Popup data={feat} isRainfall={false} />);

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

  const wrap = useRef();
  const setMapReference = (mapInstance) => {
    wrap.current = mapInstance;
  };

  useEffect(() => {
    setMaps(wrap.current);
  }, [wrap.current]);

  // Custom function to set the view of the map
  function setMapView(map, center) {
    if (map) {
      map.setView(center, zoom);
    }
  }

  useEffect(() => {
    if (maps) {
      setMapView(maps, position, zoom);
    }
  }, [maps, position, zoom]);

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{
        height: "620px",
        width: "98%",
        borderRadius: "20px",
        zIndex: 0,
        // cursor: previewMode ? "not-allowed" : "pointer",
      }}
      ref={setMapReference}
    >
      {isLoader ? (
        <Marker position={[loaderLatLng?.lat, loaderLatLng?.lng]} icon={LoaderIcon} />
      ) : (
        ""
      )}
      {forcastMapData?.map_data?.map_url ? (
        <TileLayer
          ref={customLayerRef}
          url={forcastMapData?.map_data?.map_url}
          options={{ tileSize: 256 }}
          zIndex={500}
        />
      ) : null}
      <LayersControl>
        <LayersControl.BaseLayer name="Satellite View">
          <TileLayer url={myConst.SATELLITE_TILE_LAYER_URL} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Streets View">
          <TileLayer url={myConst.TITLE_LAYER_URL} />
        </LayersControl.BaseLayer>
      </LayersControl>
      {selectedLocation && (
        <div className="title-map2 notranslate" style={{ marginTop: "1%" }}>
          <p className="title">
            <span>{selectedLocation?.label === "All" ? "Kenya" : selectedLocation?.label}</span>
            <br /> ({month})
          </p>
        </div>
      )}
      {!forcastMapData && !isLoader ? (
        <div className="legend3">
          <p className="legend-title3">Risk data are not available for the selected Criteria</p>
        </div>
      ) : null}
      {countyBoundry &&
        forcastMapData &&
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
                        ? "transparent"
                        : "transparent",
                    weight: 1,
                    opacity: 1,
                    color: "black",
                    dashArray: "0",
                    fillOpacity: 1,
                  };
                }}
                onEachFeature={(feat, layer) => onEachFeature(feat, layer, feat?.properties)}
              />
            );
          }
          return null;
        })}
      {!_.isEmpty(forcastMapData) && selectedLocation && (
        // <Legend legend={forcastMapData?.map_data?.palette} />
        <CustomLegend
          palette={forcastMapData?.map_data?.palette}
          units={forcastMapData?.map_data?.units}
          // indicator={indicatorList[0]?.label}
          name="Risk Level"
          max={forcastMapData?.map_data?.max}
          min={forcastMapData?.map_data?.min}
          isRvfModelling
          // isRainfall={isRainfall}
        />
      )}
    </MapContainer>
  );
}

export default React.memo(RenderMapContainer);
