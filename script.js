// Tallenna hakusana ja kirjat localStorageen ja päivitä lista
function saveSearch(title, books) {
    if (books.length === 0) {
        console.log('Ei kirjoja löytynyt tälle haulle. Ei tallenneta hakuja.');
        return; // Älä tallenna, jos teoksia ei ole
    }

    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.unshift({ title, books }); // Lisää haku listan alkuun
    if (searches.length > 5) {
        searches = searches.slice(0, 5); // Pidä vain top 5 hakua
    }
    localStorage.setItem('searches', JSON.stringify(searches)); // Tallenna localStorageen
    updateSearchList(); // Päivitä näkyvä lista
}

// Päivitä top 5 hakulista sivulla
function updateSearchList() {
    const topHautUl = document.getElementById('topSearches');
    topHautUl.innerHTML = ''; // Tyhjennä aiempi lista
    const searches = JSON.parse(localStorage.getItem('searches')) || [];

    searches.forEach(item => {
        if (item.books && item.books.length > 0) { // Vain haut, joilla on teoksia
            const li = document.createElement('li');
            li.classList.add('list-group-item');

            // Hae ensimmäinen kirja
            const firstBook = item.books[0];

            // Näytä teoksen nimi
            const bookTitleP = document.createElement('p');
            bookTitleP.textContent = `Nimi: ${firstBook.title}`; // Näytä teoksen nimi
            li.appendChild(bookTitleP);

            // Näytä kirjailija
            const authorName = firstBook.author_name ? firstBook.author_name.join(', ') : 'Tuntematon kirjailija';
            const authorP = document.createElement('p');
            authorP.textContent = `Kirjailija: ${authorName}`; // Näytä kirjailijan nimi
            li.appendChild(authorP);

            // Näytä kuvan elementti
            const coverImage = firstBook.cover_i
                ? `https://covers.openlibrary.org/b/id/${firstBook.cover_i}-M.jpg`
                : 'https://via.placeholder.com/150x200?text=Ei+kuvaa'; // Oletuskuva, jos kansikuvaa ei ole
            const imageElement = document.createElement('img');
            imageElement.src = coverImage;
            imageElement.alt = `${firstBook.title} kansikuva`;
            imageElement.style.width = '100px'; // Määritä haluttu leveys
            imageElement.style.height = 'auto'; // Korkeus automaattisesti

            li.appendChild(imageElement); // Lisää kuva listaan
            topHautUl.appendChild(li); // Lisää lista
        }
    });
}

// Käsittele hakulomakkeen lähetys
document.getElementById('bookSearchForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Estää lomakkeen oletustoiminnon (uudelleenlatauksen)
    const title = document.getElementById('bookTitle').value;
    const books = await fetchBooksByTitle(title); // Hae kirjatietoja
    displayResults(books); // Näytä kirjat
});

// Hae kirjainformaatiota Open Library API:sta otsikon perusteella
async function fetchBooksByTitle(title) {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?title=${title}&limit=5`);
        if (!response.ok) {
            throw new Error('Verkkopyyntö epäonnistui');
        }
        const data = await response.json();
        return data.docs; // Palauta kirjat
    } catch (error) {
        console.error('Virhe API-kutsussa:', error);
        return [];
    }
}

// Näytä hakutulokset sivulla
function displayResults(books) {
    const resultsDiv = document.getElementById('bookResults');
    resultsDiv.innerHTML = ''; // Tyhjennä aiemmat tulokset
    if (books.length === 0) {
        resultsDiv.innerHTML = '<p>Ei tuloksia löytynyt.</p>';
        return;
    }
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('card', 'mb-3');
        const coverImage = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'https://via.placeholder.com/150x200?text=Ei+kuvaa'; // Oletuskuva, jos kansikuvaa ei ole     
        bookElement.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${coverImage}" class="img-fluid rounded-start" alt="Kannen kuva">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Kirjailija: ${book.author_name ? book.author_name.join(', ') : 'Tuntematon'}</p>
                        <p class="card-text">Ensimmäinen julkaisu: ${book.first_publish_year || 'Tuntematon'}</p>
                    </div>
                </div>
            </div>
        `;
        resultsDiv.appendChild(bookElement);
    });
}

// Päivitä hakulista, kun sivu ladataan
document.addEventListener('DOMContentLoaded', function () {
    // Poistettu updateSearchList -kutsu, koska top searches -toiminto ei ole käytössä
});
