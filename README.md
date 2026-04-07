# OrbitLab
<div align="center">

**OrbitLab is a modular, web-based orbital mechanics simulator built entirely with vanilla JavaScript. It allows users to launch spacecraft, observe gravitational interactions, and visualize accurate orbital trajectories in an interactive canvas environment.**

</div>

## Features

*   **Planetary System Engine:**
    *   **Accurate Physics:** Simulates gravitational pulls from a central star (Sun) and various planets (Earth, Mars, Jupiter).
    *   **Dynamic Orbits:** Real-time updates of planetary positions and orbital velocities for moons and satellites.
*   **Spacecraft Launch System:**
    *   **Customizable Launches:** Configure launch angle and speed to reach chosen targets.
    *   **Flight Controls:** Use WASD or Arrow Keys for active thrusting during flight (fuel is limited).
    *   **Trajectory Forecasting:** Real-time parabolic path prediction showing where your launch configuration will take you.
*   **Advanced Rendering:**
    *   **Canvas Viewport:** Fully interactable canvas with zoom (scroll) and pan (drag) capabilities.
    *   **Gravity Mesh:** Interactive visual representation of the gravity wells surrounding massive bodies.
*   **Telemetry & UI:**
    *   **Live Data:** Sidebar dashboard tracking velocity, fuel, mission status, and distance metrics in real-time.
    *   **Mission Control:** Pre-configured mission targets like a Mars Landing, Jupiter Flyby, or Lunar Approach.

## Technologies Used

*   **Frontend:** HTML5, Vector Canvas (2D Context)
*   **Styling:** CSS3
*   **Logic & Physics:** Vanilla JavaScript (ES6)
*   **Deployment:** Render (Static Site)

## Demo Video

A showcase of the simulator and its interactive features.

🎥 [DEMO VIDEO](https://drive.google.com/file/d/1ekYKhowJD9EJqfCyL4TN0J20TsAxqMIZ/view?usp=sharing)

### Live Demo [Link](https://orbitlab.onrender.com/)

## Local Setup and Installation

Follow these steps to get the application running on your local machine.

### 1. Prerequisites

*   A modern Web Browser (Chrome, Firefox, Safari, Edge)
*   Git (optional)

### 2. Clone the Repository

Clone this repository to your local machine using Git:

```bash
git clone https://github.com/whoisZenix/OrbitLab.git
cd OrbitLab
```

### 3. Run the Application

Since this project is pure HTML, CSS, and JavaScript, there are no dependencies to install or servers to configure.

You can simply open the `index.html` file in your preferred web browser:

**macOS:**
```bash
open frontend/index.html
```

**Windows:**
```cmd
start frontend\index.html
```

**Linux:**
```bash
xdg-open frontend/index.html
```

*(Alternatively, you can just drag and drop the `frontend/index.html` file into an open browser window, or use an extension like VSCode Live Server).*

## How to Use

1.  **Select Mission:** In the sidebar, choose your target destination (Mars, Jupiter, Moon).
2.  **Configure Launch:** Adjust the launch angle and initial speed using the sliders. Watch the flight path prediction.
3.  **Launch:** Click the "Launch" button to deploy your spacecraft.
4.  **Control Flight:** Use `W`, `A`, `S`, `D` or the `Arrow Keys` to fire the spacecraft thrusters and adjust your trajectory mid-flight. Keep an eye on your fuel!
5.  **View Telemetry:** Monitor your live velocity, distance, and mission status directly in the Flight Data panel.
6.  **Navigate Viewport:** Click and drag the mouse to pan around the solar system, and use the scroll wheel to zoom in and out.

## Author

-   Name: Baqar Mustafa
-   Email: baqarmustafa84@gmail.com
-   GitHub: whoisZenix
