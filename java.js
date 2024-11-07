
// Clase Agente que representa a cada agente de Valorant
class Agente {
    constructor(nombre, rol, habilidades, imagen) {
        this.nombre = nombre;
        this.rol = rol;
        this.habilidades = habilidades;
        this.imagen = imagen;
    }
}

// Función para obtener los agentes desde la API
async function fetchAgents() {
    const apiURL = "https://valorant-api.com/v1/agents";
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        // Mapeo de datos a objetos de la clase Agente
        return data.data.map(agent => new Agente(
            agent.displayName,
            agent.role?.displayName || "Sin rol",
            agent.abilities.map(ability => ability.displayName),
            agent.displayIcon
        ));
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
        return [];
    }
}

// Función para crear y retornar un elemento HTML para cada agente
function createAgentElement(agent) {
    const agentDiv = document.createElement("div");
    agentDiv.classList.add("agent-card");

    agentDiv.innerHTML = `
        <img src="${agent.imagen}" alt="${agent.nombre}" class="agent-avatar">
        <div class="agent-details">
            <h2>${agent.nombre}</h2>
            <p><strong>Rol:</strong> ${agent.rol}</p>
            <ul><strong>Habilidades:</strong> ${agent.habilidades.map(habilidad => `<li>${habilidad}</li>`).join("")}</ul>
        </div>
    `;
    return agentDiv;
}

// Función para renderizar los agentes en el DOM
function renderAgentList(agentArray) {
    const agentContainer = document.getElementById("agent-list");
    agentContainer.innerHTML = ""; // Limpiar el contenedor

    agentArray.forEach(agent => {
        const agentElement = createAgentElement(agent);
        agentContainer.appendChild(agentElement);
    });
}

// Función para filtrar agentes por el término de búsqueda
function filterAgentList(agentArray, searchTerm) {
    return agentArray.filter(agent =>
        agent.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Función para manejar la búsqueda en tiempo real
function setupSearch(agents) {
    const searchInput = document.getElementById("agent-search");
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value;
        const filteredAgents = filterAgentList(agents, searchTerm);
        renderAgentList(filteredAgents);
    });
}

// Función principal para inicializar la aplicación
async function initializeApp() {
    const agents = await fetchAgents();
    renderAgentList(agents);
    setupSearch(agents);
}

initializeApp();
