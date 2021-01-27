import { GeoCoordinates } from '@here/harp-geoutils';
import { MapAnchor, MapView } from '@here/harp-mapview';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import Node from 'src/app/domain/Node';
import { NetworkData } from './map.component';
import Segment from 'src/app/domain/Segment';


//Data structure helper for building segments
interface LineSegment {
    lineCode: string,
    segment: Segment
}

let models3d: THREE.Object3D[] = [];

let map: MapView
let data: NetworkData;
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

    let matrix = getMatrix();
    console.log(matrix)

    Object.keys(matrix).forEach(node1 => {
        Object.keys(matrix[node1]).forEach(node2 => {

            let coeficient = 0

            matrix[node1][node2].forEach((obj: LineSegment) => {

                let { red, green, blue } = data.lines.find(line => line.code === obj.lineCode).colorRGB

                let factor = 1 / 255;
                let color = new THREE.Color(red * factor, green * factor, blue * factor)
                const material = new THREE.LineBasicMaterial({ color: color });

                const startNode = data.nodes.find(node => node.shortName === obj.segment.startNode)
                const endNode = data.nodes.find(node => node.shortName === obj.segment.endNode)

                //Points for Line geometry
                const points = [];
                //First point of the segment
                let o1 = 0
                let o2 = 0
                //Second point of the segment
                let geop1 = new GeoCoordinates(startNode.latitude, startNode.longitude)
                let geop2 = new GeoCoordinates(endNode.latitude, endNode.longitude)
                let p1 = map.projection.projectPoint(geop1)
                let p2 = map.projection.projectPoint(geop2)
                let relativePointX = p2.x - p1.x
                let relativePointY = p2.y - p1.y

                //Dealing with overlapping
                let r = Math.sqrt(Math.pow(relativePointX, 2) + Math.pow(relativePointY, 2))
                let cosBeta = - relativePointY / r
                let sinBeta = relativePointX / r
                let d = 15
                o1 = o1 + coeficient * d * cosBeta
                o2 = o2 + coeficient * d * sinBeta
                relativePointX = relativePointX + coeficient * d * cosBeta
                relativePointY = relativePointY + coeficient * d * sinBeta

                points.push(new THREE.Vector3(o1, o2, 0));
                points.push(new THREE.Vector3(relativePointX, relativePointY, 0))

                //Update Coeficient
                if (coeficient <= 0)
                    coeficient = 1 - coeficient
                else
                    coeficient = -coeficient

                // geometry of segment from points
                const geometry = new THREE.BufferGeometry().setFromPoints(points);

                // Segment mesh
                const line: MapAnchor<THREE.Line> = new THREE.Line(geometry, material);
                line.anchor = new GeoCoordinates(startNode.latitude, startNode.longitude, 2); //attach to start node position
                line.renderOrder = 9999

                map.mapAnchors.add(line)

            })
        })
    })
}

function getMatrix() {
    let matrix = new Object();

    data.paths.forEach(path => {
        let segments = path.segmentList
        for (let order = 1; order <= segments.length; order++) {
            const segment = segments.find(seg => seg.order === order)

            //The segments on the path are normalized to 'to', if 'from', start and end node switched
            // This is so ONE segment represents BOTH TO AND FROM
            let node1 = path.direction.toLocaleLowerCase() == 'to' ? segment.startNode : segment.endNode
            let node2 = path.direction.toLocaleLowerCase() == 'to' ? segment.endNode : segment.startNode

            if (matrix[node1] != undefined) {
                if (matrix[node1][node2] != undefined) {
                    //Only adds segment to matrix if a segment for the line isnt there
                    let segmentList = matrix[node1][node2]
                    let findSegment = segmentList.find(obj => obj.lineCode == path.lineCode)
                    if (findSegment == null) {
                        let newSeg: LineSegment = { lineCode: path.lineCode, segment: segment }
                        matrix[node1][node2].push(newSeg)
                    }
                } else {
                    matrix[node1][node2] = []
                    let newSeg: LineSegment = { lineCode: path.lineCode, segment: segment }
                    matrix[node1][node2].push(newSeg)
                }
            } else {
                matrix[node1] = {}
                matrix[node1][node2] = []
                let newSeg: LineSegment = { lineCode: path.lineCode, segment: segment }
                matrix[node1][node2].push(newSeg)
            }

        }
    });

    return matrix
}