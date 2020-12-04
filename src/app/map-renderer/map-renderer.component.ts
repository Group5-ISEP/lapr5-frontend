import { Component, OnInit } from '@angular/core';
import { MapControls } from '@here/harp-map-controls';
import { MapView } from '@here/harp-mapview';
import * as THREE from 'three';

//interface to use harp CDN specified in the index.html
declare var harp: any;


//TODO: clean the code

@Component({
  selector: 'app-map-renderer',
  templateUrl: './map-renderer.component.html',
  styleUrls: ['./map-renderer.component.css']
})
export class MapRendererComponent implements OnInit {

  state = { environment3D: false }

  private map: MapView


  private mapControls: MapControls



  constructor() { }


  async ngOnInit() {

    //TODO: async fetch the network info

    await this.initMapView()
    await this.initCameraTarget()
    await this.initMapControls()
    this.initSideBar() //init UI side bar for map controls

    this.setHandlers()
    this.initMapDataSource()
    this.set2DEnvironment() //inicialize 2D environment
  }

  /**
   * MapView initializes a scene with a camera using threejs.
   * Has info about the mapping in geografical coordinates.
   * The scene is renderes in a canvas html element
   */
  private initMapView() {
    const canvas = document.getElementById('map') as HTMLElement;
    this.map = new harp.MapView({
      canvas,
      theme: "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_base.json"
    });
    this.map.resize(canvas.offsetWidth, canvas.offsetHeight);
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
    this.mapControls = new harp.MapControls(this.map); //initializes map controls

  }

  /**
   * Sets the UI side bar to control map view
   */
  private initSideBar(): void {

    //map controls must be loaded already
    if (!this.mapControls) {
      return
    }

    const canvas = document.getElementById('map') as HTMLElement;
    const ui = new harp.MapControlsUI(this.mapControls); //creates harp defaul ui side bar for map controls
    canvas.parentElement.appendChild(ui.domElement); //append side bar to the component element

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
  }

  private async setHandlers() {
    window.onresize = () => this.map.resize(window.innerWidth, window.innerHeight);
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
    //TODO: implement fetch network data
    console.log("FETCHED NETWORK DATA")
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

    this.renderNetwork() //trigger rerender
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
    this.renderNetwork() //trigger rerender
  }

  private renderNetwork() {
    console.log("RENDER CALLED")
    //TODO: implement render
  }

}
