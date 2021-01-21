import { GeoCoordinates } from '@here/harp-geoutils';
import { MapAnchor, MapView } from '@here/harp-mapview';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import Node from 'src/app/domain/Node';
import { NetworkData } from './map.component';

let models3d: THREE.Object3D[] = [];

let map: MapView
let data;
let is3d: boolean

export function preloadModel() {
    var loader = new GLTFLoader();
    loader.load("/assets/log_cabin/scene.gltf", (gltf) => {
        const mesh = gltf.scene.children[0];
        mesh.rotation.x = 0;
        mesh.scale.setScalar(0.005)

        models3d.push(mesh);
    })
}

export function renderNetwork(mapView: MapView, networkData: NetworkData, state: boolean) {
    console.log("RENDER CALLED")

    map = mapView;
    data = networkData;
    is3d = state;

    map.mapAnchors.clear()

    drawNodes()
    drawSegments()

    map.update()
}

function drawNodes() {

    data.nodes.forEach(node => {
        //If 3D, load 3D model
        if (is3d) {
            const mesh: MapAnchor<THREE.Object3D> = models3d[0].clone();
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.traverse(child => {
                child.castShadow = true;
                child.receiveShadow = true;
            })

            addNode(mesh, node);

            //If 2D, load basic 2d circle
        } else {
            const geometry = new THREE.CircleGeometry(50);
            const material = new THREE.MeshStandardMaterial({ color: 0x00ff00fe });
            const mesh: MapAnchor<THREE.Mesh> = new THREE.Mesh(geometry, material);
            addNode(mesh, node);
        }

    });
}

function addNode(object: MapAnchor, node: Node) {
    object.anchor = new GeoCoordinates(node.latitude, node.longitude, 3);
    object.renderOrder = 100000;
    object.traverse((child: THREE.Object3D) => {
        child.renderOrder = 100000;
        child.userData.node = node;
    });

    object.userData.node = node;

    map.mapAnchors.add(object)
}

function drawSegments() {

    //TODO: deal with overlapping

    data.paths.forEach(path => {
        let { red, green, blue } = data.lines.find(line => line.code === path.lineCode).colorRGB

        let factor = 1 / 255;
        let color = new THREE.Color(red * factor, green * factor, blue * factor)
        const material = new THREE.LineBasicMaterial({ color: color });

        let segments = path.segmentList
        for (let order = 1; order <= segments.length; order++) {
            const segment = segments.find(seg => seg.order === order)
            const startNode = data.nodes.find(node => node.shortName === segment.startNode)
            const endNode = data.nodes.find(node => node.shortName === segment.endNode)

            //Points for Line geometry
            const points = [];
            //First point of the segment
            points.push(new THREE.Vector3(0, 0, 0));
            //Second point of the segment
            let geop1 = new GeoCoordinates(startNode.latitude, startNode.longitude)
            let geop2 = new GeoCoordinates(endNode.latitude, endNode.longitude)
            let p1 = map.projection.projectPoint(geop1)
            let p2 = map.projection.projectPoint(geop2)
            points.push(new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, 0))

            // geometry of segment from points
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            // Segment mesh
            const line: MapAnchor<THREE.Line> = new THREE.Line(geometry, material);
            line.anchor = new GeoCoordinates(startNode.latitude, startNode.longitude, 2); //attach to start node position
            line.renderOrder = 9999

            map.mapAnchors.add(line)
        }
    });

}