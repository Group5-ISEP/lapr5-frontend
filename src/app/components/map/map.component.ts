import { Component, OnInit, ViewChild } from '@angular/core';
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
import { NodeMapInfoComponent } from '../node-map-info/node-map-info.component';

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

  state = {
    environment3D: false,
    /**
     * Drag state is used by mouse event handlers to check  if user drags while clicking.
     * This is used to check if the user is selecting or dragging.
     */
    dragState: { dragged: false, distance: 0 }
  }

  private map: MapView
  private mapControls: MapControls
  private networkData: NetworkData = { nodes: [], lines: [], paths: [] }

  @ViewChild(NodeMapInfoComponent)
  private nodeInfoComponent: NodeMapInfoComponent;

  private sun: THREE.DirectionalLight;
  sunIntensity: number = 80;
  rotationAngle: number = 20;

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
            x: 0,
            y: 0,
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

    document.getElementById('map').onmousemove = (event) => {
      this.updateDragState(event)
      Tooltip.onMouseMove(event, this.map)
    }
    document.getElementById('map').onmousedown = (event) => { this.state.dragState = { dragged: false, distance: 0 }; }
    document.getElementById('map').onmouseup = (event) => {
      if (this.state.dragState.dragged == false)
        this.select(event)
    }
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

      if (this.state.environment3D) {
        this.sun.intensity = this.sunIntensity / 100

        //rotation angle is used as translation of light and target in opposite ways, looking like sun rotation
        this.sun.target.position.x = this.rotationAngle;
        this.sun.position.x = this.rotationAngle * -70;
        this.sun.position.y = this.rotationAngle * -40;

        // changes the color to more or less yellow
        let green = 255 - Math.abs(this.rotationAngle * 0.7)
        let blue = 255 - Math.abs(this.rotationAngle * 1.5)

        this.sun.color.setRGB(1, green / 255, blue / 255);
      }

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

    this.mapControls.maxZoomLevel = 20; //reset max zoom level
    this.mapControls.minZoomLevel = 10; //reset min zoom level
    this.mapControls.setZoomLevel(15);
    this.mapControls.maxZoomLevel = 15;

    this.state.environment3D = false
    Render.renderNetwork(this.map, this.networkData, this.state.environment3D) //trigger rerender
    this.setLights()
    this.toggleLightControls();
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

    this.mapControls.maxZoomLevel = 20; //reset max zoom level
    this.mapControls.minZoomLevel = 10; //reset min zoom level
    this.mapControls.setZoomLevel(17);
    this.mapControls.minZoomLevel = 16;


    this.state.environment3D = true
    Render.renderNetwork(this.map, this.networkData, this.state.environment3D) //trigger rerender
    this.setLights()
    this.toggleLightControls();
  }

  private toggleLightControls() {
    document.getElementById('light-controls').style.display = this.state.environment3D ? "block" : "none"
  }

  private select(event: MouseEvent) {

    var raycaster = this.map.raycasterFromScreenPoint(event.offsetX, event.offsetY);
    {
      var intersects = raycaster.intersectObjects(this.map.mapAnchors.children, true);
      if (intersects.length > 0) {
        let selected = intersects[0].object;
        if (selected.userData.node) {
          console.log("SELECTED: " + selected.userData.node.shortName)
          this.nodeInfoComponent.node = selected.userData.node;
          this.nodeInfoComponent.updateSchedule();
        }
      }
    }
  }

  private updateDragState(event: MouseEvent) {

    let mouseTravelDistance = Math.sqrt(Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2))

    this.state.dragState.distance += mouseTravelDistance;

    if (this.state.dragState.distance > 10)
      this.state.dragState.dragged = true;

  }

  onLightIntensityChange(value: number) {
    this.sunIntensity = value;
    this.setLights();
  }

  onRotationAngleChange(value: number) {
    this.rotationAngle = value
    this.setLights();
  }

}
