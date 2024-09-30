// Hae reseptit Food API:sta
fetch('https://apilist.fun/api/food/recipe')
    .then(response => {
        if (!response.ok) {
            throw new Error('Verkkovirhe: ' + response.status);
        }
        return response.json(); // Muutetaan vastaus JSON-muotoon
    })
    .then(data => {
        const recipesContainer = document.getElementById('recipes-container');
        
        // Tarkista, onko reseptejä saatavilla
        if (data.result && data.result.length > 0) {
            data.result.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('card', 'mb-3'); // Bootstrap-kortti
                recipeDiv.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${recipe.name}</h5>
                        <p class="card-text">${recipe.description || 'Ei kuvausta.'}</p>
                    </div>
                `;
                recipesContainer.appendChild(recipeDiv); // Lisää resepti näyttöön
            });
        } else {
            recipesContainer.innerHTML = '<p>Ei reseptejä saatavilla.</p>';
        }
    })
    .catch(error => {
        console.error('Virhe:', error);
    });
