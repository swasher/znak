import {JPEG_EXT, PDF_EXT, URL} from "./const";

export function jpegURL(id) {
    if (!id) return ''
    let filename = id.toString() + JPEG_EXT
    return URL.replace('{filename}', filename)
}

export function pdfURL(id) {
    if (!id) return ''
    let filename = id.toString() + PDF_EXT
    return URL.replace('{filename}', filename)
}
