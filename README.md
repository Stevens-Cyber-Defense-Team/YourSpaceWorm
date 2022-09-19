# MySpaceWorm
Simple myspace clone vulnerable to a myspace worm

## Database:

Mongodb nosql database. Everything stored as documents (jsons)

### users document:
```json

{
    _id: ObjectId
    username: unique string
    password: string
    name: string
    timeline: [ post subdocument ]
}
```
### posts subdocument:
```json
{
    _id: ObjectId
    title: string
    content: string
}
```

## to do

Front end has to be handled.  Probably hella ways you can do it.  I kinda spammed this out after doing some other work and had to test just with postman.  Everthing seemed to be working right but im not 100% sure.  I dont know how much info u need for the front end but at the very least I stored the id and username into the cookie, so the id can be accessible and used to fetch data, and the username is there.  Now that I think about it, its prob better to have the name stored (instead of username) and use that for displaying the name somewhere or something.  I wasnt exactly sure what routes were gated behind the log in, and depending on how much u want the website to have, u should prob add some more routes for sending some pages or something.  It might make sense to move alot of routes to /private/whatever the route is, and everything past /private is gated by needing to be logged in.  Thats a pretty common strat but u can configure it however suits ya.  Also rn mongodb only listens on localhost, we can change that in app.js, i just didnt do that yet.  Also for whatever reason rn i have it so that signing up redirects u to login, form there ud have to put in the new login credentials, and then log in.  Ik thats a little weird but w/e .

Thank you for listening to my ted talk - farhan