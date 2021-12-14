const api_key = "b5906b8522f50f016b9700843fbd4621";
const container = document.getElementById("container");
let page = 1;
const ul = document.querySelector("ul");    // for pagination
const btn = document.querySelector(".submit_btn");   // for searching page
const loader = document.getElementById("loader");
const pagination_div = document.querySelector(".pagination");
const search_page = document.querySelector(".search_page");
const movie_page = document.getElementById("movie_page");
const genres_div = document.getElementById("genres");

// by name
// https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=the+avengers
// GENRES
// https://api.themoviedb.org/3/genre/movie/list?api_key=<<api_key>>&language=en-US

// SEARCH
// https://api.themoviedb.org/3/search/company?api_key=<<api_key>>&page=1

// POPULAR
// https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>

// TRENDING
// https://api.themoviedb.org/3/trending/all/week?api_key=<<api_key>>



// getting data for home (tranding) page
const getData = async (link) => {
    Clear()
    response = await fetch(link);
    data = await response.json();

    data.results.forEach(movie => {

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
    container.classList.add("hidden");
    genres_div.classList.add("hidden");
    movie_page.style.display = "flex";

    // image
    const movie_img = document.createElement("img");
    movie_img.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
    movie_page.appendChild(movie_img);
    
    const info_div = document.createElement("div");
    info_div.classList.add("info");
    
    // name / title
    const name = document.createElement("h1");
    name.innerHTML = movie.original_title ? movie.original_title : movie.original_name;
    info_div.appendChild(name);

    // type (seria or movie)
    const media_type = document.createElement("p");
    let span = document.createElement("span");
    span.innerHTML = "type: ";
    media_type.appendChild(span);
    media_type.innerHTML += movie.media_type;
    info_div.appendChild(media_type);

    // genres
    const genres = document.createElement("p");
    let span1 = document.createElement("span");
    span1.innerHTML = "genres: ";
    genres.appendChild(span1);
    const genre_list = async () => {
        response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${api_key}&language=en-US`);
        data = await response.json();
        var list = ""
        data.genres.forEach(genre => {
            list += `${genre.name}, `
        })
        genres.innerHTML += list.substring(0, list.length - 2);
    }
    genre_list();
    info_div.appendChild(genres);

    // plot / overview
    const plot = document.createElement("p");
    span.innerHTML = "plot summary: ";
    plot.appendChild(span);
    plot.innerHTML += movie.overview;
    info_div.appendChild(plot);

    // release date
    const release = document.createElement("p");
    span.innerHTML = "released: ";
    release.appendChild(span);
    release.innerHTML += movie.first_air_date? movie.first_air_date.slice(0,4): movie.release_date.slice(0,4);
    info_div.appendChild(release);

    // other names
    if (movie.name) {
        const other_name = document.createElement("p");
        span.innerHTML = "other name: ";
        other_name.appendChild(span);
        other_name.innerHTML += movie.name;
        info_div.appendChild(other_name);
    }

    // rating
    const rating = document.createElement("p");
    span.innerHTML = "rating: ";
    rating.appendChild(span);
    rating.innerHTML += movie.vote_average;
    info_div.appendChild(rating);

    // add to favorites
    const add_fav_btn = document.createElement("button");
    add_fav_btn.classList.add("fav_btn");
    add_fav_btn.innerHTML = `<i class="far fa-star"></i>  Add to favorites`;
    info_div.appendChild(add_fav_btn);

    movie_page.appendChild(info_div);
}

function popular() {
    getData(`https://api.themoviedb.org/3/trending/all/day?api_key=${api_key}&page=${page}`);
}

const genres = async () => {
    pagination_div.classList.add("hidden");
    search_page.classList.add("hidden");
    Clear();
    response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`);
    data = await response.json();
    data.genres.forEach(genre => {
        const genre_btn = document.createElement("button");
        genre_btn.classList.add("genre_btn");
        genre_btn.innerHTML = genre.name;
        if (genre.name !== "Western")
            genres_div.appendChild(genre_btn);
        
    })
}

btn.setAttribute("onclick", 'Clear(), FindPage(30)');

getData(`https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&page=${page}`)

