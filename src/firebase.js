import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// firebase init - add your own config here
const firebaseConfig  = {
    apiKey: "AIzaSyDO7abP-UaCAWr5EZF1JvbHSns3QGHQjes",
    authDomain: "znakdb.firebaseapp.com",
    databaseURL: "https://znakdb.firebaseio.com",
    projectId: "znakdb",
    storageBucket: "znakdb.appspot.com",
    messagingSenderId: "101974016270",
    appId: "1:101974016270:web:148da37d04927194bb975f"
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

