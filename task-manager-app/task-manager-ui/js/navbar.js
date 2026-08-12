class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./css/navbar.css" />
            <link rel="stylesheet" href="./css/styles.css" />
            <style>
                .active {
                    background-color: var(--accent-color-darker);
                    font-weight: bold;
                }
            </style>

            <nav id="navbar" class="navbar">
                <ul class="nav">
                    <!-- <li class="dropdown">
                        <a href="#" class="nav-item">File ▾</a>
                        <ul class="dropdown-menu">
                            <li><a href="customize.html" class="nav-item">Customize</a></li>
                            <li><a href="#" id="quit" class="nav-item" onclick="window.electronAPI.quitApp();">Quit</a></li>
                        </ul>
                    </li> -->
                    <li class="button-nav">
                        <a href="events-view.html" id="events" class="nav-item">Events</a>
                        <a href="home.html" id="today" class="nav-item">Today</a>
                        <a href="tasks-view.html" id="tasks" class="nav-item">Tasks</a>
                    </li>
                </ul>
            </nav>
        `;
    }

    connectedCallback() {
        const currLocation = window.location.pathname;
        const navLinks = this.shadowRoot.querySelectorAll('.nav .nav-item');

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (currLocation === linkPath) {
                link.classList.add('active');
                link.closest('.nav-item').classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
}
customElements.define('nav-bar', Navbar);