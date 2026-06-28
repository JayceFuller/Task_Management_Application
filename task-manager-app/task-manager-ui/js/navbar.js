class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHtml = `
            <nav role="navigation" class="nav">
                <button class="nav-button">Search</button>
                <button class="nav-button">Day View</button>
                <button class="nav-button">+ Add</button>
            </nav>
        `;
    }
}