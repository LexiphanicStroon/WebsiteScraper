const movies = [];

window.addEventListener('load', async () => {
  try {
    const url = 'http://localhost:8000/info/';
    const response = await fetch(url, {
      mode: 'cors',
    });
    const moviesResponse = await response.json();
    movies.push(...moviesResponse); // Assuming moviesResponse is an array of movie objects
    displayMovies();
  } catch (err) {
    console.error(err);
  }
});
const setReminder = async (movie, index) => {
  try {
    let phoneNumber = 12043912361;
    const url = 'http://localhost:8000/reminder/';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneNumber,
        movieTitle: movie.title,
        showtime: movie.showtimes,
        movieId: index,
      }),
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};
console.log(movies);
function displayMovies() {
  const movieList = document.getElementById('movieList'); // Assuming you have a container with this ID in your HTML
  movies.forEach((movie, index) => {
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    const p = document.createElement('p');
    const button = document.createElement('button');

    button.textContent = 'remind me';
    button.addEventListener('click', () => setReminder(movie, index));
    div.classList.add('movieContainer');

    h1.textContent = movie.title; // Assuming 'title' is a property of each movie object
    p.textContent = movie.showtimes; // Assuming 'description' is another property

    div.appendChild(h1);
    div.appendChild(p);
    div.appendChild(button);

    movieList.appendChild(div); // Append the movie div to the movieList container
  });
}

// document
//   .getElementById('reminderForm')
//   .addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const phone = document.getElementById('phone').value;
//     const movieId = 1;
//     await fetch('http://localhost:8000/reminder/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ phone, movieId }),
//     });
//   });
