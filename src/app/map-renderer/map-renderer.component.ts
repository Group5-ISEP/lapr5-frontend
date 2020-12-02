import { Component, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-map-renderer',
  templateUrl: './map-renderer.component.html',
  styleUrls: ['./map-renderer.component.css']
})
export class MapRendererComponent implements OnInit, OnDestroy {

  props = { stop: false }

  constructor() { }


  ngOnInit(): void {

    let props = this.props

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    var animate = function () {
      if (props.stop === false) {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      }
    };

    animate();

  }

  ngOnDestroy(): void {
    this.props.stop = true
    document.body.lastChild?.remove()
  }

}
