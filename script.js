// Save search term and books to localStorage and update the list
function saveSearch(title, books) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.unshift({ title, books }); // Lisää haku listan alkuun
    if (searches.length > 5) {
        searches = searches.slice(0, 5); // Pidä vain top 5 hakua
    }
    localStorage.setItem('searches', JSON.stringify(searches)); // Tallenna localStorageen
    updateSearchList(); // Päivitä näkyvä lista
}

// Update top 5 search list on the page
function updateSearchList() {
    const topSearchesUl = document.getElementById('topSearches');
    topSearchesUl.innerHTML = ''; // Tyhjennä aiempi lista
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = item.title; // Hakusana

        // Tarkistetaan onko kirjat määritelty
        if (item.books && item.books.length > 0) {
            const firstBook = item.books[0]; // Hae ensimmäinen kirja
            const bookP = document.createElement('p');
            bookP.textContent = `Book: ${firstBook.title}`; // Näytä teos
            li.appendChild(bookP);

            // Näytä kuvan elementti
            const coverImage = firstBook.cover_i
                ? `https://covers.openlibrary.org/b/id/${firstBook.cover_i}-M.jpg`
                : 'https://via.placeholder.com/150x200?text=No+image'; // Oletuskuva, jos kansikuvaa ei ole
            const imageElement = document.createElement('img');
            imageElement.src = coverImage;
            imageElement.alt = `${firstBook.title} cover image`;
            imageElement.style.width = '100px'; // Määritä haluttu leveys
            imageElement.style.height = 'auto'; // Korkeus automaattisesti

            li.appendChild(imageElement); // Lisää kuva listaan
        } else {
            const bookP = document.createElement('p');
            bookP.textContent = 'No books available.'; // Jos ei ole teoksia
            li.appendChild(bookP);
        }

        topSearchesUl.appendChild(li);
    });
}

// Handle search form submission
document.getElementById('bookSearchForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Estää lomakkeen oletustoiminnon (uudelleenlatauksen)
    const title = document.getElementById('bookTitle').value;
    const books = await fetchBooksByTitle(title); // Hae kirjatietoja
    saveSearch(title, books); // Tallenna haku ja kirjat
});

// Fetch book details using Open Library API by title
async function fetchBooksByTitle(title) {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?title=${title}`);
        if (!response.ok) {
            throw new Error('Network request failed');
        }
        const data = await response.json();
        displayResults(data.docs); // Näytä tulokset sivulla
        return data.docs; // Palauta kirjat
    } catch (error) {
        console.error('Error in API call:', error);
        return [];
    }
}

// Display search results on the page
function displayResults(books) {
    const resultsDiv = document.getElementById('bookResults');
    resultsDiv.innerHTML = ''; // Tyhjennä aiemmat tulokset
    if (books.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }
    books.slice(0, 5).forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('card', 'mb-3');
        const coverImage = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'https://via.placeholder.com/150x200?text=No+image'; // Oletuskuva, jos kansikuvaa ei ole     
        bookElement.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${coverImage}" class="img-fluid rounded-start" alt="Book cover image">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Author: ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
                        <p class="card-text">First published: ${book.first_publish_year || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        `;
        resultsDiv.appendChild(bookElement);
    });
}

// Päivitä hakulista, kun sivu ladataan
document.addEventListener('DOMContentLoaded', updateSearchList);
