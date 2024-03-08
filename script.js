const url =
  "https://book-finder1.p.rapidapi.com/api/search?series=Wings%20of%20fire&book_type=Fiction&lexile_min=600&lexile_max=800&results_per_page=25&page=1";
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

      // -------------------------------------------Create Book Markup---------------------------------------------
      const createBookMarkup = (book) => {
        const categoriesButtons = book.categories
          .map((category) => `<button class="category">${category}</button>`).join("");

        return `
        <div class="book" id="book_${book.canonical_published_work_id}">
          <img class = "book-cover" src="Images/book-cover.jpg" alt = "Book cover">
          <div class="book-info">
            <h2 class="text">${book.title}</h2>
            <h3 class="text">By <a class="author" href="https://www.google.com/search?q=${book.authors}" target="_blank">${book.authors}</a></h3>
            <h3 class="text">SERIES: ${book.series_name}</h3> 
            <p class="categories text"><strong>CATEGORIES:</strong> ${categoriesButtons}</p>
          </div>
          <div class="btn-containers">
            <div class="h_container">
              <button onclick="Toggle(${book.canonical_published_work_id})" id="${book.canonical_published_work_id}" class="like-btn"><i class="fas fa-heart"></i></button>
            </div>
            <div class="b_container">
              <a class="buy-btn" href="https://www.amazon.in/s?k=${book.title} ${book.series_name}" target="_blank">Buy</a>
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
      }
      const pageButtons = document.querySelector(".page-btns");

      // Add event listeners to the "Next" and "Previous" buttons
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
      
      let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
      function favColor() {
        favourites.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            element.style.color = "red";
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
        });
      });

      //----------------------------(Browse)-------------------------------

      const browse = document.querySelectorAll(".browse");
      browse.forEach((button) => {
        button.addEventListener("click", () => {
          heading.innerHTML = `<h1>Browse Books</h1>`;
          currentPage = 1;
          renderPage(data.results, currentPage, booksPerPage);
          window.scrollTo({ top: 700, behavior: "smooth" });
          favColor();
          pageButtons.style.display = "flex";
        });
      });

      //----------------------------(Favourites)-------------------------------

      const liked = document.querySelectorAll(".liked");
      liked.forEach((button) => {
        button.addEventListener("click", () => {
          booksContainer.innerHTML = ""; 
          heading.innerHTML = `<h1>Favorite Books</h1>`;
          if (favourites.length === 0) {
            booksContainer.innerHTML =
              '<h2 class="empty">No favourite books yet :(</h2>';
          } else {
            data.results.forEach((book) => {
              if (favourites.includes(book.canonical_published_work_id)) {
                const markup = createBookMarkup(book);
                booksContainer.insertAdjacentHTML("beforeend", markup);
              }
            });
          }
          window.scrollTo({ top: 700, behavior: "smooth" });
          favColor();
          pageButtons.style.display = "none";
        });
      });

      window.Toggle = function (id) {
        const element = document.getElementById(id);
        if (element.style.color == "red") {
          element.style.color = "#f0f0f0";
          favourites = favourites.filter((fav) => fav !== id);
        } else {
          element.style.color = "red";
          favourites.push(id);
        }
        localStorage.setItem("favourites", JSON.stringify(favourites));
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

      searchInput.addEventListener("input", () => {
        const searchQuery = searchInput.value.toLowerCase().trim();
        const searchedBooks = data.results.filter(
          (book) =>
            book.title.toLowerCase().includes(searchQuery) ||
            book.authors.join(" ").toLowerCase().includes(searchQuery) ||
            book.categories.join(" ").toLowerCase().includes(searchQuery) ||
            book.series_name.toLowerCase().includes(searchQuery)
        );

        booksContainer.innerHTML = ""; 
        if (searchedBooks.length === 0) {
          booksContainer.innerHTML = '<h2 class="empty">No books found :(</h2>';
        } else {
          currentPage = 1;
          renderPage(searchedBooks, currentPage, booksPerPage);
        }

        favColor();
      });

      searchInput.addEventListener("keydown", (event) => {
        const searchQuery = searchInput.value.trim();
        if (event.key === "Enter" && searchQuery) {
          window.scrollTo({ top: 700, behavior: "smooth" });
        }
      });

      if (searchInput && pageButtons) {
        searchInput.addEventListener("input", () => {
          if (searchInput.value.trim() === "") {
            pageButtons.style.display = "flex";
          } else {
            pageButtons.style.display = "none";
          }
        });
      }


      //----------------------------(Email-Input)-------------------------------

      const emailInput = document.querySelector("#email-input");
      const emailSubmit = document.querySelector("#email-submit");

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      emailSubmit.addEventListener("click", (event) => {
        event.preventDefault(); 

        const email = emailInput.value;

        if(emailRegex.test(email)){
          confirm("Submitted");
        }
        else{
          alert("Email is not valid");
        }
        emailInput.value = "";
      });

    })
    .catch((error) => console.error("Error in fetching data:", error));
};
