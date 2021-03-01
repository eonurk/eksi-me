# eksi-me

[eksisozluk](https://www.eksisozluk.com/) is a very popular social media platform in Turkey and this app shows eksi users their most devoted followers.

It scrapes last 100 entries of a user and counts the `şuku`s that other users gave to those entries. It is easy and fun lol.

[Click here](https://eksi-me.herokuapp.com/) to check it out!

> It may take a while to load the site since dynos of heroku sleeps after a while and they need some time to reload.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
git clone git@github.com:heroku/eksi-me.git # or clone your own fork
cd eksi-me
yarn install
yarn start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```

Alternatively, you can deploy your own copy of the app using this button:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Heroku, check out https://devcenter.heroku.com/
