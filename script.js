const url = 'https://book-finder1.p.rapidapi.com/api/search?series=Wings%20of%20fire&book_type=Fiction&lexile_min=600&lexile_max=800&results_per_page=25&page=1';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '097f880005msh95d3b87f5294a1dp1322e1jsn0feeb193fb48',
        'X-RapidAPI-Host': 'book-finder1.p.rapidapi.com'
    }
};

fetch(url, options)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    data.results.forEach(book => {
        const categoriesButtons = book.categories.map(category => `<button class="categ">${category}</button>`).join('');
        const markup = `
            <div class="book">
                <h2>${book.title}</h2>
                <h3>-${book.authors}</h3>
                <h3>Series: ${book.series_name}</h3>
                <p><strong>Categories:</strong> ${categoriesButtons}</p>
                <p>${book.summary}</p>
            </div>`;
        document.querySelector('.books').insertAdjacentHTML('beforeend', markup);
    });
  })
  .catch(error => console.error(error));

