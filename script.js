// Tallenna hakusana localStorageen ja päivitä lista
function tallennaHaku(otsikko) {
    let haut = JSON.parse(localStorage.getItem('haut')) || [];
    haut.unshift(otsikko); // Lisää haku listan alkuun
    if (haut.length > 5) {
      haut = haut.slice(0, 5); // Pidä vain top 5 hakua
    }
    localStorage.setItem('haut', JSON.stringify(haut)); // Tallenna localStorageen
    paivitaHakulista(); // Päivitä näkyvä lista
  }
  
  // Päivitä top 5 hakulista sivulla
  function paivitaHakulista() {
    const topHautUl = document.getElementById('topHaut');
    topHautUl.innerHTML = ''; // Tyhjennä aiempi lista
    const haut = JSON.parse(localStorage.getItem('haut')) || [];
    haut.forEach(haku => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.textContent = haku;
      topHautUl.appendChild(li);
    });
  }
  
  // Hakulomakkeen käsittely
  document.getElementById('kirjaHakuLomake').addEventListener('submit', async function (e) {
    e.preventDefault(); // Estää lomakkeen oletustoiminnon (uudelleenlatauksen)
    const otsikko = document.getElementById('kirjaOtsikko').value;
    tallennaHaku(otsikko); // Tallenna haku
    haeKirjaOtsikolla(otsikko); // Hae kirjatietoja
  });
  
  // Hakee kirjatiedot käyttäen Open Libraryn hakua otsikon mukaan
  async function haeKirjaOtsikolla(otsikko) {
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${otsikko}`);
      if (!response.ok) {
        throw new Error('Verkkopyyntö epäonnistui');
      }
      const data = await response.json();
      naytaTulokset(data.docs); // Näytä tulokset sivulla
    } catch (error) {
      console.error('Virhe API-kutsussa:', error);
    }
  }
  
  // Näyttää hakutulokset sivulla
  function naytaTulokset(kirjat) {
    const tuloksetDiv = document.getElementById('kirjaTulokset');
    tuloksetDiv.innerHTML = ''; // Tyhjennä aiemmat tulokset
    if (kirjat.length === 0) {
      tuloksetDiv.innerHTML = '<p>Ei tuloksia.</p>';
      return;
    }
    kirjat.slice(0, 5).forEach(kirja => {
      const kirjaElement = document.createElement('div');
      kirjaElement.classList.add('card', 'mb-3');
      const kansikuva = kirja.cover_i
        ? `https://covers.openlibrary.org/b/id/${kirja.cover_i}-M.jpg`
        : 'https://via.placeholder.com/150x200?text=Ei+kuvaa'; // Oletuskuva, jos kansikuvaa ei ole     
      kirjaElement.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${kansikuva}" class="img-fluid rounded-start" alt="Kirjan kansikuva">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${kirja.title}</h5>
              <p class="card-text">Kirjailija: ${kirja.author_name ? kirja.author_name.join(', ') : 'Ei tietoa'}</p>
              <p class="card-text">Julkaisuvuosi: ${kirja.first_publish_year || 'Ei tietoa'}</p>
            </div>
          </div>
        </div>
      `;
      tuloksetDiv.appendChild(kirjaElement);
    });
  }
  
  // Päivitä hakulista, kun sivu ladataan
  document.addEventListener('DOMContentLoaded', paivitaHakulista);  
