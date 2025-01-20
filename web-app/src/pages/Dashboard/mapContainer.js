import React, { useEffect, useState, useRef, createRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, LayerGroup, Marker } from "react-leaflet";
import * as ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import "leaflet-side-by-side";
import L from "leaflet";
import _ from "lodash";
import { myConst, rvfLegendData } from "../../Constants";
import CustomLegend from "../../components/Common/customLegend";
import RvfLegend from "../../components/Common/rvfLegend";
import { filterGeoJSONByCounty, getColor, style } from "../../helpers";
import countyBoundaries from "../../components/boundaries/county.json";
import subCountyBoundaries from "../../components/boundaries/sub_county.json";
import loader from "../../assests/Images/loading-buffering .gif";
import Popup from "./popUp";

function RenderMapContainer({
  MapData1,
  MapData2,
  indicatorList,
  selectedLocation,
  formattedDateRange,
  isSubCounty,
  isCountry,
  isCounty,
  isLoader,
}) {
  const [position, setPosition] = useState([1.442, 38.4314]);
  const [zoom, setZoom] = useState(5);
  const mapRef = useRef();
  const layerRef = useRef([]);
  const [maps, setMaps] = useState(null);
  const [mapControl, setMapControl] = useState({});
  const [layerControl, setLayerControl] = useState({
    firstLayer: {},
    secondLayer: {},
  });
  const [loaderLatLng, setLoaderLatLng] = useState({
    lat: 1.442,
    lng: 38.4314,
  });
  const LoaderIcon = new L.Icon({ iconUrl: loader, iconSize: [80, 80] });
  const { Overlay } = LayersControl;
  const sideBySideControlRef = useRef();
  const [countyBoundry, setCountyBoundry] = useState(null);
  useEffect(() => {
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      setPosition([selectedLocation.latitude, selectedLocation.longitude]);
      setLoaderLatLng({
        lat: selectedLocation?.latitude,
        lng: selectedLocation?.longitude,
      });
      setZoom(selectedLocation.zoom_level);
    }
  }, [selectedLocation]);
  useEffect(() => {
    if (!_.isEmpty(selectedLocation) && !_.isEmpty(MapData2)) {
      setCountyBoundry(null);
      let filteredCountyBoundary;

      if (isCountry || selectedLocation.label === "Kenya") {
        filteredCountyBoundary = countyBoundaries;
      } else if (isSubCounty) {
        filteredCountyBoundary = filterGeoJSONByCounty(
          subCountyBoundaries,
          selectedLocation,
          "name_2"
        );
      } else if (isCounty) {
        filteredCountyBoundary = filterGeoJSONByCounty(
          subCountyBoundaries,
          selectedLocation,
          "name_1"
        );
      }
      const updatedCountyBoundry = { ...filteredCountyBoundary }; // Creating a copy of countyBoundry

      updatedCountyBoundry.features = updatedCountyBoundry.features.map((feature) => {
        feature.properties.positive_cases = 0; // Initialize cases to 0
        feature.properties.negative_cases = 0;

        MapData2.forEach((data) => {
          if (
            data.county_name === feature.properties.name_1 &&
            data.sub_county_name === feature.properties.name_2
          ) {
            feature.properties.positive_cases += data.positive_cases;
            feature.properties.negative_cases += data.negative_cases;
          }
        });

        return feature;
      });

      setCountyBoundry(updatedCountyBoundry);
    } else {
      setCountyBoundry(null);
    }
  }, [selectedLocation, isCountry, isSubCounty, isCounty, MapData2]);

  // Highlighting the particular location of GeoJson Layer when hovered
  function highlightFeature(e, caseValue) {
    const layer = e.target;
    layer.setStyle({
      fillColor: caseValue ? getColor(caseValue) : "#898484",
      weight: 3,
      opacity: 1,
      color: "black",
      dashArray: "0",
      fillOpacity: 1,
    });
    layer.bringToFront();
  }

  // Reseting the GeoJson Layer back to origianl style whenever mouse is out
  const resetHighlight = (e, caseValue) => {
    const layer = e.target;
    layer.setStyle({
      fillColor: caseValue ? getColor(caseValue) : "#898484",
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
    const popupContent = ReactDOMServer.renderToString(<Popup data={feat} />);

    layer.on({
      mouseover: (e) => {
        highlightFeature(e, cases);
        layer?.bindTooltip(popupContent, {
          sticky: true,
          direction: "left",
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

  const removeLayers = (selectedParamRef) => {
    if (maps && maps.current && selectedParamRef && selectedParamRef?.current) {
      const map1 = maps.current;

      const firstLayer = selectedParamRef.current;

      [firstLayer].forEach((layer) => map1.removeLayer(layer));
    }
  };

  const removeMapLayers = () => {
    let previousParamRef = "";
    if (layerRef?.current?.length) {
      layerRef.current.map((i, index) => {
        previousParamRef = layerRef.current[index];
        removeLayers(previousParamRef);
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
      if (!_.isEmpty(currentParamRef) && !_.isEmpty(currentParamRef?.current)) {
        currentParamRef.current._url = MapData1?.map_data?.map_url;
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
      if (MapData1?.map_url && MapData2 && maps) {
        maps.eachLayer((layer) => {
          maps.removeLayer(layer);
        });

        if (sideBySideControlRef.current) {
          sideBySideControlRef.current.remove();
          sideBySideControlRef.current = null;
        }
      }
    }
  }, [MapData1, maps]);

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
      style={{
        height: "620px",
        width: "95%",
        borderRadius: "20px",
        zIndex: 0,
      }}
      whenReady={(mapes) => {
        mapRef.current = mapes.target;
      }}
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
      {MapData1 && selectedLocation && (
        <div className="title-map">
          <h6 className="title">
            <span className="notranslate">{selectedLocation?.label}</span>
            <br /> ({formattedDateRange})
          </h6>
        </div>
      )}
      <LayersControl position="topleft">{renderParamLayer(indicatorList)}</LayersControl>
      {countyBoundry &&
        MapData2 &&
        MapData1 &&
        countyBoundry?.features.map((item) => {
          if (!_.isEmpty(item)) {
            return (
              <GeoJSON
                key={item?.state_name}
                data={item}
                style={(feat) => style(feat?.properties.positive_cases)}
                onEachFeature={(feat, layer) => {
                  onEachFeature(feat, layer, feat?.properties.positive_cases);
                }}
              />
            );
          }
          return null;
        })}
      <LayersControl position="bottomleft">
        {MapData1 && (
          <CustomLegend
            palette={MapData1?.map_data?.palette}
            units={MapData1?.map_data?.units}
            indicator={indicatorList[0]?.label}
            name="Rainfall"
            max={MapData1?.map_data?.max}
            min={MapData1?.map_data?.min}
          />
        )}
      </LayersControl>
      <LayersControl>
        {MapData1 && !_.isEmpty(MapData2) && selectedLocation && (
          <RvfLegend
            palette={rvfLegendData?.palette}
            units={rvfLegendData?.units}
            name="RVF cases"
          />
        )}
      </LayersControl>
    </MapContainer>
  );
}

export default React.memo(RenderMapContainer);
