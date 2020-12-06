import { Component, OnInit } from '@angular/core';
import { GeoCoordinates } from '@here/harp-geoutils';
import { MapControls } from '@here/harp-map-controls';
import { MapAnchor, MapView } from '@here/harp-mapview';
import Line from 'src/app/domain/Line';
import Node from 'src/app/domain/Node';
import Path from 'src/app/domain/Path';
import { LineService } from 'src/app/services/line.service';
import { NodeService } from 'src/app/services/node.service';
import { PathService } from 'src/app/services/path.service';
import * as THREE from 'three';

import { distanceBetween2GeoPoints, inclinationOfLineBetween2Points, rgbToHex } from './utils';

//interface to use harp CDN specified in the index.html
declare var harp: any;

interface NetworkData {
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

  constructor(
    private nodeService: NodeService,
    private lineService: LineService,
    private pathService: PathService
  ) { }


  ngOnInit() {

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

  /**
   * Sets all handlers
   */
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
    console.log("FETCHED NETWORK DATA")
    /**
     * Each fetch requests rendering so that it doesnt have to wait for the whole
     * data to be fetched, it renders as each part is fetched
     * 
     * The fetches are chained
     */

    this.nodeService.getNodes().subscribe(
      nodes => {
        this.networkData.nodes = nodes;
        console.log("fetched:" + nodes)
        console.log(nodes[0])
        console.log(nodes[1])
        console.log(nodes[2])
        this.renderNetwork()

        this.lineService.getLines().subscribe(
          lines => {
            console.log("lines fetched")
            this.networkData.lines = lines

            this.pathService.getPaths().subscribe(
              paths => {
                console.log("paths fetched")
                this.networkData.paths = paths

                this.renderNetwork()
              }
            )
          })
      })
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


  /**
   * ONLY RENDERS 2D FOR NOW!!!!!!!!!!
   */
  private renderNetwork() {
    console.log("RENDER CALLED")

    this.map.mapAnchors.clear()

    const drawNodes = () => {
      const geometry = new THREE.CircleGeometry(50);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00fe });

      //FIXME: nodes in fetch are ok but here they are undefined
      console.log("NODES:" + this.networkData.nodes[1])

      this.networkData.nodes.forEach(node => {
        console.log("DEBIG")
        const cube: MapAnchor<THREE.Mesh> = new THREE.Mesh(geometry, material);
        cube.anchor = new GeoCoordinates(node.latitude, node.longitude, 10);
        cube.renderOrder = 100000;
        this.map.mapAnchors.add(cube)
      });
    }

    const drawSegments = () => {

      //TODO: deal with overlapping

      this.networkData.paths.forEach(path => {
        let { red, green, blue } = this.networkData.lines.find(line => line.code === path.lineCode).colorRGB

        let hexColor = rgbToHex(red, green, blue)

        let segments = path.segmentList
        console.log("LENGTH:" + segments.length)
        for (let order = 1; order <= segments.length; order++) {
          const segment = segments.find(seg => seg.order === order)
          const startNode = this.networkData.nodes.find(node => node.shortname === segment.startNode) //FIXME - NOT FINDING THE STARTNODE AND ENDNODE
          const endNode = this.networkData.nodes.find(node => node.shortname === segment.endNode)

          const distance = distanceBetween2GeoPoints(startNode.latitude, startNode.longitude, endNode.latitude, endNode.longitude)
          const angle = inclinationOfLineBetween2Points(startNode.latitude, startNode.longitude, endNode.latitude, endNode.longitude)

          console.log("distance:" + distance)
          console.log("angle:" + angle)

          //Points
          const points = [];
          //First point of the segment
          points.push(new THREE.Vector3(0, 0, 0));
          //Second point of the segment
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance
          console.log("x:" + x)
          console.log("y:" + y)
          points.push(new THREE.Vector3(x, y, 0))

          // geometry of segment from points
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          // material for segment with line color
          const material = new THREE.LineBasicMaterial({ color: hexColor });

          //FIXME: segments not being in the right position
          // Segment mesh
          const line: MapAnchor<THREE.Line> = new THREE.Line(geometry, material);
          line.anchor = new GeoCoordinates(startNode.latitude, startNode.longitude, 10); //attach to start node position
          line.renderOrder = 9999

          this.map.mapAnchors.add(line)
        }
      });

    }

    drawNodes()
    //TODO:drawSegments()

    this.map.update()

  }

}
