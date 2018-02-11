var memeElement = document.getElementById('meme');
var memeState = {
    text: null,
    img: null
};

var jokeParagraph = document.getElementById('joke');
document.getElementById('refreshBtn').addEventListener('click', onRefresh);

/** Init DOM */
var menuEl = document.getElementById('menu');
var creatorEl = document.getElementById('creator');
var historyEl = document.getElementById('history');

menuEl.addEventListener('click', function onMenuClick() {
    menuEl.classList.toggle('open');
    creatorEl.classList.toggle('hidden');
    historyEl.classList.toggle('hidden');
});

var savedMemes = JSON.parse(localStorage.getItem('memes') || '[]');
var firstSavedMemeEl = null;
savedMemes.forEach(function eachMeme(meme, index) {
    if (index === 0) {
        firstSavedMemeEl = createMeme(meme);
        historyEl.appendChild(firstSavedMemeEl);
    } else {
        historyEl.appendChild(createMeme(meme));
    }
});

function createMeme(meme) {
    let div = document.createElement('div');
    div.style.backgroundImage = `url(${meme.img})`;
    div.classList.add('meme');
    div.innerHTML = `<p>${meme.text}</p>`;

    return div;
}
/** Save */
document.getElementById('saveBtn').addEventListener('click', function save() {
    if (memeState.text === null || memeState.img === null) {
        alert('Please add picture & image to the meme...');
        return;
    }
    let savedMemes = JSON.parse(localStorage.getItem('memes')) || [];
    let newMemeEl = createMeme(memeState);
    savedMemes.unshift(memeState);

    if (firstSavedMemeEl) {
        historyEl.insertBefore(newMemeEl, firstSavedMemeEl);
    } else {
        historyEl.appendChild(newMemeEl);
    }
    firstSavedMemeEl = newMemeEl;
    localStorage.setItem('memes', JSON.stringify(savedMemes));
});

/** Joke */
function onRefresh() {
    getJoke().then(resp => {
        memeState.text = resp.value;
        jokeParagraph.innerHTML = resp.value;
    });
}

/** Carousel */
var carouselEl = document.getElementById('carousel');
var spinnerEl = document.getElementById('spinner');
loadPhotos();

carouselEl.addEventListener('click', function(e) {
    if (e.srcElement.tagName === 'IMG') {
        memeState.img = e.srcElement.src;
        memeElement.style.backgroundImage = `url(${memeState.img})`;
    }
});

var page = 1;
var loadTimeout;
carouselEl.addEventListener('scroll', function(e) {
    // console.log(carouselEl.scrollWidth - carouselEl.scrollLeft, carouselEl.clientWidth);
    window.clearTimeout(loadTimeout);

    if (carouselEl.scrollWidth - carouselEl.scrollLeft - carouselEl.clientWidth < 50) {
        loadTimeout = setTimeout(function() {
            spinnerEl.classList.remove('hidden');
            loadPhotos(page++);
        }, 200);
    }
});

function loadPhotos(pageNumber) {
    spinnerEl.classList.remove('hidden');
    getPhotos(pageNumber)
        .then(resp => {
            // setTimeout(() => {
            resp.forEach(img => {
                let newImageEl = document.createElement('img');
                newImageEl.classList.add('carousel-image');
                newImageEl.src = img.urls.regular;

                carouselEl.insertBefore(newImageEl, spinnerEl);
            });
            spinnerEl.classList.add('hidden');
            // }, 1000);
        })
        .catch(err => spinnerEl.classList.add('hidden'));
}

/** API FUNCTIONS */
function getJoke() {
    let jokeRequest = new Request('https://api.chucknorris.io/jokes/random', { method: 'GET' });

    return fetch(jokeRequest).then(resp => resp.json());
}

function getPhotos(pageNumber = 1) {
    /*
    return Promise.resolve([
        {
            id: 'njbufHBbTPk',
            created_at: '2018-02-10T17:08:04-05:00',
            updated_at: '2018-02-11T05:52:55-05:00',
            width: 3648,
            height: 5472,
            color: '#ECF2ED',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518300459355-f8b0f31cf426?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=61c14fe888e4f889d974fb06d901f8d4',
                full:
                    'https://images.unsplash.com/photo-1518300459355-f8b0f31cf426?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=2138ac964313cc1e9e297840ba4b1513',
                regular:
                    'https://images.unsplash.com/photo-1518300459355-f8b0f31cf426?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=b299323044d951bee42e6baae8934eef',
                small:
                    'https://images.unsplash.com/photo-1518300459355-f8b0f31cf426?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=aa06ea159313ed2dfea79a80b99ef2e9',
                thumb:
                    'https://images.unsplash.com/photo-1518300459355-f8b0f31cf426?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=41d89e83969dfe90606ce136b58404d6'
            },
            links: {
                self: 'https://api.unsplash.com/photos/njbufHBbTPk',
                html: 'https://unsplash.com/photos/njbufHBbTPk',
                download: 'https://unsplash.com/photos/njbufHBbTPk/download',
                download_location: 'https://api.unsplash.com/photos/njbufHBbTPk/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 25,
            user: {
                id: 'PSnfA9rbZFI',
                updated_at: '2018-02-11T11:37:16-05:00',
                username: 'david_beatz',
                name: 'David Beatz',
                first_name: 'David',
                last_name: 'Beatz',
                twitter_username: null,
                portfolio_url: 'http://www.d-m-gphotography.com',
                bio: 'Gram-\r\n@david_beatz \r\n@dynamicmarketinggrounds',
                location: 'Los Angeles, CA',
                links: {
                    self: 'https://api.unsplash.com/users/david_beatz',
                    html: 'https://unsplash.com/@david_beatz',
                    photos: 'https://api.unsplash.com/users/david_beatz/photos',
                    likes: 'https://api.unsplash.com/users/david_beatz/likes',
                    portfolio: 'https://api.unsplash.com/users/david_beatz/portfolio',
                    following: 'https://api.unsplash.com/users/david_beatz/following',
                    followers: 'https://api.unsplash.com/users/david_beatz/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1503495393396-7d95a7ca1f21?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=69df9af308979f6b158ed66b3bf82f2a',
                    medium:
                        'https://images.unsplash.com/profile-1503495393396-7d95a7ca1f21?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=12aeca543f2ee4bdb16a3326bc4a9d15',
                    large:
                        'https://images.unsplash.com/profile-1503495393396-7d95a7ca1f21?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=9cc45df2d24d0e5f7251eba7b99b3b7d'
                },
                total_collections: 0,
                total_likes: 84,
                total_photos: 73
            },
            current_user_collections: []
        },
        {
            id: 'a_ZTbrmO6xA',
            created_at: '2018-02-10T16:22:12-05:00',
            updated_at: '2018-02-11T05:52:52-05:00',
            width: 5760,
            height: 3840,
            color: '#E3E9F0',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518297654380-fb6aecf51a39?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=8be4eeb93af4f7868ea2cc2ee4bdd023',
                full:
                    'https://images.unsplash.com/photo-1518297654380-fb6aecf51a39?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=3b926c6aa52d3416a9a71ac4e22715ac',
                regular:
                    'https://images.unsplash.com/photo-1518297654380-fb6aecf51a39?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=4a41e7d3c8b144d18039a3ed0001d1be',
                small:
                    'https://images.unsplash.com/photo-1518297654380-fb6aecf51a39?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=4861a1cc7d6b3e417bd02f9cc7f2f07e',
                thumb:
                    'https://images.unsplash.com/photo-1518297654380-fb6aecf51a39?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=8ba1e0289975e578ca3de158a39a962b'
            },
            links: {
                self: 'https://api.unsplash.com/photos/a_ZTbrmO6xA',
                html: 'https://unsplash.com/photos/a_ZTbrmO6xA',
                download: 'https://unsplash.com/photos/a_ZTbrmO6xA/download',
                download_location: 'https://api.unsplash.com/photos/a_ZTbrmO6xA/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 29,
            user: {
                id: 'TZs_V6UnJa4',
                updated_at: '2018-02-11T07:48:45-05:00',
                username: 'oliver_visuals',
                name: 'Easton Oliver',
                first_name: 'Easton',
                last_name: 'Oliver',
                twitter_username: 'eastonolives',
                portfolio_url: 'http://olivervisuals.co',
                bio: 'Oklahoma-based photographer that desperately wants to not be Oklahoma-based.',
                location: 'Oklahoma City',
                links: {
                    self: 'https://api.unsplash.com/users/oliver_visuals',
                    html: 'https://unsplash.com/@oliver_visuals',
                    photos: 'https://api.unsplash.com/users/oliver_visuals/photos',
                    likes: 'https://api.unsplash.com/users/oliver_visuals/likes',
                    portfolio: 'https://api.unsplash.com/users/oliver_visuals/portfolio',
                    following: 'https://api.unsplash.com/users/oliver_visuals/following',
                    followers: 'https://api.unsplash.com/users/oliver_visuals/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1509814723567-3d5d56e54ea0?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=c61b48eb93c963464872e405dc80d9ec',
                    medium:
                        'https://images.unsplash.com/profile-1509814723567-3d5d56e54ea0?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=4d9f1c65306f41e482d56b5036b5106d',
                    large:
                        'https://images.unsplash.com/profile-1509814723567-3d5d56e54ea0?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=4515c6ca69577299e11ee9ac91dd42d1'
                },
                total_collections: 1,
                total_likes: 122,
                total_photos: 35
            },
            current_user_collections: []
        },
        {
            id: 'RUFKax0WPvI',
            created_at: '2018-02-11T05:40:30-05:00',
            updated_at: '2018-02-11T05:52:46-05:00',
            width: 3517,
            height: 4396,
            color: '#E0E2E2',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518345558446-3955b46a5b32?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=f0131d0d5da311721831c02c99c55a5e',
                full:
                    'https://images.unsplash.com/photo-1518345558446-3955b46a5b32?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=124e88b519e2f2ca0fc364854185b0a0',
                regular:
                    'https://images.unsplash.com/photo-1518345558446-3955b46a5b32?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=9c1a4c578c16b7cc8578e3b88bf7394d',
                small:
                    'https://images.unsplash.com/photo-1518345558446-3955b46a5b32?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=fdd9771ad3f4b714c8e025218e01bb68',
                thumb:
                    'https://images.unsplash.com/photo-1518345558446-3955b46a5b32?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=1fdd57e88190f6d0c4d01bf2043afef7'
            },
            links: {
                self: 'https://api.unsplash.com/photos/RUFKax0WPvI',
                html: 'https://unsplash.com/photos/RUFKax0WPvI',
                download: 'https://unsplash.com/photos/RUFKax0WPvI/download',
                download_location: 'https://api.unsplash.com/photos/RUFKax0WPvI/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 13,
            user: {
                id: 'NPTNvLrexQw',
                updated_at: '2018-02-11T10:03:53-05:00',
                username: 'andrew_haimerl',
                name: 'Andrew Haimerl',
                first_name: 'Andrew',
                last_name: 'Haimerl',
                twitter_username: null,
                portfolio_url: 'http://andrewhaimerl.com',
                bio: 'Shooting for Bitcoin: 1PAnpCW6XUt6RsarnhJHGCd4JoEipe9u7F\r\n',
                location: 'Taiwan ',
                links: {
                    self: 'https://api.unsplash.com/users/andrew_haimerl',
                    html: 'https://unsplash.com/@andrew_haimerl',
                    photos: 'https://api.unsplash.com/users/andrew_haimerl/photos',
                    likes: 'https://api.unsplash.com/users/andrew_haimerl/likes',
                    portfolio: 'https://api.unsplash.com/users/andrew_haimerl/portfolio',
                    following: 'https://api.unsplash.com/users/andrew_haimerl/following',
                    followers: 'https://api.unsplash.com/users/andrew_haimerl/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1501820177779-15059c652690?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=1fd519362a552e75f9d4fa2d4e2e192b',
                    medium:
                        'https://images.unsplash.com/profile-1501820177779-15059c652690?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=4c676e8c25d15e1d3122ba7e644c4181',
                    large:
                        'https://images.unsplash.com/profile-1501820177779-15059c652690?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=ee92011dc776abfc82bba631e5dca4e4'
                },
                total_collections: 6,
                total_likes: 1068,
                total_photos: 410
            },
            current_user_collections: []
        },
        {
            id: 'pXEsx3kRuNc',
            created_at: '2018-02-10T20:56:42-05:00',
            updated_at: '2018-02-11T05:52:40-05:00',
            width: 5760,
            height: 3840,
            color: '#070804',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518314144686-36a36d62a13c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=e7db1b016fbd89ed3280402721286207',
                full:
                    'https://images.unsplash.com/photo-1518314144686-36a36d62a13c?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=5e16e363185e8e747366f45a6911c4b6',
                regular:
                    'https://images.unsplash.com/photo-1518314144686-36a36d62a13c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=e5ef13951b3ab17e95fc093d81cb335c',
                small:
                    'https://images.unsplash.com/photo-1518314144686-36a36d62a13c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=ff2f8a234a29c88ae0be16993acea1f1',
                thumb:
                    'https://images.unsplash.com/photo-1518314144686-36a36d62a13c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=6af6544458fd2dc98f3d1cc83769d4d3'
            },
            links: {
                self: 'https://api.unsplash.com/photos/pXEsx3kRuNc',
                html: 'https://unsplash.com/photos/pXEsx3kRuNc',
                download: 'https://unsplash.com/photos/pXEsx3kRuNc/download',
                download_location: 'https://api.unsplash.com/photos/pXEsx3kRuNc/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 31,
            user: {
                id: 'pVJLqUK0Dh4',
                updated_at: '2018-02-11T12:50:11-05:00',
                username: 'brookelark',
                name: 'Brooke Lark',
                first_name: 'Brooke',
                last_name: 'Lark',
                twitter_username: null,
                portfolio_url: 'http://www.brookelark.com',
                bio: 'Real Food fanatic. Bike rider. People lover. Running around with a camera.',
                location: 'SLC, UT',
                links: {
                    self: 'https://api.unsplash.com/users/brookelark',
                    html: 'https://unsplash.com/@brookelark',
                    photos: 'https://api.unsplash.com/users/brookelark/photos',
                    likes: 'https://api.unsplash.com/users/brookelark/likes',
                    portfolio: 'https://api.unsplash.com/users/brookelark/portfolio',
                    following: 'https://api.unsplash.com/users/brookelark/following',
                    followers: 'https://api.unsplash.com/users/brookelark/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1496175100457-27a8e68786eb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=f1b64c7cf2d8c9e799adcfb543c2dc11',
                    medium:
                        'https://images.unsplash.com/profile-1496175100457-27a8e68786eb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=f77869683f0a1001871e6b661782ef89',
                    large:
                        'https://images.unsplash.com/profile-1496175100457-27a8e68786eb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=d282cc1f4be5fa5614bfff9b4290d7fd'
                },
                total_collections: 0,
                total_likes: 3,
                total_photos: 96
            },
            current_user_collections: []
        },
        {
            id: 'zeB2rlxV148',
            created_at: '2018-02-10T20:58:27-05:00',
            updated_at: '2018-02-11T05:52:20-05:00',
            width: 5760,
            height: 3840,
            color: '#21271B',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518314226881-a558379a0311?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=2ae291c5a9259c3be8ee3ac1bee60ee9',
                full:
                    'https://images.unsplash.com/photo-1518314226881-a558379a0311?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=66048eb170214d9b46313fcfba551cf6',
                regular:
                    'https://images.unsplash.com/photo-1518314226881-a558379a0311?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=7fb3bea7629574470d9d91c92baf7332',
                small:
                    'https://images.unsplash.com/photo-1518314226881-a558379a0311?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=27b6de153b291401b2cd431b451e2a85',
                thumb:
                    'https://images.unsplash.com/photo-1518314226881-a558379a0311?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=aa0ecd5698b206217af6eb7e0387374c'
            },
            links: {
                self: 'https://api.unsplash.com/photos/zeB2rlxV148',
                html: 'https://unsplash.com/photos/zeB2rlxV148',
                download: 'https://unsplash.com/photos/zeB2rlxV148/download',
                download_location: 'https://api.unsplash.com/photos/zeB2rlxV148/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 16,
            user: {
                id: 'pVJLqUK0Dh4',
                updated_at: '2018-02-11T12:50:11-05:00',
                username: 'brookelark',
                name: 'Brooke Lark',
                first_name: 'Brooke',
                last_name: 'Lark',
                twitter_username: null,
                portfolio_url: 'http://www.brookelark.com',
                bio: 'Real Food fanatic. Bike rider. People lover. Running around with a camera.',
                location: 'SLC, UT',
                links: {
                    self: 'https://api.unsplash.com/users/brookelark',
                    html: 'https://unsplash.com/@brookelark',
                    photos: 'https://api.unsplash.com/users/brookelark/photos',
                    likes: 'https://api.unsplash.com/users/brookelark/likes',
                    portfolio: 'https://api.unsplash.com/users/brookelark/portfolio',
                    following: 'https://api.unsplash.com/users/brookelark/following',
                    followers: 'https://api.unsplash.com/users/brookelark/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1496175100457-27a8e68786eb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=f1b64c7cf2d8c9e799adcfb543c2dc11',
                    medium:
                        'https://images.unsplash.com/profile-1496175100457-27a8e68786eb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=f77869683f0a1001871e6b661782ef89',
                    large:
                        'https://images.unsplash.com/profile-1496175100457-27a8e68786eb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=d282cc1f4be5fa5614bfff9b4290d7fd'
                },
                total_collections: 0,
                total_likes: 3,
                total_photos: 96
            },
            current_user_collections: []
        },
        {
            id: '-1FD6WRc0vI',
            created_at: '2018-02-10T16:31:30-05:00',
            updated_at: '2018-02-11T05:52:04-05:00',
            width: 3456,
            height: 5184,
            color: '#FBE018',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518298261903-bb31aa5e4c87?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=ba9ce2aeae3b6a7c8d12fa6c79546749',
                full:
                    'https://images.unsplash.com/photo-1518298261903-bb31aa5e4c87?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=f1919ee73d721e77a3969a33972100e3',
                regular:
                    'https://images.unsplash.com/photo-1518298261903-bb31aa5e4c87?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=9ca76d7cae88838a038a2022329de096',
                small:
                    'https://images.unsplash.com/photo-1518298261903-bb31aa5e4c87?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=8f43c70a4bdfce79723bd5ed11d4644d',
                thumb:
                    'https://images.unsplash.com/photo-1518298261903-bb31aa5e4c87?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=c24bd95e03657ba172eb75b9c2e29aba'
            },
            links: {
                self: 'https://api.unsplash.com/photos/-1FD6WRc0vI',
                html: 'https://unsplash.com/photos/-1FD6WRc0vI',
                download: 'https://unsplash.com/photos/-1FD6WRc0vI/download',
                download_location: 'https://api.unsplash.com/photos/-1FD6WRc0vI/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 22,
            user: {
                id: 'buplzvuG2JU',
                updated_at: '2018-02-11T13:28:03-05:00',
                username: 'stairhopper',
                name: 'Alex Holyoake',
                first_name: 'Alex',
                last_name: 'Holyoake',
                twitter_username: '_TheRealAlex_',
                portfolio_url: 'http://ajholyoake.com',
                bio: 'I wear a multitude of clothes.',
                location: 'Wolverhampton, England',
                links: {
                    self: 'https://api.unsplash.com/users/stairhopper',
                    html: 'https://unsplash.com/@stairhopper',
                    photos: 'https://api.unsplash.com/users/stairhopper/photos',
                    likes: 'https://api.unsplash.com/users/stairhopper/likes',
                    portfolio: 'https://api.unsplash.com/users/stairhopper/portfolio',
                    following: 'https://api.unsplash.com/users/stairhopper/following',
                    followers: 'https://api.unsplash.com/users/stairhopper/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1515536792740-aadd366f1c2f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=3f847bed336890c83a68ccde0e87895f',
                    medium:
                        'https://images.unsplash.com/profile-1515536792740-aadd366f1c2f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=d0e2d3918f184f1396715f3de42a6c64',
                    large:
                        'https://images.unsplash.com/profile-1515536792740-aadd366f1c2f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=be0d8e208c58b4867becce320410befd'
                },
                total_collections: 8,
                total_likes: 1532,
                total_photos: 347
            },
            current_user_collections: []
        },
        {
            id: '-rt2GLdHUss',
            created_at: '2018-02-11T05:27:11-05:00',
            updated_at: '2018-02-11T05:51:12-05:00',
            width: 6016,
            height: 4016,
            color: '#EDC9B5',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518344508434-6f6e642d029f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=1b780d8a9b5779ce139699228596c774',
                full:
                    'https://images.unsplash.com/photo-1518344508434-6f6e642d029f?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=f84ba401802de6da431e0e0657a0c2d0',
                regular:
                    'https://images.unsplash.com/photo-1518344508434-6f6e642d029f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=1a4468f81a58c439b7daa72ada52718b',
                small:
                    'https://images.unsplash.com/photo-1518344508434-6f6e642d029f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=ea94eb56a6ebfd3b338c9aa689e27934',
                thumb:
                    'https://images.unsplash.com/photo-1518344508434-6f6e642d029f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=684210b6e61f87c9b19c37b6302d39ef'
            },
            links: {
                self: 'https://api.unsplash.com/photos/-rt2GLdHUss',
                html: 'https://unsplash.com/photos/-rt2GLdHUss',
                download: 'https://unsplash.com/photos/-rt2GLdHUss/download',
                download_location: 'https://api.unsplash.com/photos/-rt2GLdHUss/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 18,
            user: {
                id: 'NPTNvLrexQw',
                updated_at: '2018-02-11T10:03:53-05:00',
                username: 'andrew_haimerl',
                name: 'Andrew Haimerl',
                first_name: 'Andrew',
                last_name: 'Haimerl',
                twitter_username: null,
                portfolio_url: 'http://andrewhaimerl.com',
                bio: 'Shooting for Bitcoin: 1PAnpCW6XUt6RsarnhJHGCd4JoEipe9u7F\r\n',
                location: 'Taiwan ',
                links: {
                    self: 'https://api.unsplash.com/users/andrew_haimerl',
                    html: 'https://unsplash.com/@andrew_haimerl',
                    photos: 'https://api.unsplash.com/users/andrew_haimerl/photos',
                    likes: 'https://api.unsplash.com/users/andrew_haimerl/likes',
                    portfolio: 'https://api.unsplash.com/users/andrew_haimerl/portfolio',
                    following: 'https://api.unsplash.com/users/andrew_haimerl/following',
                    followers: 'https://api.unsplash.com/users/andrew_haimerl/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1501820177779-15059c652690?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=1fd519362a552e75f9d4fa2d4e2e192b',
                    medium:
                        'https://images.unsplash.com/profile-1501820177779-15059c652690?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=4c676e8c25d15e1d3122ba7e644c4181',
                    large:
                        'https://images.unsplash.com/profile-1501820177779-15059c652690?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=ee92011dc776abfc82bba631e5dca4e4'
                },
                total_collections: 6,
                total_likes: 1068,
                total_photos: 410
            },
            current_user_collections: []
        },
        {
            id: 'FDBuLwXikpw',
            created_at: '2018-02-11T03:25:04-05:00',
            updated_at: '2018-02-11T05:51:03-05:00',
            width: 6000,
            height: 4000,
            color: '#0F0503',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518337453586-ef544ae0ae20?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=a1003b93b880aab43552c840ef0bcc74',
                full:
                    'https://images.unsplash.com/photo-1518337453586-ef544ae0ae20?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=cbe736b81f3f97d1676b6332aa2316d3',
                regular:
                    'https://images.unsplash.com/photo-1518337453586-ef544ae0ae20?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=26a4fa6016a44a2eadb4abf09faef856',
                small:
                    'https://images.unsplash.com/photo-1518337453586-ef544ae0ae20?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=f8f4f115b1b88a65588bd58a63d83eb4',
                thumb:
                    'https://images.unsplash.com/photo-1518337453586-ef544ae0ae20?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=ef1f3effc8b50051f8d7635fe74d55bf'
            },
            links: {
                self: 'https://api.unsplash.com/photos/FDBuLwXikpw',
                html: 'https://unsplash.com/photos/FDBuLwXikpw',
                download: 'https://unsplash.com/photos/FDBuLwXikpw/download',
                download_location: 'https://api.unsplash.com/photos/FDBuLwXikpw/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 27,
            user: {
                id: 'oC0NJnQE5Xo',
                updated_at: '2018-02-11T13:52:54-05:00',
                username: 'paulamayphotography',
                name: 'Paula May',
                first_name: 'Paula',
                last_name: 'May',
                twitter_username: null,
                portfolio_url: 'http://www.paulamayphotography.com',
                bio: 'Photographer, Seeking Adventure. \r\n\r\n\r\n',
                location: 'Byron Bay, NSW Australia',
                links: {
                    self: 'https://api.unsplash.com/users/paulamayphotography',
                    html: 'https://unsplash.com/@paulamayphotography',
                    photos: 'https://api.unsplash.com/users/paulamayphotography/photos',
                    likes: 'https://api.unsplash.com/users/paulamayphotography/likes',
                    portfolio: 'https://api.unsplash.com/users/paulamayphotography/portfolio',
                    following: 'https://api.unsplash.com/users/paulamayphotography/following',
                    followers: 'https://api.unsplash.com/users/paulamayphotography/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1518337566864-0dc72b91713f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=540241566cc87116b79bb15d6a7a7aaf',
                    medium:
                        'https://images.unsplash.com/profile-1518337566864-0dc72b91713f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=c6e5e00dae5fd042dfb11b2ea0cabd1b',
                    large:
                        'https://images.unsplash.com/profile-1518337566864-0dc72b91713f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=e6a0cc22d65d7df851500f1117915d30'
                },
                total_collections: 2,
                total_likes: 104,
                total_photos: 11
            },
            current_user_collections: []
        },
        {
            id: 'p39vpkemPv0',
            created_at: '2018-02-10T15:44:11-05:00',
            updated_at: '2018-02-11T05:50:16-05:00',
            width: 1962,
            height: 3139,
            color: '#FBDF62',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518295354431-fdb186fca07e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=f1cc734d103b8cf9c2833c429b01f6b8',
                full:
                    'https://images.unsplash.com/photo-1518295354431-fdb186fca07e?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=fe162e43728aaf346d9ad8fd9468f7d2',
                regular:
                    'https://images.unsplash.com/photo-1518295354431-fdb186fca07e?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=3c8519a17a305d4ab8eb06d183908969',
                small:
                    'https://images.unsplash.com/photo-1518295354431-fdb186fca07e?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=7156ae22255fb7c6a5ef430f6a28f529',
                thumb:
                    'https://images.unsplash.com/photo-1518295354431-fdb186fca07e?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=e677c9b5e871474cdab984bfef74af73'
            },
            links: {
                self: 'https://api.unsplash.com/photos/p39vpkemPv0',
                html: 'https://unsplash.com/photos/p39vpkemPv0',
                download: 'https://unsplash.com/photos/p39vpkemPv0/download',
                download_location: 'https://api.unsplash.com/photos/p39vpkemPv0/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 33,
            user: {
                id: '9BJai19TDoU',
                updated_at: '2018-02-11T09:23:10-05:00',
                username: 'flavioamiel',
                name: 'Flavio Amiel',
                first_name: 'Flavio',
                last_name: 'Amiel',
                twitter_username: 'fba',
                portfolio_url: 'http://flavioamiel.com',
                bio: null,
                location: 'Porto, Portugal',
                links: {
                    self: 'https://api.unsplash.com/users/flavioamiel',
                    html: 'https://unsplash.com/@flavioamiel',
                    photos: 'https://api.unsplash.com/users/flavioamiel/photos',
                    likes: 'https://api.unsplash.com/users/flavioamiel/likes',
                    portfolio: 'https://api.unsplash.com/users/flavioamiel/portfolio',
                    following: 'https://api.unsplash.com/users/flavioamiel/following',
                    followers: 'https://api.unsplash.com/users/flavioamiel/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-fb-1492527880-40ebeac35487.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=193dd25e641f6380c835ff21f2d086eb',
                    medium:
                        'https://images.unsplash.com/profile-fb-1492527880-40ebeac35487.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=5e124dc765b8fae644d5a8432affcc47',
                    large:
                        'https://images.unsplash.com/profile-fb-1492527880-40ebeac35487.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=b7d8d5632043810935e01e8c4c5c71a8'
                },
                total_collections: 0,
                total_likes: 11,
                total_photos: 7
            },
            current_user_collections: []
        },
        {
            id: 'jucl7bCZ7Mk',
            created_at: '2018-02-10T16:01:10-05:00',
            updated_at: '2018-02-11T05:50:14-05:00',
            width: 4405,
            height: 2937,
            color: '#000103',
            description: null,
            categories: [],
            urls: {
                raw:
                    'https://images.unsplash.com/photo-1518296211993-21e8337a08c5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=4aa5ee5bde4fb2284bbe79eb19ae5519',
                full:
                    'https://images.unsplash.com/photo-1518296211993-21e8337a08c5?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=f72adc0788b953c04b48030b9b1f8cc4',
                regular:
                    'https://images.unsplash.com/photo-1518296211993-21e8337a08c5?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=9f397d17ebc00e21c533b7ebedc9dbe7',
                small:
                    'https://images.unsplash.com/photo-1518296211993-21e8337a08c5?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=082800efbe37c71ae9b5a2b3b007099b',
                thumb:
                    'https://images.unsplash.com/photo-1518296211993-21e8337a08c5?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjIxMDI5fQ&s=deb8a498c6346280d69f0ae9bab69eb7'
            },
            links: {
                self: 'https://api.unsplash.com/photos/jucl7bCZ7Mk',
                html: 'https://unsplash.com/photos/jucl7bCZ7Mk',
                download: 'https://unsplash.com/photos/jucl7bCZ7Mk/download',
                download_location: 'https://api.unsplash.com/photos/jucl7bCZ7Mk/download'
            },
            liked_by_user: false,
            sponsored: false,
            likes: 19,
            user: {
                id: '_3RIiCpIyZE',
                updated_at: '2018-02-10T16:33:01-05:00',
                username: 'pixelwanted',
                name: 'Jessica Arends',
                first_name: 'Jessica',
                last_name: 'Arends',
                twitter_username: null,
                portfolio_url: 'https://creativemarket.com/pixelwanted',
                bio: null,
                location: null,
                links: {
                    self: 'https://api.unsplash.com/users/pixelwanted',
                    html: 'https://unsplash.com/@pixelwanted',
                    photos: 'https://api.unsplash.com/users/pixelwanted/photos',
                    likes: 'https://api.unsplash.com/users/pixelwanted/likes',
                    portfolio: 'https://api.unsplash.com/users/pixelwanted/portfolio',
                    following: 'https://api.unsplash.com/users/pixelwanted/following',
                    followers: 'https://api.unsplash.com/users/pixelwanted/followers'
                },
                profile_image: {
                    small:
                        'https://images.unsplash.com/profile-1508502887362-b39a30b72d0c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=98a8c00516eac4785adc49d16dab02f2',
                    medium:
                        'https://images.unsplash.com/profile-1508502887362-b39a30b72d0c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=b3844d8422e9eae318ddcb64759b6b73',
                    large:
                        'https://images.unsplash.com/profile-1508502887362-b39a30b72d0c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=30212351e6fee43896a206c2857d2326'
                },
                total_collections: 1,
                total_likes: 147,
                total_photos: 6
            },
            current_user_collections: []
        }
    ]);
    */

    let jokeRequest = new Request(
        `https://api.unsplash.com/photos/?page=${pageNumber}&client_id=7551d068496476ab2e350913e3753a914f3ac6b83c12784e8cfc9c2a518cb1f8`,
        { method: 'GET' }
    );

    return fetch(jokeRequest).then(resp => resp.json());
}
