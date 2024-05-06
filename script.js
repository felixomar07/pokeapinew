let pokemones = [];
let equiposPokemon = [];
let historialEquipos = [];

const pokeContainer = document.getElementById("poke-container");
const addButton = document.getElementById("add");
const showHistoryButton = document.getElementById("show-history");
const resetButton = document.getElementById("reset");

addButton.addEventListener("click", async function () {
  if (pokemones.length < 6) {
    const pokemonName = document.getElementById("name").value;
    try {
      const pokemonData = await getPokemon(pokemonName);
      if (pokemonData) {
        pokemones.push(pokemonData);
      } else {
        alert("¡Pokémon no encontrado!");
      }
    } catch (error) {
      alert(error.message);
      return; 
    }
    if (pokemones.length === 6) {
      addButton.disabled = true;
      document.getElementById("name").disabled = true;
      resetButton.disabled = false;
      guardarEquipoPokemon(); 
      mostrarHistorial(); 
    }
    displayPokemon(); 
  } else {
    alert("¡Ya tienes 6 pokemones en tu equipo!");
  }
});

showHistoryButton.addEventListener("click", function () {
  mostrarHistorial();
});

function mostrarHistorial() {
  const historialDiv = document.createElement("div"); 
  historialDiv.classList.add("historial-container"); 

  console.log("Historial de equipos Pokémon:");
  if (historialEquipos.length === 0) {
    console.log("Aun no tienes equipos en el historial."); 
    return;
  }

  historialEquipos.forEach((equipo, index) => {
    console.log(`Equipo ${index + 1}:`);
    const equipoDiv = document.createElement("div"); 
    equipoDiv.classList.add("equipo-container");

    equipo.forEach(pokemon => {
      console.log(`  - Name: ${pokemon.name} (#${pokemon.id})`);
      const pokemonDiv = document.createElement("div"); 
      pokemonDiv.classList.add("pokemon-container"); 

      pokemonDiv.innerHTML = `
        <h1>${pokemon.name}<span>  #${pokemon.id}</span> </h1>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <h1>Height: ${pokemon.height / 10} m</p>
        <h2>Weight: ${pokemon.weight / 10} kg</p>
        <h2>Experience: ${pokemon.base_experience}</h2>
        <h2>Ability: ${pokemon.abilities[0].ability.name}</h2>
        <div>
          <h2>Types<h2>
          <ul>
            ${pokemon.types.map((type) => `<li>${type.type.name}</li>`).join("")}
          </ul>
        </div>`;
      
      equipoDiv.appendChild(pokemonDiv); 
    });

    historialDiv.appendChild(equipoDiv); 
  });

  pokeContainer.innerHTML = "";
  pokeContainer.appendChild(historialDiv);
}



resetButton.addEventListener("click", function () {
  resetearEquipo();
});

async function getPokemon(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      throw new Error('Pokemon not found!');
    }
    const pokemonData = await response.json();
    console.log('Pokemon data:', pokemonData); 
    return pokemonData;
  } catch (error) {
    alert(error.message);
  }
}

function guardarEquipoPokemon() {
  equiposPokemon.push([...pokemones]); 
  historialEquipos.push([...pokemones]); 
  console.log("Equipo Pokémon guardado:", equiposPokemon[equiposPokemon.length - 1]);
}


function resetearEquipo() {
  pokemones = []; 
  addButton.disabled = false; 
  document.getElementById("name").disabled = false; 
  resetButton.disabled = true; 
  displayPokemon(); 
}

function displayPokemon() {
  pokeContainer.innerHTML = "";


  pokemones.sort((a, b) => b.base_experience - a.base_experience);


  const historialDiv = document.createElement("div");
  historialDiv.classList.add("historial-container");

  pokemones.forEach((pokemon) => {
    try {
      const div = document.createElement("div");
      div.classList.add("pokemon-container"); 
      historialDiv.appendChild(div);

      div.innerHTML = `<h1>${pokemon.name}<span>  #${pokemon.id}</span> </h1>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <h1>Height: ${pokemon.height / 10} m</p>
      <h2>Weight: ${pokemon.weight / 10} kg</p>
      <h2>Experience: ${pokemon.base_experience}</h2>
      <h2>Ability: ${pokemon.abilities[0].ability.name}</h2>
      <div>
      <h2>Types<h2>
      <ul>
      ${pokemon.types.map((type) => `<li>${type.type.name}</li>`).join("")}
      </ul>
      </div>`;
    } catch (error) {
      console.error("Error displaying Pokémon:", error);
    }
  });


  pokeContainer.appendChild(historialDiv);
}