<template>
    <div>
        <h1>Edit {{ znak.name }}</h1>
        <div>
            <b-img :src=znak.url_jpg  thumbnail fluid center></b-img>
        </div>

<!--        <label for="tags-basic">Type a new tag and press enter</label>-->
        <b-form-tags input-id="tags-basic" v-model="znak.tags" class="mb-2"></b-form-tags>
<!--        <p>Value: {{ znak.tags }}</p>-->

        <b-form @submit="updateZnak">
            <b-form-group label="Название:" >
                <b-form-input v-model="znak.name" class="mb-2" required></b-form-input>
            </b-form-group>
            <b-form-group label="Комментарий:" >
                <b-form-input v-model="znak.comment" placeholder="Comment"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Save</b-button>
        </b-form>

    </div>
</template>

<script>
import { logosCollection } from '../firebase'
export default {

    name: 'Edit',

    data() {
        return {
            znak: {},
        }
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    // computed: {
    //     znak() {
    //         return logosCollection.doc(this.id).get();
    //     }
    // },
    created() {
        this.fetchZnak()
    },
    // watch: {
    //     "$route": "fetchData"
    // },
    methods: {
        fetchZnak() {
            logosCollection.doc(this.id).get().then(snapshot => {  //DocSnapshot
                if (snapshot.exists) {
                    this.znak = snapshot.data()
                } else {
                    // snapshot.data() will be undefined in this case
                    console.log("No such document!");
                }
            })
        },
        updateZnak(event) {
            event.preventDefault();
            logosCollection
                .doc(this.id)
                .update(this.znak)
                .then(() => {
                    console.log("Updated document with ID: ", this.id);
                })
                .catch(function(error) {
                    console.error("Error updating document: ", error);
                });
            this.$router.push("/");
        }
    },
}
</script>