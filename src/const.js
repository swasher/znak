export const JPEG_EXT = '.jpeg'
export const PDF_EXT = '.pdf'
export const PREVIEW_SIZE = 100

const bucket = process.env.VUE_APP_storageBucket
export const URL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/{filename}?alt=media`
