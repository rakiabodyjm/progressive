/* eslint-disable react/no-unescaped-entities */
/* global google */
import { Typography } from '@material-ui/core'
import mapStyles from '@src/data/map-style.json'
import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface CustomMarker extends google.maps.MarkerOptions {
  infoHtml?: string
  areas?: string[]
}
interface CustomMarkerWIthHTML extends google.maps.MarkerOptions {
  infoHtml: string
  areas: string[]
}

type MarkerOptions = CustomMarker | CustomMarkerWIthHTML

export class GoogleMaps {
  map: google.maps.Map

  constructor(element: HTMLElement, mapParams: google.maps.MapOptions) {
    this.map = new google.maps.Map(element, mapParams)
  }

  /**
   *
   * @param timeout { Number }
   * @param element
   */
  private addMarkerWithTimeout(timeout: number, element: MarkerOptions) {
    setTimeout(() => {
      const marker = new google.maps.Marker({
        position: element.position,
        icon: element.icon,
        title: element.title,
        map: this.map,
        animation: google.maps.Animation.DROP,
      })
      // console.log(marker)

      // const stringLatLng = element.position.toString().replace(/\(|\)/g, '')

      // const infoWindow = new google.maps.InfoWindow({
      //   position:
      // })
      if (element.infoHtml) {
        const infoWindow = {
          title: element.title,
          // contactNumber: element.contact
          infoHtml: element.infoHtml,
        }
        this.addInfoWindow(marker, infoWindow)
      }
    }, timeout)
  }

  private addInfoWindow(marker: google.maps.Marker, details: { title: string; infoHtml: string }) {
    const htmlString = `
    <div>
      <h1 style="font-weight:800;">
        <span>${details.title}</span>
      </h3>
      ${details.infoHtml}
    </div>

    `

    const infoWindow = new google.maps.InfoWindow({
      content: htmlString,
    })

    marker.addListener('click', () => {
      infoWindow.open({
        anchor: marker,
        map: this.map,
        shouldFocus: false,
      })
    })
  }

  /**
   *
   * @param markers
   * Add array of markers to class
   */
  loadMarkers(markers: google.maps.MarkerOptions[]) {
    markers.forEach((marker, index) => {
      const timeout = 250 * (index + 1)
      this.addMarkerWithTimeout(timeout, marker)
    })
  }

  addGroundOverlay(
    imageMap: string,
    imageBounds:
      | {
          north: number
          south: number
          east: number
          west: number
        }
      | google.maps.LatLngBounds
      | google.maps.LatLngBoundsLiteral
  ) {
    const overlay = new google.maps.GroundOverlay(imageMap, imageBounds, {
      opacity: 1,
    })
    overlay.setMap(this.map)
  }
}
const DSPMap = () => {
  const imageMap = '/assets/maps/valenzuela-split-map.png'
  const imageMarker = '/assets/maps/map-marker.png'
  const googlemap = useRef(null)
  const [loadMap, setLoadMap] = useState<null | GoogleMaps>()

  useEffect(() => {
    const loader = new Loader({
      apiKey:
        process.env.NODE_ENV === 'development'
          ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_DEV
          : process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    })

    loader.load().then(() => {
      /**
       * Initialize map before setting it to state
       */
      const localMap = new GoogleMaps(googlemap.current, {
        center: {
          lat: 14.7011,
          lng: 120.983,
        },
        zoom: 13,
        styles: mapStyles,
        disableDefaultUI: true,
      })

      setLoadMap(localMap)
    })
  }, [])

  useEffect(() => {
    if (loadMap) {
      const google = window?.google

      let markers: MarkerOptions[] = [
        {
          position: new google.maps.LatLng(14.728357, 120.992149),
          icon: imageMarker,
          title: 'Ver',
          areas: ['Bignay', 'Punturin', 'Lawang Bato', 'Canumay East'],
        },
        {
          position: new google.maps.LatLng(14.703009, 121.003216),
          icon: imageMarker,
          title: 'Kyrie',
          areas: ['Ugong', 'Parada', 'Mapulang Lupa', 'Bagbagin', 'Paso de Blas'],
        },
        {
          position: new google.maps.LatLng(14.68408, 120.981907),
          icon: imageMarker,
          title: 'Raymond',
          areas: ['Karuhatan', 'Marulas', 'Gen T De Leon'],
        },
        {
          position: new google.maps.LatLng(14.698321, 120.977285),
          icon: imageMarker,
          title: 'Harvey',
          areas: ['Malinta', 'Canumay West', 'Maysan'],
        },

        {
          position: new google.maps.LatLng(14.711049, 120.967378),
          icon: imageMarker,
          title: 'Mira',
          areas: ['Rincon', 'Dalandanan', 'Viente Reales', 'Lingunan'],
        },
        {
          position: new google.maps.LatLng(14.714923, 120.94872),
          icon: imageMarker,
          title: 'Bok',
          areas: [
            'Malanday',
            'Isla',
            'Pasolo',
            'Palasan',
            'Coloong',
            'Wawang Pulo',
            'Balangkas',
            'Bisig',
            'Tagalag',
            'Pariancillo Villa',
            'Poblacion',
            'Polo',
            'Arkong Bato',
          ],
        },
      ]

      /**
       * initialize image bounds
       */
      const imageBounds = {
        north: 14.756729,
        south: 14.668615,
        east: 121.024658,
        west: 120.925579,
      }

      /**
       * Add ground overlay for Valenzuela
       */
      loadMap.addGroundOverlay(imageMap, {
        ...imageBounds,
      })

      /**
       * Add infoHtml to all before loading
       */
      markers = markers.map((ea) => ({
        ...ea,
        infoHtml: `
        <p>
          DSP <span style="font-weight:600;">${ea.title}</span> holds the following areas: 
        </p>
        
        <ul>
          ${ea.areas
            .map((ea) => `<li>${ea}</li>`)
            .toString()
            .replaceAll(',', '')}
        </ul>
        `,
      }))
      /**
       * load markers
       */
      loadMap.loadMarkers(markers)
    }
  }, [loadMap])
  const element = (
    <div
      style={{
        marginTop: 64,
      }}
    >
      <Typography
        style={{
          fontWeight: 700,
        }}
        className="sectionTitle"
        noWrap
        variant="h3"
        component="p"
      >
        DSP's and Their Areas
      </Typography>
      <div
        className="sectionTitleDivider"
        style={{
          height: 2,
          background: 'var(--secondary-dark)',
          width: 320,
          margin: 'auto',
          marginTop: 16,
          marginBottom: 32,
        }}
      />

      <div
        style={{
          position: 'relative',
          height: 720,
          width: '100vw',
          maxWidth: 1200,
          margin: 'auto',
        }}
        id="map"
        ref={googlemap}
      ></div>
    </div>
  )
  return element
}

export default DSPMap
