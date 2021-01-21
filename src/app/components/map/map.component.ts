import { Component, OnInit } from '@angular/core';
import { MapControls, MapControlsUI } from '@here/harp-map-controls';
import { MapView } from '@here/harp-mapview';
import Line from 'src/app/domain/Line';
import Node from 'src/app/domain/Node';
import Path from 'src/app/domain/Path';
import { LineService } from 'src/app/services/line.service';
import { NodeService } from 'src/app/services/node.service';
import { PathService } from 'src/app/services/path.service';
import { Theme } from "@here/harp-datasource-protocol";

import * as Tooltip from './tooltip';
import * as Render from './render';

//interface to use harp CDN specified in the index.html
declare var harp: any;

export interface NetworkData {
  nodes: Node[],
  lines: Line[],
  paths: Path[]
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  state = { environment3D: false }

  private map: MapView
  private mapControls: MapControls
  private networkData: NetworkData = { nodes: [], lines: [], paths: [] }

  private sun: THREE.DirectionalLight;

  constructor(
    private nodeService: NodeService,
    private lineService: LineService,
    private pathService: PathService
  ) { }


  ngOnInit() {
    Render.preloadModel();
    this.initMapView()
    this.initCameraTarget()
    this.initMapControls()
    this.initSideBar() //init UI side bar for map controls
    this.setHandlers()
    this.initMapDataSource()
    this.initNetworkData()
    this.set2DEnvironment() //inicialize 2D environment
  }

  /**
   * MapView initializes a scene with a camera using threejs.
   * Has info about the mapping in geografical coordinates.
   * The scene is renderes in a canvas html element
   */
  private initMapView() {
    const canvas = document.getElementById('map') as HTMLCanvasElement;

    const theme: Theme = {
      extends: "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_base.json",
      lights: [
        {
          type: "ambient",
          color: "#ffffff",
          name: "ambientLight",
          intensity: 0.9
        },
        {
          type: "directional",
          color: "#ffffff",
          name: "light1",
          intensity: 1,
          // Will be overriden immediately, see `update`
          direction: {
            x: 1,
            y: 0.01,
            z: -1
          },
          castShadow: false
        }
      ],
      definitions: {
        // Opaque buildings
        defaultBuildingColor: { value: "#EDE7E1FF" }
      }
    };
    this.map = new harp.MapView({
      canvas,
      theme,
      enableShadows: true
    });
    this.resizeMap()

  }

  /**
   * Resize map
   */
  private resizeMap() {
    let container = document.getElementById("map-container");
    this.map.resize(container.offsetWidth, container.offsetHeight);
  }

  /**
   * Sets the initial point in the map for the camera to point at
   */
  private initCameraTarget() {
    // center the camera to Porto
    this.map.lookAt({
      target: new harp.GeoCoordinates(41.157944, -8.629105),
      zoomLevel: 15,
      tilt: 0,
    });
  }

  /**
   * Sets the map controls
   * provides basic map-related building blocks to interact with the map 
   */
  private initMapControls() {
    this.mapControls = new MapControls(this.map); //initializes map controls
  }

  /**
   * Sets the UI side bar to control map view
   */
  private initSideBar(): void {

    //map controls must be loaded already
    if (!this.mapControls) {
      return
    }

    const container = document.getElementById('map-container') as HTMLElement;
    const ui = new MapControlsUI(this.mapControls); //creates harp defaul ui side bar for map controls
    container.appendChild(ui.domElement); //append side bar to the component element

    let toggleTiltButton = document.getElementById("harp-gl_controls_tilt-button-ui")
    let buttonDiv = toggleTiltButton.parentElement

    // creates a new button that will replace the preset map controls tilt toggle button
    let newButton = document.createElement("button")
    newButton.innerText = this.state.environment3D ? "3D" : "2D" //initializes button text according to initial state
    newButton.onclick = () => {
      newButton.innerText = this.state.environment3D ? "2D" : "3D" // switch button text
      this.state.environment3D ? this.set2DEnvironment() : this.set3DEnvironment() //switch the environment
      console.log(`Changed to ${newButton.innerText}`)
    }

    newButton.className = "harp-gl_controls-button harp-gl_controls_button-bottom" //set CSS class

    buttonDiv.replaceChild(newButton, toggleTiltButton)

    buttonDiv.parentElement.style.removeProperty("right");
    buttonDiv.parentElement.style.left = "5px";
  }

  /**
   * Sets all handlers
   */
  private async setHandlers() {
    window.onresize = () => this.resizeMap();
    document.getElementById('map').onmousemove = (event) => { Tooltip.onMouseMove(event, this.map) }
  }

  /**
   * Fetches map data (world map representation and more)
   */
  private initMapDataSource() {
    const omvDataSource = new harp.VectorTileDataSource({
      authenticationCode: '0mOEgj3s-lFUiNSrpnbfR67oXfesy5vF-G35AezEoO8',
    });
    this.map.addDataSource(omvDataSource);
  }

  /**
   * Fetches network data (nodes, lines, paths, etc.)
   */
  private initNetworkData() {
    console.log("FETCHED NETWORK DATA")
    /**
     * Each fetch requests rendering so that it doesnt have to wait for the whole
     * data to be fetched, it renders as each part is fetched
     * 
     * The fetches are chained
     */

    //TODO - optimize render call
    this.nodeService.getNodes().subscribe(
      nodes => {
        this.networkData.nodes = nodes;
        Render.renderNetwork(this.map, this.networkData, this.state.environment3D) //trigger rerender

        this.lineService.getLines().subscribe(
          lines => {
            this.networkData.lines = lines

            lines.forEach(line => {
              this.pathService.getPaths(line.code).subscribe(
                paths => {
                  this.networkData.paths.push(...paths);
                  Render.renderNetwork(this.map, this.networkData, this.state.environment3D) //trigger rerender
                }
              )
            });

          })
      })
  }
  /**
   * Sets light properties
   */
  private setLights() {

    //sets light in a accessible variable
    if (!this.sun)
      this.map.scene.traverse(child => {
        if (child.type == "DirectionalLight") {
          this.sun = child as THREE.DirectionalLight
        }
      })
    if (this.sun) {
      this.sun.castShadow = this.state.environment3D ? true : false
    }

    this.map.update()
  }


  /**
   * Sets the tilt to 0, which sets a vertical view
   * Orbiting is disabled
   * 
   * Triggers rerender of network to adjust to new environment
   * */
  private set2DEnvironment() {
    this.map.tilt = 0
    this.mapControls.tiltEnabled = false

    this.state.environment3D = false
    Render.renderNetwork(this.map, this.networkData, this.state.environment3D) //trigger rerender
    this.setLights()
  }

  /**
   * Sets default tilt angle and max tilt angle
   * Enables orbiting
   * 
   * Triggers rerender of network to adjust to new environment
   */
  private set3DEnvironment() {
    this.map.tilt = 30 //set tilt to 30 degrees
    this.mapControls.maxTiltAngle = 60
    this.mapControls.tiltEnabled = true

    this.state.environment3D = true
    Render.renderNetwork(this.map, this.networkData, this.state.environment3D) //trigger rerender
    this.setLights()
  }



}
