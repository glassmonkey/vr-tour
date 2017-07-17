import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';

class Sample extends React.Component {
    constructor(props, context) {
     super(props, context);

     // construct the position vector here, because if we use 'new' within render,
     // React will think that things have changed when they have not.
     this.cameraPosition = new THREE.Vector3(0, 0, 0);

     this.state = {
       cubeRotation: new THREE.Euler(),
     };

     this._onAnimate = () => {
       // we will get this callback every frame

       // pretend cubeRotation is immutable.
       // this helps with updates and pure rendering.
       // React will be sure that the rotation has now updated.
       this.setState({
         cubeRotation: new THREE.Euler(
           0,
           this.state.cubeRotation.y + 0.01,
           0
         ),
       });

       this.videoImageContext.drawImage(this.img, 0, 0);
       if (this.videoTexture) {
           this.videoTexture.needsUpdate = true;
       }

     };
   }

   componentDidMount() {
       // Create the video element

        // Create canvas element which will hold the current video image (1 image/frame)
        let videoImage = document.createElement( 'canvas' );
        videoImage.width = 2176;
        videoImage.height = 1024;

        let img = new Image();
        img.src = '/view.jpg';

        // Create blank rect if no image
        let videoImageContext = videoImage.getContext( '2d' );
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

        // Create Three texture with canvas as map
        let videoTexture = new THREE.Texture( videoImage );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        // Create Three material with our canvas as texture
        // Canvas image is then updated in the _onAnimate() event, on each frame
        let movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );

        // Keep these elements in memory
        this.videoImageContext = videoImageContext;
        this.videoTexture = videoTexture;
        this.img = img;
        this.refs['screen'].material = movieMaterial;
    }
   render() {
     const width = window.innerWidth; // canvas width
     const height = window.innerHeight; // canvas height

     return (<React3
       mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
       width={width}
       height={height}

       onAnimate={this._onAnimate}
     >
       <scene>
         <perspectiveCamera
           name="camera"
           fov={75}
           aspect={width / height}
           near={0.1}
           far={1000}
           position={this.cameraPosition}
         />
         <ambientLight
         color={0xffffff}
         />
         <mesh
           ref="screen"
           name="screen"
           rotation={this.state.cubeRotation}
         >
           <sphereGeometry
             radius={1}
           />
           <meshBasicMaterial
             color={0x00ff00}
             side={THREE.DoubleSide}
           />
         </mesh>
       </scene>
     </React3>);
   }
}

export default Sample
