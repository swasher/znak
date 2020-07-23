<template>
    <div>
        <h1>404 Not found</h1>
        <h2>Тут ничего нет....</h2>
        <h3>Кроме телок!!!</h3>
        <h6>search {{ keyword }}</h6>
    </div>
</template>

<script>
    import JQuery from 'jquery'

    export default {
        name: 'NotFound',

        data() {
            return {
                src: '',
                keyword: '',
            }
        },

        // mounted() {
        //     const plugin = document.createElement("script");
        //     plugin.setAttribute(
        //         "jquery",
        //         "//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"
        //     );
        //     plugin.async = true;
        //     document.head.appendChild(plugin);
        // },

        mounted:

            function picload() {

                let $ = JQuery
                let items = ['сиськи', 'breast', 'naked girl']
                let keyword = items[Math.floor(Math.random() * items.length)];
                this.keyword = keyword

                $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
                    {
                        tags: keyword,
                        tagmode: "any",
                        format: "json"
                    },
                    function(data) {
                        let rnd = Math.floor(Math.random() * data.items.length);
                            let image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
                            // this.src = image_src
                            $('body').css('background-image', "url('" + image_src + "')");
                    });

            }

            // try 1
            // function picload() {
            //
            //     let request = new XMLHttpRequest();
            //     let url = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"
            //     request.open('GET', url, true);
            //
            //     request.onload = function() {
            //         if (request.status >= 200 && request.status < 400) {
            //             // Success!
            //             let data = JSON.parse(request.responseText);
            //         } else {
            //             // We reached our target server, but it returned an error
            //
            //         }
            //     };
            //
            //     request.onerror = function() {
            //         // There was a connection error of some sort
            //         console.error('Error request siski!')
            //     };
            //
            //     request.send();
            //
            // }

            // try 2
            // function picload() {
            //
            //     // Example POST method implementation:
            //     async function getData(url = '', data = {}) {
            //         // Default options are marked with *
            //         const response = await fetch(url, {
            //             method: 'POST', // *GET, POST, PUT, DELETE, etc.
            //             mode: 'cors', // no-cors, *cors, same-origin
            //             cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //             credentials: 'same-origin', // include, *same-origin, omit
            //             headers: {
            //                 'Content-Type': 'image/*'
            //                 // 'Content-Type': 'application/x-www-form-urlencoded',
            //             },
            //             redirect: 'follow', // manual, *follow, error
            //             referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //             body: JSON.stringify(data) // body data type must match "Content-Type" header
            //         });
            //         return response.json(); // parses JSON response into native JavaScript objects
            //     }
            //
            //     let items = ['сиськи','грудь','breast']
            //     let keyword = items[Math.floor(Math.random() * items.length)];
            //     this.keyword = keyword
            //     let data = {
            //         tags: keyword,
            //         tagmode: "any",
            //         format: "json"
            //     };
            //     let url = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"
            //
            //     getData(url, data)
            //         .then(data => {
            //             console.log('data:', data); // JSON data parsed by `data.json()` call
            //         });
            //
            // }

    }
</script>

<style scoped>
    h1, h2, h3, h6 {
        color: #7d6640;
        /*filter: drop-shadow(0 0 1px rgba(84, 103, 122,1));*/
        /*box-shadow: 0 0 10px;*/
        /*text-shadow: 2px 2px #555353;*/
        text-shadow: 2px 4px 3px rgba(0,0,0,0.3);
        /*text-shadow: 0px 4px 3px rgba(0,0,0,0.4),*/
        /*0px 8px 13px rgba(0,0,0,0.1),*/
        /*0px 18px 23px rgba(0,0,0,0.1);*/
    }
</style>