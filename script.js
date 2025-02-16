// Create a CRD application (CRUD without update) using json-server or another API
// Use fetch and async/await to interact with the API
// Use a form to create/post new entities
// Build a way for users to delete entities
// Include a way to get entities from the API and display them
// You do NOT need update, but you can add it if you'd like
// Use Bootstrap and/or CSS to style your project

document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.querySelector('#content');
  const apiUrl = 'http://localhost:3000/games'; // JSON server URL
  const addGameForm = document.getElementById('addGameForm');
  const sortDropdown = document.getElementById('sortDropdown');

  // Fetch and display games when the page loads
  getGames();

  // Handle sorting
  sortDropdown.addEventListener('change', () => {
    const sortBy = sortDropdown.value;
    getGames(sortBy);
  });

  // Fetch and display games
  async function getGames(sortBy = 'title') {
    try {
      const response = await fetch(apiUrl);
      let games = await response.json();
      games = sortGames(games, sortBy);
      displayGames(games);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  }

  // Sort games by title or release year
  function sortGames(games, sortBy) {
    return games.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'releaseYear') {
        return a.releaseYear - b.releaseYear;
      }
    });
  }

  // Display games as cards
  function displayGames(games) {
    cardContainer.innerHTML = '';
    games.forEach((game) => {
      const card = document.createElement('div');
      card.classList.add('card', 'bg-secondary', 'text-white', 'm-2');
      card.style.width = '18rem';
      card.innerHTML = `
        <img src="${game.img || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${game.title}">
        <div class="card-body">
          <h5 class="card-title">${game.title}</h5>
          <p class="card-text">${game.description}</p>
          <button class="btn btn-danger" data-id="${game.id}">Delete</button>
        </div>
      `;

      const deleteButton = card.querySelector('.btn-danger');
      deleteButton.addEventListener('click', () => deleteGame(game.id));
      cardContainer.appendChild(card);
    });
  }

  // Handle form submission to add a new game
  addGameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newGame = {
      title: document.getElementById('addGameTitle').value,
      img: document.getElementById('addGameImg').value,
      description: document.getElementById('addGameDescription').value,
    };

    await addGame(newGame);
    addGameForm.reset(); // Clear the form
    getGames(); // Refresh the game list
  });

  // Add a new game to the server
  async function addGame(newGame) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGame),
      });
  
      const addedGame = await response.json();
      console.log('Game added with auto-generated ID:', addedGame);
    } catch (error) {
      console.error('Error adding new game:', error);
    }
  }
   

  // Delete a game by ID
  async function deleteGame(id) {
    console.log(`DELETE request for: ${apiUrl}/${id}`);
    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  
      // Check if the response is JSON
      if (response.status === 404) {
        console.error(`Game with ID ${id} not found.`);
        return;
      }
  
      if (response.ok) {
        console.log(`Game with ID ${id} deleted successfully.`);
        getGames(); // Refresh the game list
      } else {
        console.error(`Failed to delete game with ID ${id}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  }
  
  
  });