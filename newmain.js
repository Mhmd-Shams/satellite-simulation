// THREE JS
import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

// Textures 
const textureLoader = new THREE.TextureLoader()
const partical_textrure = textureLoader.load('/textures/particles/9.png')


//planet texture
const earth = new THREE.TextureLoader().load('/planets/earth.jpg')
const mars = new THREE.TextureLoader().load('/planets/mars.png')
const jupiter =  new THREE.TextureLoader().load('/planets/jupiter.jpg')
const venus   =  new THREE.TextureLoader().load('/planets/venus.jpg')


//canvas
const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene();

//Light
var light = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(light);


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 80000);
camera.position.z = 4100;


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true


// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
// renderer.setClearColor(0xffffff, 1);

//loader
const loader = new GLTFLoader();

var SateModel;
loader.load('models/s6laaaaay.glb', function(glb) {
        SateModel = glb.scene;
        SateModel.scale.set(30, 30, 30)
        scene.add(SateModel);
        SateModel.position.set(0, 0, 0)
        SateModel.rotateX(45)
    },
    undefined,
    function(error) {
        console.error(error);
    });
window.onload = () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Satellite
const geometry = new THREE.SphereGeometry(15, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
var satellite = new THREE.Mesh(geometry, material);
satellite.scale.set(10, 10, 10);
satellite.position.set(0, 0, 3000);
//scene.add(satellite);


// Earth
const geometry2 = new THREE.SphereGeometry(30, 32, 16);
const material2 = new THREE.MeshBasicMaterial({ map: earth });
var Earth = new THREE.Mesh(geometry2, material2);
Earth.scale.set(10, 10, 10)
Earth.position.set(0, 0, 0)
scene.add(Earth)


//particals
const particalsGeometry = new THREE.BufferGeometry(1, 32, 32)

// stars
const count = 5000 //to increase stars
const positions = new Float32Array(count * 3)

// const colors = new Float32Array(count*3)
for (let i = 0; i < count; i++) {
    positions[i] = (Math.random() - 0.5) * 200000 //to increase distance between stars
        // colors[i]   =Math.random()
}

particalsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// particalsGeometry.setAttribute(
//     'color',
//     new THREE.BufferAttribute(color,3)
// )
const particalsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    color: 'white',
    map: partical_textrure
})
particalsMaterial.alphaTest = 0.001
    //  particalsMaterial.depthTest=false
particalsMaterial.depthWrite = false
particalsMaterial.blending = THREE.AdditiveBlending
    // particalsMaterial.vertexColors = true

//points
const particals = new THREE.Points(particalsGeometry, particalsMaterial)
    // particals.scale.set()
scene.add(particals)

var masses ={
    Earth:5.97219 *10000000000000,
    mars:     5*10000000000000,
    jupiter:1.898*Math.pow(10,16),
    venus : 4.8 * 10000000000000
}


var planet = {
    Earth: 'earth',
    Mars: 'mars',
    Jupiter:'jupiter',
    Venus: 'venus'
}



// degug GUI
const gui = new dat.GUI({ closed: false, width: 300, color: 'white' });
//gui.hide(); // enter H to show controls
const EarthFolder = gui.addFolder('Earth');
EarthFolder.open();
const SatelliteFolder = gui.addFolder('Satellite');
SatelliteFolder.open();
const parameters = {

    Gravity_constant: (6.6743),
    mass_earth: (5.97219 * 10000000000000),
    airDensity: (0.0000000001322 / (2.0769 * 2.73)) * 100000000,

    // Satellite
    mass_satellite: 2500,
    visible: false,
    transfer: 1,
    timeDiff : 0.2,
    planet:planet.Earth
}
EarthFolder.add(parameters, 'mass_earth')
    .onChange(() => {
        EarthMassGravityConst = parameters.mass_earth 
    })
EarthFolder.add(parameters, 'Gravity_constant')
    .onChange(() => {
        EarthMassGravityConst = parameters.Gravity_constant * 100000000000
    })

EarthFolder.add(parameters, 'airDensity').min(0.5).max(5.5)
    .onFinishChange(() => {
        airDensity = parameters.airDensity
    })

    EarthFolder.add(parameters,'planet').options(planet).onChange(()=>{

        if(parameters.planet=='mars')
        {   
            material2.map = mars
            parameters.mass_earth = masses.mars
            EarthMassGravityConst = parameters.mass_earth
        }
    
        else if(parameters.planet=='earth')
        {
            material2.map = earth
            parameters.mass_earth = masses.Earth
            EarthMassGravityConst = parameters.mass_earth
        }
        else if(parameters.planet=='venus')
        {
            material2.map = venus
            parameters.mass_earth = masses.venus
            EarthMassGravityConst =parameters.mass_earth
        }
        else
        {
            material2.map = jupiter
            parameters.mass_earth=masses.jupiter
            // EarthMassGravityConst = parameters.mass_earth
            EarthMassGravityConst = parameters.Gravity_constant*parameters.mass_earth

        }
        })



SatelliteFolder.add(parameters, 'mass_satellite')
    .onChange(() => {
        massofsatellite = parameters.mass_satellite
    })

SatelliteFolder.add(parameters, 'transfer').min(1).max(5).step(0.5)
    .onFinishChange(() => {
        transfer = parameters.transfer
        curo = curVelocity.clone()
        curo.multiplyScalar(speed * transfer);
        curVelocity.add(curo)
    })
SatelliteFolder.add(parameters, 'visible')
    .onChange(() => {
        visible = parameters.visible
    })

    SatelliteFolder.add(parameters,'timeDiff')
    .onChange(()=>{
        timeDiff=parameters.timeDiff
    })
    
    // Delta time
    let timeDiff = parameters.timeDiff;

// Consts
// air density = p / R*T:p for absolute pressure, R for specific gas constant,T for absolute temperature
// R_helium= 2.0769, R_hydrogen= 4.124
const speed = 0.04;
const dragCoefficient = 2.2;
const satelitteArea = 0.0255744
let Gravity_constant = parameters.Gravity_constant
var EarthMassGravityConst =  parameters.mass_earth
    // console.log('g = ',parameters.Gravity_constant)
    // console.log('earth_mass = ',parameters.mass_earth)
    // let mass_earth = (5.97219 * 10000000000000)
let airDensity = parameters.airDensity
console.log(airDensity)
let massofsatellite = 2500;
var gravity = new THREE.Vector3();
let b_is_pressed = false
let z_is_pressed = false
let x_is_pressed = false
let visible = false
let transfer = 1

// starting Velocity
var curVelocity = new THREE.Vector3(300, 100, 0);
var curo = curVelocity.clone()





// Drag force : not stable
function DragForce(velocity) {
    var force = (0.5 * airDensity * dragCoefficient * satelitteArea * velocity * velocity) / (massofsatellite * (Earth.position.clone().sub(satellite.position).length()))
    if (isNaN(force))
        force = 0
    if (force != 0)
        force = force * -1 * velocity / Math.abs(velocity);
    //console.log(force)
    return force;
}


// GravityForce: The farther the satellite on Earth the less Fg value
function GravityForce() {
    var force = EarthMassGravityConst*Gravity_constant * massofsatellite / (Earth.position.clone().sub(satellite.position).lengthSq())
    force = force / 1000000;
    if (isNaN(force))
        force = 0
        // console.log(force)
    return force
}


// Calculate the new acceleration based on equation F=ma
function calculate() {
    var Fg = GravityForce()

    // the vactor of the garvity * Fg
    gravity = Earth.position.clone().sub(satellite.position).normalize().multiplyScalar(Fg);

    if (isNaN(gravity.x))
        gravity.x = 0

    if (isNaN(gravity.y))
        gravity.y = 0

    if (isNaN(gravity.z))
        gravity.z = 0

    var accX = (gravity.x + DragForce(curVelocity.x)) / massofsatellite;

    var accY = (gravity.y + DragForce(curVelocity.y)) / massofsatellite;

    var accZ = (gravity.z + DragForce(curVelocity.z)) / massofsatellite;

    // checking on the values of the new acceleration
    if (isNaN(accX))
        accX = 0
    if (isNaN(accY))
        accY = 0
    if (isNaN(accZ))
        accZ = 0

    var acceleration = new THREE.Vector3(accX, accY, accZ)

    newposition(acceleration)
}



function find_rotataion_angle(r)
    {

        var r_max=3000.8791542168474 , r_min = 1811.0177460414375
        var semi_major_axis = ((r_max+r_min)/2)*parameters.transfer
        var e = 0.555
        var theta = Math.acos((((semi_major_axis*(1-Math.pow(e,2)))/r)-1)/e)
        return theta+0.3
    }

var angle

// function for calculating the new position based on the current acceleration
function newposition(acceleration) {

    const points = [];
    points.push(new THREE.Vector3(satellite.position.x, satellite.position.y, satellite.position.z));

    curVelocity.x = curVelocity.x + acceleration.x * timeDiff;
    curVelocity.y = curVelocity.y + acceleration.y * timeDiff;
    curVelocity.z = curVelocity.z + acceleration.z * timeDiff;

    satellite.position.x = satellite.position.x + curVelocity.x * timeDiff;
    satellite.position.y = satellite.position.y + curVelocity.y * timeDiff;
    satellite.position.z = satellite.position.z + curVelocity.z * timeDiff;



    SateModel.position.set(satellite.position.x, satellite.position.y, satellite.position.z)

    if(false)
    {angle = find_rotataion_angle(Earth.position.clone().sub(satellite.position).length())
 
    if(SateModel.position.x>0 && SateModel.position.y>0)
    SateModel.rotation.set(0,0,angle)
    else if(SateModel.position.x>0 && SateModel.position.y<0)
    SateModel.rotation.set(0,0,angle-0.6)
    else 
    SateModel.rotation.set(0,0,-angle)}


    if (visible) {
        points.push(new THREE.Vector3(satellite.position.x, satellite.position.y, satellite.position.z));

        const material = new THREE.PointsMaterial({ color: 0x0000ff });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);

        scene.add(line);
    }

}


// Boost activate : when you press 'S' the speed of the satellite increase
document.addEventListener("keydown", onDocumentKeyDown, false);


function onDocumentKeyDown(event) {
    curo = curVelocity.clone()

    var keyCode = event.which;
    if (keyCode == 83) {
        curo.multiplyScalar(speed * timeDiff);
        curVelocity.add(curo)
        console.log('boost activeated')
        console.log(speed * timeDiff)

    }
};


function Thrust1(thrust) {

    // for(let counter =0;counter<times;counter++){
    if (!b_is_pressed) {
        curo = curVelocity.clone()
        curo.multiplyScalar(speed * timeDiff)
        curVelocity.add(curo)
        console.log(curo)
        b_is_pressed = true
    }

    // }
}



// Display The Values on the Screen
const text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.width = "100";
text2.style.height = "100";
text2.style.backgroundColor = "white";
text2.style.top = "10" + 'px';
text2.style.left = "10" + 'px';
text2.style.fontSize = "20px";
text2.hidden = false;
document.body.appendChild(text2);
let generateTextOnScreen = () => {
        let text = 'Mass of Satellite: ' + massofsatellite;
        text += '<br>';
        text += 'Mass of Earth: ' + parameters.mass_earth;
        text += '<br>';
        text += 'Gravity_constant: ' +  parameters.Gravity_constant;
    text += '<br>';
        text += 'Satellite position in x: ' + satellite.position.x;
        text += '<br>';
        text += 'Satellite position in y: ' + satellite.position.y;
        text += '<br>';
        text += 'Satellite position in z: ' + satellite.position.z;
        text += '<br>';
        text += 'Satellite speed in x: ' + curVelocity.x;
        text += '<br>';
        text += 'Satellite speed in y: ' + curVelocity.y;
        text += '<br>';
        text += 'Satellite speed in z: ' + curVelocity.z;
        text += '<br>';
        text += 'Thrust: ' + parameters.transfer;
        text += '<br>';
        text += 'timeDiff: ' +  parameters.timeDiff ;
    text += '<br>';
        text2.innerHTML = text;
    }
    // animate
function animate() {
    setTimeout(animate, 20);
    if (SateModel) {
        if (Earth.position.clone().sub(satellite.position).length() < 70000 && Earth.position.clone().sub(satellite.position).length() > 496) {

            calculate();

            /*if (parameters.mass_earth > (5.97219 * 10000000000000) || parameters.Gravity_constant > (6.6743)) {
                curVelocity.set(0, 0, 0)
                SateModel.position.set(0, 0, 0)
            }

            console.log('v = ', curVelocity)*/
            // console.log(Earth.position.clone().sub(satellite.position).length())

        }

      //  if (parameters.Gravity_constant > (6.6743)) {
        //    SateModel.position.set(0, 0, 0)
        //}
        generateTextOnScreen();
        // Update controls
        controls.update()
        renderer.render(scene, camera);

    }

}

animate();