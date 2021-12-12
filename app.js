const api_key = "b5906b8522f50f016b9700843fbd4621";
const container = document.getElementById("container");
let page = 1;
let link = `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&page=${page}`;
const ul = document.querySelector("ul");    // for pagination
const btn = document.querySelector(".submit_btn");   // for searching page
const loader = document.getElementById("loader");
const pagination_div = document.querySelector(".pagination");
const search_page = document.querySelector(".search_page");

// GENRES
// https://api.themoviedb.org/3/genre/movie/list?api_key=<<api_key>>&language=en-US

// SEARCH
// https://api.themoviedb.org/3/search/company?api_key=<<api_key>>&page=1

// POPULAR
// https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>

// TRENDING
// https://api.themoviedb.org/3/trending/all/week?api_key=<<api_key>>



// getting data for home (tranding) page
const getData = async () => {
    Clear()
    response = await fetch(link);
    data = await response.json();

    data.results.forEach(movie => {
        console.log(movie)
        const card = document.createElement("div");
        card.classList.add("card");
        let selected_movie = {...movie};

        const img = document.createElement("img");
        img.classList.add("card_img");
        img.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
        const img_link = document.createElement("a");
        img_link.setAttribute("onclick", `moviePage(${JSON.stringify(selected_movie)})`);
        img_link.appendChild(img);

        const name = document.createElement("a");
        name.setAttribute("onclick", `moviePage(${JSON.stringify(selected_movie)})`);
        name.innerHTML = movie.original_title ? movie.original_title : movie.original_name;
        
        card.appendChild(img_link);
        card.appendChild(name);
        container.appendChild(card);
    })
    pagination(data.page, 30)
}


function pagination(page, total) {
    let li = '';
    next_page = page+1;
    prev_page = page-1;
    link = `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&page=${page}`;

    if (page > 1) {
        li += `<li class="btn prev" onclick="pagination(${page-1}, ${total}), getData(link)">
                <span><i class="fas fa-angle-left"></i> prev</span></li>`;
    }

    if (page > 2) {
        li += `<li class="num" onclick="pagination(1, ${total}), getData(link)"><span>1</span></li>`
        if (page > 3) {
            li += `<li class="dots"><span>...</span></li>`
        }
    }

    for (i = prev_page; i <= next_page; i++) {
        if (i > total) {
            continue
        }
        if (i < 1) {
            continue
        }
        if (i === page) {
            li += `<li class="num active"><span>${i}</span></li>`
        } else li += `<li class="num" onclick="pagination(${i}, ${total}), getData(link)"><span>${i}</span></li>`
    }
    
    if (page < total-1) {
        if (page < total - 2) {
            li += `<li class="dots"><span>...</span></li>`
        }
        li += `<li class="num" onclick="pagination(${total}, ${total}), getData(link)"><span>${total}</span></li>`
    }
    if (page < total) {
        li += `<li class="btn next" onclick="pagination(${page+1}, ${total}), getData(link)">
                <span>next <i class="fas fa-angle-right"></i></span></li>`;
    }
    
    ul.innerHTML = li;
  
}

function Clear() {
    container.innerHTML = "";
}

function FindPage(total) {
    let input = document.querySelector(".pg_input").value;
    page = input;
    link = `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&page=${page}`;
    pagination(page, total)
    getData(link)
}


// single movie page
moviePage = async (movie) => {
    Clear()
    pagination_div.classList.add("hidden");
    search_page.classList.add("hidden");
    
    console.log(movie);
}

btn.setAttribute("onclick", 'Clear(), FindPage(30)');

getData()