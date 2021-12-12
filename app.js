const api_key = "b5906b8522f50f016b9700843fbd4621";
const container = document.getElementById("container");
const limit = 30;
let page = 1;

// GENRES
// https://api.themoviedb.org/3/genre/movie/list?api_key=<<api_key>>&language=en-US

// SEARCH
// https://api.themoviedb.org/3/search/company?api_key=<<api_key>>&page=1

// POPULAR
// https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>

// TRENDING
// https://api.themoviedb.org/3/trending/all/week?api_key=<<api_key>>


const CreateCard = async () => {
    response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}`);
    data = await response.json();
    data.results.forEach(user => {
        console.log(user)
        const card = document.createElement("div");
        card.classList.add("card");
        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/original/${user.poster_path}`;
        console.log(user.poster_path)
        const name = document.createElement("h4");
        name.innerHTML = user.original_title ? user.original_title : user.original_name ;

        card.appendChild(img);
        card.appendChild(name);
        container.appendChild(card);
    })
}


CreateCard()