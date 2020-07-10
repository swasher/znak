import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// firebase init - add your own config here
const firebaseConfig  = {
    apiKey: process.env.VUE_APP_apiKey,
    authDomain: process.env.VUE_APP_authDomain,
    databaseURL: process.env.VUE_APP_databaseURL,
    projectId: process.env.VUE_APP_projectId,
    storageBucket: process.env.VUE_APP_storageBucket,
    messagingSenderId: process.env.VUE_APP_messagingSenderId,
    appId: process.env.VUE_APP_appId
}


// Get a Firestore instance
export const db = firebase
    .initializeApp(firebaseConfig)
    .firestore()

export const auth = firebase
    .auth();


// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
// const { Timestamp, GeoPoint } = firebase.firestore
// export { Timestamp, GeoPoint }

// if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true })

