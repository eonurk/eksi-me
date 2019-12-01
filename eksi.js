const puppeteer = require('puppeteer');

(async() => {
    var username = process.argv.slice(-1).toString()
    // var counter = Integer process.argv.slice(-1)
    // console.log(counter)
    const browser = await puppeteer.launch({
        // headless: false,
        // slowMo: 10
    });
    const page = await browser.newPage();
    await page.goto('https://eksisozluk.com/giris', {waitUntil: 'networkidle2'});
    await page.waitFor('input[id=username]');
    await page.$eval('input[id=username]', el => el.value = 'restoqr06@gmail.com');
    await page.$eval('input[id=password]', el => el.value = 'Qwer1234');
    await page.click('button[class="btn btn-primary btn-lg btn-block"]');

    username = make_url(username)
    console.log("User: " + username)
    await page.goto('http://eksisozluk.com/biri/'+ username);
    
    let changed = true;
    var counter = 50
    var i = 0
    while (changed && i < counter){
        await page.click("#profile-stats-sections > a")
        .then(()=> {
            if ( (i+1) % 5 == 0){
                console.log((i+1)*10 + " entry işlendi, az sabır!")
            }
            i++;
        })
        .catch(() => changed=false);
        await autoScroll(page);
    }
    
    let handles = await page.$$('a.favorite-count.toggles');

    for (let handle of handles){
        try{await handle.click()}
        catch(err){}
    }
    let userlist = await page.evaluate(() => 
    Array.from(document.querySelectorAll('div > ul > li > a[target=_blank]'),
    element => element.textContent));

    // for (user of userlist){
    //     console.log(user)
    // }
    await browser.close();

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
    var items = Object.keys(table).map(function(key) {
        return [key, table[key]];
    });
    
    // Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    
    // Create a new array with only the first 5 items
    console.log(items.slice(0, 50));

})();

function make_url(text){
    return text.replace(" ", "-")
}


async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 10);
        });
    });
}
