import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

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

export const storage = firebase
    .storage();

export const usersCollection = db.collection('users')
export const logosCollection = db.collection('logos')
export const storageRef = storage.ref()

firebase.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
            const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                unsubscribe();
                resolve(user);
            }, reject);
        }
    )};
