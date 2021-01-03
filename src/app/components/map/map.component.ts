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

    //TODO - optimize render call
    this.nodeService.getNodes().subscribe(
      nodes => {
        this.networkData.nodes = nodes;
        this.renderNetwork()

        this.lineService.getLines().subscribe(
          lines => {
            this.networkData.lines = lines

            lines.forEach(line => {
              this.pathService.getPaths(line.code).subscribe(
                paths => {
                  this.networkData.paths = paths
                  this.renderNetwork()
                }
              )
            });

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
      const geometry = this.state.environment3D ? new THREE.SphereGeometry(50) : new THREE.CircleGeometry(50);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00fe });

      this.networkData.nodes.forEach(node => {
        const mesh: MapAnchor<THREE.Mesh> = new THREE.Mesh(geometry, material);
        mesh.anchor = new GeoCoordinates(node.latitude, node.longitude, 10);
        mesh.renderOrder = 100000;
        this.map.mapAnchors.add(mesh)
      });
    }

    const drawSegments = () => {

      //TODO: deal with overlapping

      this.networkData.paths.forEach(path => {
        let { red, green, blue } = this.networkData.lines.find(line => line.code === path.lineCode).colorRGB

        // material for segments with line color
        //FIXME: color is not the same once THREE.Color object is created
        let color = new THREE.Color(red, green, blue)
        const material = new THREE.LineBasicMaterial({ color: 0x11f0e8 });

        let segments = path.segmentList
        for (let order = 1; order <= segments.length; order++) {
          const segment = segments.find(seg => seg.order === order)
          const startNode = this.networkData.nodes.find(node => node.shortName === segment.startNode)
          const endNode = this.networkData.nodes.find(node => node.shortName === segment.endNode)

          //Points for Line geometry
          const points = [];
          //First point of the segment
          points.push(new THREE.Vector3(0, 0, 0));
          //Second point of the segment
          let geop1 = new GeoCoordinates(startNode.latitude, startNode.longitude)
          let geop2 = new GeoCoordinates(endNode.latitude, endNode.longitude)
          let p1 = this.map.projection.projectPoint(geop1)
          let p2 = this.map.projection.projectPoint(geop2)
          points.push(new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, 0))

          // geometry of segment from points
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          // Segment mesh
          const line: MapAnchor<THREE.Line> = new THREE.Line(geometry, material);
          line.anchor = new GeoCoordinates(startNode.latitude, startNode.longitude, 10); //attach to start node position
          line.renderOrder = 9999

          this.map.mapAnchors.add(line)
        }
      });

    }

    drawNodes()
    drawSegments()

    this.map.update()

  }

}
