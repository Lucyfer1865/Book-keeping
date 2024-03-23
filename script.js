const url =
  "https://book-finder1.p.rapidapi.com/api/search?categories=Animals%2C%20Bugs%20%26%20Pets%3BArt%2C%20Creativity%20%26%20Music%3BGeneral%20Literature%3BHobbies%2C%20Sports%20%26%20Outdoors%3BScience%20Fiction%20%26%20Fantasy%3BReal%20Life%3BScience%20%26%20Technology%3BMystery%20%26%20Suspense%3BReference&results_per_page=100&page=1";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "097f880005msh95d3b87f5294a1dp1322e1jsn0feeb193fb48",
    "X-RapidAPI-Host": "book-finder1.p.rapidapi.com",
  },
};

window.onload = function () {
  const searchInput = document.querySelector("#search-input");

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.results);
      // -------------------------------------------Create Book Markup---------------------------------------------
      const createBookMarkup = (book) => {
        const categoriesButtons = book.categories
        .map((category) => `<button class="category">${category}</button>`).join("");

        return `
        <div class="book" id="book_${book.canonical_published_work_id}">
          <img class = "book-cover" src="${book.published_works[0].cover_art_url}" alt = "Book cover">
          <div class="book-info">
            <h2 class="text">${book.title}</h2>
            <h3 class="text">By <a class="author" href="https://www.google.com/search?q=${book.authors}" target="_blank">${book.authors}</a></h3>
            <h3 class="text">SERIES: ${book.series_name}</h3> 
            <p class="categories text"><strong>CATEGORIES:</strong> ${categoriesButtons}</p>
          </div>
          <div class="btn-containers">
            <div class="i_container">
              <button onclick="ViewModal(${book.canonical_published_work_id})" title="Info" class="info-btn"><i class="fas fa-info"></i></button>
            </div>
            <div class="h_container">
              <button onclick="Toggle(${book.canonical_published_work_id})" title="Bookmark" id="${book.canonical_published_work_id}" class="like-btn"><i class="fas fa-bookmark"></i></button>
            </div>
            <div class="b_container">
              <a class="buy-btn" href="https://www.amazon.in/s?k=${book.title} ${book.series_name}" title="Buy" target="_blank">Buy</a>
            </div>
          </div>
        </div>`;
      };

      //----------------------------------------------Pagination----------------------------------------------------
      let currentPage = 1;
      const booksPerPage = 6;

      function getPageData(data, currentPage, booksPerPage) {
        const start = (currentPage - 1) * booksPerPage;
        const end = start + booksPerPage;
        return data.slice(start, end);
      }

      function renderPage(data, currentPage, booksPerPage) {
        const pageData = getPageData(data, currentPage, booksPerPage);
        const booksContainer = document.querySelector(".books-container");
        booksContainer.innerHTML = "";
        pageData.forEach((book) => {
          const markup = createBookMarkup(book);
          booksContainer.insertAdjacentHTML("beforeend", markup);
        });
        const pageNumber = document.querySelector("#page-number");
        pageNumber.innerHTML = currentPage;
      }
      const pageButtons = document.querySelector(".page-btns");

      document.querySelector("#next-btn").addEventListener("click", () => {
        if (currentPage * booksPerPage < data.results.length) {
          currentPage++;
          renderPage(data.results, currentPage, booksPerPage);
          window.scrollTo({ top: 700, behavior: "smooth" });
        }
      });

      document.querySelector("#previous-btn").addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage(data.results, currentPage, booksPerPage);
        }
        window.scrollTo({ top: 700, behavior: "smooth" });
      });

      //--------------------------------------Initial Rendering-------------------------------------------------------------
      fav_id = [];

      let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
      function favColor() {
        fav_id.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            element.style.color = "rgb(39, 174, 96)";
          }
        });
      }

      const booksContainer = document.querySelector(".books-container");
      if (booksContainer) {
        renderPage(data.results, currentPage, booksPerPage);
      }
      favColor();

      //-----------------------------------------Functionalities----------------------------------------------------------


      //----------------------------(Home)-------------------------------
      const page = document.querySelector(".page");
      const home = document.querySelectorAll(".home");
      const heading = document.querySelector("#heading");
      home.forEach((button) => {
        button.addEventListener("click", () => {
          heading.innerHTML = `<h1>Browse Books</h1>`;
          currentPage = 1;
          renderPage(data.results, currentPage, booksPerPage);
          window.scrollTo({ top: 0, behavior: "smooth" });
          favColor();
          pageButtons.style.display = "flex";
          page.style.display = "flex";
        });
      });

      //----------------------------(Browse)-------------------------------

      const browse = document.querySelectorAll(".browse");
      browse.forEach((button) => {
        button.addEventListener("click", () => {
          heading.innerHTML = `<h1>Browse Books</h1>`;
          currentPage = 1;
          renderPage(data.results, currentPage, booksPerPage);
          window.scrollTo({ top, behavior: "smooth" });
          favColor();
          pageButtons.style.display = "flex";
          page.style.display = "none";
        });
      });

      //----------------------------(Favourites)-------------------------------

      const liked = document.querySelectorAll(".liked");
      liked.forEach((button) => {
        button.addEventListener("click", () => {
          booksContainer.innerHTML = ""; 
          console.log(favourites);
          heading.innerHTML = `<h1>Favorite Books</h1>`;
          if (favourites.length === 0) {
            booksContainer.innerHTML =
              '<h2 class="empty">No favourite books yet :(</h2>';
          } else {
            favourites.forEach((book) => {
              
              const markup = createBookMarkup(book);
              booksContainer.insertAdjacentHTML("beforeend", markup);
              
            });
          }
          page.style.display = "none";
          pageButtons.style.display = "none";
          window.scrollTo({ top, behavior: "smooth" });
          favColor();
          
        });
      });

      window.Toggle = function (id) {
        const element = document.getElementById(id);
        const book = data.results.find(book => book.canonical_published_work_id === id);
        if (element.style.color === "rgb(39, 174, 96)") { 
          element.style.color = "#f0f0f0"; 
          favourites = favourites.filter((fav) => fav !== book);
          fav_id = fav_id.filter((fav) => fav !== id);
        } else {
          element.style.color = "rgb(39, 174, 96)";
          favourites.push(book);
          fav_id.push(id);
        }
        localStorage.setItem("favourites", JSON.stringify(favourites));
        localStorage.setItem("fav_id", JSON.stringify(fav_id));
        
      };

      //----------------------------(category)-------------------------------

      booksContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("category")) {
          const category = event.target.textContent;
          const filteredBooks = data.results.filter((book) =>
            book.categories.includes(category)
          );
          heading.innerHTML = `<h1>${category}</h1>`;
          booksContainer.innerHTML = ""; 

          filteredBooks.forEach((book) => {
            const markup = createBookMarkup(book);
            booksContainer.insertAdjacentHTML("beforeend", markup);
          });
          window.scrollTo({ top: 700, behavior: "smooth" });
          pageButtons.style.display = "none";
        }
        favColor();
      });

      //----------------------------(Search)-------------------------------

      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const searchQuery = searchInput.value.toLowerCase().trim();
          heading.innerHTML = `<h1>Search Results</h1>`
          if (searchQuery) {
            const url = `https://book-finder1.p.rapidapi.com/api/search?title=${encodeURIComponent(searchQuery)}&results_per_page=100&page=1`;
      
            fetch(url, options)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then((newData) => {

                booksContainer.innerHTML = ""; 

                data.results = newData.results;
      
                if (data.results.length === 0) {
                  booksContainer.innerHTML = '<h2 class="empty">No books found :(</h2>';
                } else {
                  currentPage = 1;
                  renderPage(data.results, currentPage, booksPerPage);
                }
      
                favColor();
              })
              .catch((error) => console.error("Error in fetching data:", error));
      
            window.scrollTo({ top: 700, behavior: "smooth" });
          }
        }
      });

      // -------------------------------(Modal)-----------------------------------

      const modal = document.getElementById("myModal");
      const modalBody = document.getElementById("modal-body");
      const span = document.getElementsByClassName("close")[0];

      window.ViewModal = function (id) {
        const book = data.results.find(book => book.canonical_published_work_id === id);
        modalBody.innerHTML = `
          <div id="book_modal">
            <img class = "book-cover" src="${book.published_works[0].cover_art_url}" alt = "Book cover">
            <div class="book-info">
              <h2 class="text">${book.title}</h2>
              <h3 class="text">By <a class="author" href="https://www.google.com/search?q=${book.authors}" target="_blank">${book.authors}</a></h3>
              <h3 class="text">SERIES: ${book.series_name}</h3> 
            </div>
          </div>
          <div class="description">
            <h2 class="text">Summary</h2>
            <p class="text">${book.summary}</p>
          </div>`;
        modal.style.display = "block";
      }

      span.onclick = function() {
        modal.style.display = "none";
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

      //----------------------------(Email-Input)-------------------------------

      const emailInput = document.querySelector("#email-input");
      const emailSubmit = document.querySelector("#email-submit");

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      emailSubmit.addEventListener("click", (event) => {
        event.preventDefault(); 

        const email = emailInput.value;

        if(emailRegex.test(email)){
          emailInput.style.borderColor = "green";
          
        }
        else {
          emailInput.style.borderColor = "red";
          setTimeout(() => {
            alert("Email is not valid");
          }, 100);
        }
        emailInput.value = "";
      });

    })
    .catch((error) => console.error("Error in fetching data:", error));
};
