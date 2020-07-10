<template>
    <div>

        <b-list-group>

        <b-list-group-item v-for="item in znaks" :key="item.id">
            {{ item.name }} - {{ item.comment }}
          </b-list-group-item>

        </b-list-group>


    </div>
</template>

<script>
import { db } from '../firebase'
export default {

    name: 'Znaki',

    data() {
        return {
            // documents: [],
            znaks: [],
        }
    },

    methods: {
        getData() {
            let znaks = [];

            this.aaa = db.collection('znachok')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        znaks.push({
                            id: doc.id,
                            name: doc.data().name,
                            comment: doc.data().comment,
                        });
                        console.log(doc.id, " => ", doc.data());
                    });
                    this.znaks = znaks // this.znaks - это "общая" переменная, доступная темплейту.
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error)
                })
        }
    },
    created() {
        this.getData();
    },
}
</script>