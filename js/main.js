document.addEventListener('DOMContentLoaded', () => {
    const moviesList = document.getElementById('lista');
    const searchInput = document.getElementById('inputBuscar');
    const searchButton = document.getElementById('btnBuscar');
    let moviesData = [];

    async function fetchMovies() {
        try {
            const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
            moviesData = await response.json();
        } catch (error) {
            console.error('Error al cargar las películas:', error);
        }
    }


    function showStars(voteAverage) {
        const stars = Math.round(voteAverage / 2);
        let starHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < stars) {
                starHTML += '<span class="fa fa-star checked"></span>';
            } else {
                starHTML += '<span class="fa fa-star"></span>';
            }
        }
        return starHTML;
    }

    function showMovieDetails(movie) {
        const modalId = `movieModal-${movie.id}`;
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            new bootstrap.Offcanvas(modalElement).show();
            return;
        }

        const genresList = movie.genres.map(genre => genre.name).join(', ');
        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        const formattedBudget = movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A';
        const formattedRevenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A';
        const formattedRuntime = movie.runtime ? `${movie.runtime} min` : 'N/A';

        const offcanvasHTML = `
            <div class="offcanvas offcanvas-top" tabindex="-1" id="${modalId}" aria-labelledby="offcanvasTopLabel">
                <div class="offcanvas-header">
                    <h5 id="offcanvasTopLabel">${movie.title}</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <p>${movie.overview}</p>
                    <hr>
                    <p><strong>Géneros:</strong> ${genresList}</p>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            Más
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><span class="dropdown-item"><strong>Año:</strong> ${releaseYear}</span></li>
                            <li><span class="dropdown-item"><strong>Duración:</strong> ${formattedRuntime}</span></li>
                            <li><span class="dropdown-item"><strong>Presupuesto:</strong> ${formattedBudget}</span></li>
                            <li><span class="dropdown-item"><strong>Ganancias:</strong> ${formattedRevenue}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', offcanvasHTML);
        new bootstrap.Offcanvas(document.getElementById(modalId)).show();
    }

    function displayMovies(movies) {
        moviesList.innerHTML = '';
        if (movies.length === 0) {
            moviesList.innerHTML = '<li class="list-group-item text-white bg-secondary">No se encontraron películas.</li>';
            return;
        }

        movies.forEach(movie => {
            const genresString = movie.genres.map(genre => genre.name).join(', ');
            const movieItem = document.createElement('li');
            movieItem.classList.add('list-group-item', 'bg-dark', 'text-white', 'd-flex', 'justify-content-between', 'align-items-center');
            movieItem.innerHTML = `
                <div>
                    <h4>${movie.title}</h4>
                    <p class="text-muted">${movie.tagline}</p>
                </div>
                <div>
                    ${showStars(movie.vote_average)}
                </div>
            `;
            movieItem.addEventListener('click', () => showMovieDetails(movie));
            moviesList.appendChild(movieItem);
        });
    }

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        if (query) {
            const filteredMovies = moviesData.filter(movie => {
                const titleMatch = movie.title.toLowerCase().includes(query);
                const taglineMatch = movie.tagline.toLowerCase().includes(query);
                const overviewMatch = movie.overview.toLowerCase().includes(query);
                const genresMatch = movie.genres.some(genre => genre.name.toLowerCase().includes(query));
                return titleMatch || taglineMatch || overviewMatch || genresMatch;
            });
            displayMovies(filteredMovies);
        } else {
            moviesList.innerHTML = '';
        }
    });

    fetchMovies();
});
