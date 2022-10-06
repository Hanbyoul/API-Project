let name = document.getElementById("seoul");
let CityArea = document.querySelectorAll(".btn-box button");
let movie = [];
let SearchInput = document.getElementById("search-input");
let MenuButton = document.querySelectorAll(".menu-btn button");
let url;
let page = 1;
let total_pages = 0;

console.log(MenuButton);

MenuButton.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    GenresMovie(e);
  })
);

// console.log("시티버튼", CityArea);

CityArea.forEach((city) =>
  city.addEventListener("click", (e) => {
    getCity(e);
  })
);

SearchInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    SearchMovie(e);
  }
});

const getCity = async (e) => {
  //   console.log("클릭됨", e.target.value);
  name = e.target;
  let url = new URL(
    `https://api.openweathermap.org/data/2.5/weather?q=${name.value},kr&APPID=860f2b4d1ecfc1b95b8bab0cad99bd91`
  );
  let response = await fetch(url);
  let wdata = await response.json();
  weathers = wdata.weather[0].icon;
  temps = wdata.main.temp;
  WeatherRender();
};

const TodayWeather = async () => {
  let url = new URL(
    `https://api.openweathermap.org/data/2.5/weather?q=seoul,kr&APPID=860f2b4d1ecfc1b95b8bab0cad99bd91`
  );
  let response = await fetch(url);
  let wdata = await response.json();
  //   console.log("데이타는?", wdata);

  //   console.log("객체 선택", wdata.weather[0].icon);
  weathers = wdata.weather[0].icon;
  temps = wdata.main.temp;

  WeatherRender();
};

const WeatherRender = () => {
  let WeatherHTML = `<div class="name">
 현재 ${name.textContent} 날씨
</div>
<div>         
    <img src="http://openweathermap.org/img/wn/${weathers}@2x.png"/>${Math.round(
    temps - 273.15
  )}°С
</div>
`;
  document.getElementById("todayweather").innerHTML = WeatherHTML;
};

const GetMovie = async () => {
  url.searchParams.set("page", page);
  let response = await fetch(url);
  let data = await response.json();
  movie = data.results;
  total_pages = data.total_pages;
  page = data.page;
  console.log("데이터", data);
  movieRender();
  pagenation();
};



const movieRender = () => {
  let movieHTML = "";
  movieHTML = movie
    .map((item) => {
      return `<div class="card col-lg-3 col-sm-12">
    <img
    src="https://image.tmdb.org/t/p/w500${item.poster_path}"
      class="card-img-top img-size"
    />
    <div class="card-body">
        <h3>${item.title}</h3>
      <h4>${item.release_date}</h4>
    </div>
  </div>`;
    })
    .join("");

  document.getElementById("movie-post").innerHTML = movieHTML;
};

const PopularMovie = async () => {
    url = new URL(`
      https://api.themoviedb.org/3/movie/popular?api_key=0c43a956df331b1b45b4d08c58e16383&language=ko-KR`);
      page=1;
      GetMovie();
  };

const SearchMovie = async () => {
  let search = SearchInput.value;
  url = new URL(
    `https://api.themoviedb.org/3/search/movie?api_key=0c43a956df331b1b45b4d08c58e16383&language=ko-KR&query=${search}`
  );
  SearchInput.value = "";
  page=1;
  GetMovie();
};

const GenresMovie = async (e) => {
  console.log("클릭됨", e.target.value);
  let genres = e.target.value;
  url = new URL(
    `https://api.themoviedb.org/3/discover/movie?with_genres=${genres}&api_key=0c43a956df331b1b45b4d08c58e16383&language=ko-KR`
  );
  page=1;
  GetMovie();
};

const pagenation = () => {
  // total page
  // page
  // page group
  // last
  // first
  // first ~ last page print

  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 10);
  let last = pageGroup * 10;

  if (last > total_pages) {
    last = total_pages;
  }
  let first = last - 9;

  if (first < 1) {
    first = 1;
  }

  if (pageGroup > 1) {
    pagenationHTML = `    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick="MovetoPage(${1})">
        <span aria-hidden="true">&laquo;</span>
      </a><li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="MovetoPage(${
      page - 1
    })">
      <span aria-hidden="true">&lt;</span>
    </a>
    </li>`;
  }

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="MovetoPage(${i})">${i}</a></li>`;
  }

  if (last < total_pages && page < 500) {
    pagenationHTML += `    <li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="MovetoPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
  </li>
  
  <li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="MovetoPage(
    ${total_pages > 500 ? (total_pages = 500) : total_pages}
    )">
    <span aria-hidden="true">&raquo;</span>
  </a>`;
  }

  document.querySelector(".pagination").innerHTML = pagenationHTML;

  console.log("first-page", first, "last-page", last, "page-Group", pageGroup);
  console.log("현재 페이지", page);
};

const MovetoPage = (pageNum) => {
  // 이동하고 싶은 페이지를
  page = pageNum;
  console.log("클릭이동 page", page);

  // 이동하고 싶은 페이지를 가지고 api를 다시 호출해주기
  GetMovie();
};

TodayWeather();
PopularMovie();
