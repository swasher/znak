<template>
    <div>

        <b-form class="mb-2" v-on:submit.prevent="getData">
            <b-input
                    v-model="searchQuery"
                    id="inline-form-input-name"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="search"
                    @keyup="getData"
            ></b-input>
        </b-form>

        <b-card-group deck>
            <div v-for="(znak, index) in znaks" :key="znak.id">
                <b-card
                        :title=znak.name
                        :img-src=znak.url_jpg
                        img-alt="Image"
                        img-top
                        style="max-width: 13rem;"
                        class="mb-2 card-item"
                    >
                    <b-card-text>
                        {{ znak.comment }}
                    </b-card-text>
                    <div>
                        <b-button :to="{ name: 'edit', params: { id: znak.id } }" class="mr-1 mb-1" variant="primary" size="sm"><b-icon icon="pencil"></b-icon> Edit</b-button>
                        <b-button v-on:click="removeZnak(znak.id, index)" class="mr-1 mb-1" href="#" variant="primary" size="sm" ><b-icon icon="trash-fill"></b-icon> Delete</b-button>
                    </div>
                    <b-form-tags size="sm" placeholder="" disabled=true v-model="znak.tags" ></b-form-tags>

                </b-card>
            </div>
        </b-card-group>

<!--        <div class="searchResult" v-show="isResult">-->
<!--            <transition-group name="expand" tag="div">-->
<!--                <a href="#" v-for="elem in articleObj" v-bind:key="elem">-->
<!--                    111-->

<!--                </a>-->
<!--            </transition-group>-->
<!--        </div>-->

    </div>
</template>

<script>
    import { logosCollection } from '../firebase'
    import { storage} from '../firebase'

    // import { mapState } from 'vuex';
    export default {

        name: 'Znaki',

        data() {
            return {
                znaks: [],
                // znaksfilter: [],
                isResult: false,
                searchQuery: '',
            }
        },

        methods: {

            getData: function () {
                console.log(this.searchQuery)
                let znaks = [];
                let logos;

                console.log('searchQuery:', this.searchQuery===false)
                if (this.searchQuery) {
                    logos = logosCollection.where('tags', 'array-contains-any', [this.searchQuery])
                } else {
                    logos = logosCollection
                }

                logos
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            znaks.push({
                                id: doc.id,
                                name: doc.data().name,
                                filename: doc.data().filename,
                                url_pdf: doc.data().url_pdf,
                                url_jpg: doc.data().url_jpg,
                                comment: doc.data().comment,
                                tags: doc.data().tags,
                            });
                            console.log(doc.id, " => ", doc.data().name);
                        });
                        this.znaks = znaks // this.znaks - это "общая" переменная, доступная темплейту.
                        console.log('Found records:', znaks.length)
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error)
                    })
            },

            removeZnak: function (id, index) {
                let jpg_fn = this.znaks[index].filename
                let jpgRef = storage.ref().child(jpg_fn);
                // let pdfRef = storage.ref().child(this.znaks[index].url_pdf);

                // jpgRef = storage.getReferenceFromUrl(url_jpg)

                // console.log('url_jpg=', this.znaks[index].url_jpg)
                // console.log('full path=', jpgRef.fullPath)
                // console.log('name=', jpgRef.name)

                jpgRef.delete().then(function() {
                    console.log('Delete jpg success:', jpgRef.name)
                }).catch((error) => {
                    console.error('Delete jpg ERROR:', jpgRef.name, error)
                });
                //
                // pdfRef.delete().then(function() {
                //     console.log('Delete pdf success:', pdfRef.name)
                // }).catch((error) => {
                //     console.error('Delete pdf ERROR:', pdfRef.name, error)
                // });


                logosCollection.doc(id).delete().then(() =>{
                        this.$bvToast.toast(this.znaks[index].name, {
                            title: 'Delete:',
                            autoHideDelay: 3000
                        })
                        this.$delete(this.znaks, index);
                })
                    .catch((error) => {
                        console.error(error);
                    })
            },

            // removeSearchQuery: function() {
            //     this.searchQuery = '';
            //     this.isResult = false;
            // },

        },
        created() {
            this.getData();
        },
        // computed: {
        //     ...mapState(['user']),
        // },
    }
</script>

<style>

</style>