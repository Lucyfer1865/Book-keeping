const url = 'https://book-finder1.p.rapidapi.com/api/search?series=Wings%20of%20fire&book_type=Fiction&lexile_min=600&lexile_max=800&results_per_page=25&page=1';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '097f880005msh95d3b87f5294a1dp1322e1jsn0feeb193fb48',
        'X-RapidAPI-Host': 'book-finder1.p.rapidapi.com'
    }
};

window.onload = function() {
    const searchInput = document.querySelector('#search-input');
  
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);


            // Function to create book markup
            const createBookMarkup = (book) => {
                const categoriesButtons = book.categories
                    .map(category => `<button class="category">${category}</button>`)
                    .join(''); // Convert array to multiple category buttons
        
                return `
                    <div class="book" id="book_${book.canonical_published_work_id}">
                    <h2>${book.title}</h2>
                    <h3>-${book.authors}</h3>
                    <h3>Series: ${book.series_name}</h3> 
                    <p class="categories"><strong>Categories:</strong> ${categoriesButtons}</p>
                    <div class="h_container">
                        <button onclick="Toggle(${book.canonical_published_work_id})" id="${book.canonical_published_work_id}" class="btn"><i class="fas fa-heart"></i></button>
                    </div>
                    <p>${book.summary}</p>
                    </div>`;
            };
            
            // Initialising favourite books 
            let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
            // Get the style color from local storage
            function favColor(){
                favourites.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.style.color = "red";
                    }
                });
            }

            // Initial rendering of books for home
            const booksContainer = document.querySelector('.books-container');
            if (booksContainer) {
                data.results.forEach(book => {
                    const markup = createBookMarkup(book);
                    booksContainer.insertAdjacentHTML('beforeend', markup);
                });
            }
            favColor();



            // Initial rendering of books for fav
            const liked = document.querySelector('#liked');
            liked.addEventListener('click', () => {
                booksContainer.innerHTML = ''; // Clear rest of the books
                console.log(favourites);
                if (favourites.length === 0){
                    booksContainer.innerHTML = '<h2 class="empty">No favourite books yet</h2>';
                }
                else{
                    data.results.forEach(book => {
                        if (favourites.includes(book.canonical_published_work_id)) {
                            const markup = createBookMarkup(book);
                            booksContainer.insertAdjacentHTML('beforeend', markup);
                        }
                    });
                }
                favColor();
            })

            // Filter by category 
            booksContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('category')) {
                    const category = event.target.textContent;
                    const filteredBooks = data.results.filter(book =>
                        book.categories.includes(category)
                    );

                    booksContainer.innerHTML = ''; // Clear rest of the books

                    // Rendering of filtered books
                    filteredBooks.forEach(book => {
                        const markup = createBookMarkup(book);
                        booksContainer.insertAdjacentHTML('beforeend', markup);
                    });
                }
                favColor();
            });

            // Search functionality
            searchInput.addEventListener('input', () => {
                const searchQuery = searchInput.value.toLowerCase();
                const searchedBooks = data.results.filter( book =>
                    book.title.toLowerCase().includes(searchQuery) ||
                    book.authors.join(' ').toLowerCase().includes(searchQuery)
                
                );
                
                booksContainer.innerHTML = ''; // Clear rest of the books
        
                // Rendering of filtered books
                searchedBooks.forEach(book => {
                    const markup = createBookMarkup(book);
                    booksContainer.insertAdjacentHTML('beforeend', markup);
                });
                favColor();
            });

            window.Toggle = function(id) { 
                const element = document.getElementById(id);
                if (element.style.color =="red") {
                    element.style.color = "grey";
                    favourites = favourites.filter(fav => fav !== id);
                    
                }
                else{
                    element.style.color = "red";
                    favourites.push(id);
                    
                }
                console.log(favourites);
                localStorage.setItem('favourites', JSON.stringify(favourites));
                

            }

            
            

        })
        .catch(error => console.error(error));
  }