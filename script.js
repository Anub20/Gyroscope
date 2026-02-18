let scene, camera, renderer;
let gyroGroup, spinDisk, precessionGroup, trail;
let couple = 0;
let motionSpeed = 0;

init();
animate();
function init() {
    // Scene
    scene = new THREE.Scene();
scene.background = new THREE.Color(0xd1d5db);
    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // Lights
    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));
    // Master group for precession
    precessionGroup = new THREE.Group();
    scene.add(precessionGroup);
    // Gyro group (tilted)
    gyroGroup = new THREE.Group();
    precessionGroup.add(gyroGroup);
    // 1️⃣ OUTER GREEN RING
    const outerRingGeo = new THREE.TorusGeometry(2, 0.08, 32, 100);
    const outerRingMat = new THREE.MeshStandardMaterial({
        color: 0x7CFC00,
        emissive: 0x224400
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    gyroGroup.add(outerRing);
    gyroGroup.position.y = 1;
    gyroGroup.position.x = 2;  
    // 2️⃣ BLUE DISK
    const diskGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 64);
    const diskMat = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    emissive: 0x112244,
    metalness: 0.5,
    roughness: 0.3
});
    spinDisk = new THREE.Mesh(diskGeo, diskMat);
    spinDisk.rotation.z = Math.PI / 6; // tilt
    gyroGroup.add(spinDisk);
    // 3️⃣ SILVER INNER RING
    const innerRingGeo = new THREE.TorusGeometry(1.25, 0.05, 16, 100);
    const innerRingMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 1,
        roughness: 0.2
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.z = Math.PI / 6;
    gyroGroup.add(innerRing);
    // 4️⃣ PURPLE AXIS ROD
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 6, 32);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xaa00ff });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.position.y = 0;
    gyroGroup.add(rod);
    // Top ball
    const ballGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const topBall = new THREE.Mesh(
        ballGeo,
        new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    topBall.position.y = 3;
    gyroGroup.add(topBall);
    // Bottom ball
    const bottomBall = new THREE.Mesh(
        ballGeo,
        new THREE.MeshStandardMaterial({ color: 0xffaa00 })
    );
    bottomBall.position.y = -3;
    gyroGroup.add(bottomBall);
    // Tilt whole gyroscope
    gyroGroup.rotation.z = Math.PI / 6;
    window.addEventListener("resize", onWindowResize);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function calculate() {
    let I = parseFloat(document.getElementById("I").value) || 0;
    let omega = parseFloat(document.getElementById("omega").value) || 0;
    let Omega = parseFloat(document.getElementById("Omega").value) || 0;

    couple = I * omega * Omega;
    document.getElementById("output").value = couple.toFixed(2);
}
function applyMotion() {
    motionSpeed = Math.abs(couple) * 0.001;
}
function stopMotion() {
    motionSpeed = 0;
}
function resetMotion() {
    motionSpeed = 0;
    // Reset rotations
    spinDisk.rotation.y = 0;
    precessionGroup.rotation.y = 0;
    // Clear inputs and output
    document.getElementById("I").value = "";
    document.getElementById("omega").value = "";
    document.getElementById("Omega").value = "";
    document.getElementById("output").value = "";
    couple = 0;
}
function animate() {
    requestAnimationFrame(animate);
    if (motionSpeed > 0) {
        // Spin of disk (ω)
        spinDisk.rotation.y += motionSpeed * 20;
        // Precession (Ω)
        precessionGroup.rotation.y += motionSpeed;
    }
    renderer.render(scene, camera);
}
