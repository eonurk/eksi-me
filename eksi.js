const cheerio = require('cheerio');
const fs = require('fs').promises;
const tough = require('tough-cookie');

// const HOST = 'http://localhost:5000';
const HOST = 'https://eksisozluk.com/';
const cacheMap = {};

const request = require('request-promise-native').defaults({
    jar: true,
    baseUrl: HOST,
    followAllRedirects: true,
    headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
    },
    transform: cheerio.load,
});

async function login() {
    //console.log('logging in')
    //console.log('fetching login page')
    let $ = await request.get('/giris?returnUrl=https%3A%2F%2Feksisozluk.com%2F');
    //await fs.writeFile('login.html', $.html());
    const token = $('input[name=__RequestVerificationToken]').attr('value');

    console.log('trying login');
    $ = await request.post('/giris', {
        method: 'POST',
        form: {
            __RequestVerificationToken: token,
            ReturnUrl: HOST,
            UserName:  process.env.MAIL,
            Password:  process.env.PASS,
            RememberMe: false,
        },
    });
    //await fs.writeFile('after-login.html', $.html());
    console.log('logged in');
}

const AJAX = {
    headers: { 'x-requested-with': 'XMLHttpRequest' },
};

async function parseEksi(username) {

    if (cacheMap[username] && cacheMap[username].length) {
       return cacheMap[username];
    }

    await login();
    let userlist = []
    const USERNAME = (username || '').replace(' ', '-');
    console.log(`Getting profile for username=${USERNAME}`);
    let $ = await request.get(`/biri/${USERNAME}`);
    //await fs.writeFile(`biri-${USERNAME}.html`, $.html());
    let total = 50;

    for (let i = 1; i <= 5 && total > (i*10); ++i) {
        if (i == 1) {
            total = $('#entry-count-total').text();
        }
        //console.log(`Getting entries for username=${USERNAME} page=${i}`);
        $ = await request.get(`/son-entryleri?nick=${USERNAME}&p=${i}`, AJAX);
        const entries = Array.from($('[data-favorite-count]')).map(e => $(e).data());
        //console.log(`Got entries for username=${USERNAME} page=${i} count=${entries.length}`)
        //await fs.writeFile(`entries-${USERNAME}-p${i}.html`, $.html());
        //console.log(entries);
        let reqs = entries.filter(e => e.favoriteCount)
            .map(e => request.get(`/entry/favorileyenler?entryId=${e.id}&_=${Date.now()}`, AJAX))
        const favs = (await Promise.all(reqs))
            .map($r => Array.from($r('li:not(.separated) a')).map(e => $(e).attr('href').split('/')[2]))
            .flat();
        userlist = userlist.concat(favs)
        //console.log(favs.flat());
    }
    console.log(`Done for username:${USERNAME}`)
    
    table = {}
    for (user of userlist){
        if (!table[user]){
            table[user] = 1
        }
        else{
            table[user]++;
        }
    }
    //console.log(table)
    var items = Object.keys(table).map(key => [key, table[key]]);

    // Sort the array based on the second element
    items.sort((a, b) => b[1] - a[1]);

    items = items.slice(0, 10);
    // Create a new array with only the first 5 items
    return cacheMap[username] = items;
    
}

module.exports = {
    parseEksi,
};

