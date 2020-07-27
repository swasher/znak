import Vue from 'vue';
import { jpegURL } from "./utils";


Vue.filter('jpegURL', function (value) {
    return jpegURL(value)
})
