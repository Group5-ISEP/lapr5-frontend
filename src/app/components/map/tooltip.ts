import * as THREE from 'three';
import { MapView } from '@here/harp-mapview';


// this will be 2D coordinates of the current mouse position, [0,0] is middle of the screen.
var mouse = new THREE.Vector2();

var latestMouseProjection: THREE.Vector3; // this is the latest projection of the mouse on object (i.e. intersection with ray)
var hoveredObj: THREE.Object3D; // this objects is hovered at the moment

var clientMousePos = new THREE.Vector2(); //used for tooltip position

var map: MapView;

export function onMouseMove(event: MouseEvent, mapview: MapView) {
    map = mapview;

    updateMouseCoords(event);

    latestMouseProjection = undefined;
    hoveredObj = undefined;
    handleManipulationUpdate();
}

// Following two functions will convert mouse coordinates
// from screen to three.js system (where [0,0] is in the middle of the screen)
function updateMouseCoords(event: MouseEvent) {

    mouse.x = event.offsetX
    mouse.y = event.offsetY

    clientMousePos.x = event.clientX;
    clientMousePos.y = event.clientY;
}

function handleManipulationUpdate() {

    var raycaster = map.raycasterFromScreenPoint(mouse.x, mouse.y);
    {
        var intersects = raycaster.intersectObjects(map.mapAnchors.children);
        if (intersects.length > 0) {
            latestMouseProjection = intersects[0].point;
            hoveredObj = intersects[0].object;
        }
    }

    if (latestMouseProjection)
        showTooltip();
    else
        hideTooltip();
}

// This will move tooltip to the current mouse position and show it by timer.
function showTooltip() {
    var tooltipElement = document.getElementById("tooltip");

    if (tooltipElement && latestMouseProjection) {

        if (hoveredObj.userData.node) {
            tooltipElement.style.display = "block";
            tooltipElement.style.opacity = "0.0";

            var tootipWidth = tooltipElement.offsetWidth;
            var tootipHeight = tooltipElement.offsetHeight;

            tooltipElement.style.left = `${clientMousePos.x - tootipWidth / 2}px`;
            tooltipElement.style.top = `${clientMousePos.y - tootipHeight - 20}px`;

            tooltipElement.textContent = hoveredObj.userData.node.shortName;

            setTimeout(function () {
                tooltipElement.style.opacity = "1.0";
            }, 25);
        }

    }
}

// This will immediately hide tooltip.
function hideTooltip() {
    var divElement = document.getElementById("tooltip");
    if (divElement) {
        divElement.style.display = "none";
    }
}