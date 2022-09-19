import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@mui/material/Button';

function App() {

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(103.9915);
  const [lat, setLat] = useState(1.3644);
  const [zoom, setZoom] = useState(9);
  const toggleableLayerIds = new Map([
    ['airways-lines-id', 'airways-lines'],
    ['airways-names-id', 'airways-names']
  ])


  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/badman359/cl4ea8yn2000015mapns8ibf5',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
      projection: 'globe'
    });

    map.current.on("load", () => {
      
      // Set default atmosphere style
      map.current.setFog({})

      // Add tileset source for airways data
      map.current.addSource("mapbox-airways", {
        type: "vector",
        url: "mapbox://badman359.4qd1t6d7"
      })

      // Configure layer styles
      map.current.addLayer({
        'id': toggleableLayerIds.get('airways-lines-id'),
        'type': 'line',
        'source': 'mapbox-airways',
        'source-layer': 'airac-airways-cwbplq',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        'paint': {
          'line-color': '#31b99c',
          'line-width': 0.5
        }
      });
      map.current.addLayer({
        'id': toggleableLayerIds.get('airways-names-id'),
        'type': 'symbol',
        'source': 'mapbox-airways',
        'source-layer': 'airac-airways-cwbplq',
        'layout': {
          'text-field': ['get', 'name'],
          'text-anchor': 'top',
          'text-size': 12,
          'symbol-placement': 'line-center',
          'visibility': 'visible'
        },
        'paint': {
          'text-color': '#29AB87',
          'text-opacity': 0.85,
        }
      })
    })
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  function toggleAirways() {
    if (!map.current) return; // wait for map to initialize

    toggleableLayerIds.forEach((value) => {
      map.current.getLayoutProperty(value, 'visibility') === 'visible' ? 
      map.current.setLayoutProperty(value, 'visibility', 'none') : 
      map.current.setLayoutProperty(value, 'visibility', 'visible')
    })
  }

  return (
    <div className="">
      <div className="font-mono z-10 absolute rounded top-0 left-0 m-3 px-3 py-1.5 text-white bg-sky-900">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div className="my-2">
          <Button 
            variant='contained' 
            onClick={() => {
              toggleAirways()
          }}>
            Toggle Airways
          </Button>
        </div>
      </div>
      <div ref={mapContainer} className="h-screen" />
    </div>
  );
}

export default App;
