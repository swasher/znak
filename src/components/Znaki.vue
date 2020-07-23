<template>
    <div>

<!--        <b-form class="mb-2" v-on:submit.prevent="getData">-->

<!--        Card state is: {{cardState}}-->

        <b-form class="mb-2">
            <b-input
                    v-model="searchQuery"
                    id="inline-form-input-name"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="search"
                    autocomplete="off"
            ></b-input>
        </b-form>
        <b-card-group v-if=cardStateStore deck>
            <div v-for="(logo, index) in logos" :key="logo.id">
                <b-card
                        :title=logo.name
                        :img-src=logo.jpegUrl
                        img-alt="Image"
                        img-top
                        style="max-width: 240px;"
                        class="mb-2 card-item"
                    >

                    <b-card-text>
                        {{ logo.comment }}
                    </b-card-text>
                    <div>
                        <b-button :to="{ name: 'edit', params: { id: logo.id } }" class="mr-1 mb-1" variant="primary" size="sm"><b-icon icon="pencil"></b-icon> Edit</b-button>
                        <b-button v-on:click="removeLogo(logo.id, index)" class="mr-1 mb-1" href="#" variant="primary" size="sm" ><b-icon icon="trash-fill"></b-icon> Delete</b-button>
                        <b-button v-on:click="downloadLogo(logo.id, index)" title="Download file" class="mr-1 mb-1" variant="primary" size="sm" ><b-icon icon="cloud-download"></b-icon></b-button>
                    </div>
                    <div style="max-width: 185px">
                        <b-form-tags  v-if="logo.tags" size="sm" placeholder=""  v-model="logo.tags" ></b-form-tags>
                    </div>

                </b-card>
            </div>
        </b-card-group>
        <b-card-group v-else>
            <div v-for="(logo, index) in logos" :key="logo.id">
                <b-card style="max-width: 231px;" class="mb-2 mr-1 card-item">
                    <div>
                        <b-link href="#" @click="downloadLogo(logo.id, index)">
                            <img :src="logo.jpegUrl" style="max-width: 100px">
                        </b-link>
                    </div>
                </b-card>

<!--                <div style="width: 50%">
                    <div v-if="loadedRatio > 0 && loadedRatio < 1" style="background-color: green; color: white; text-align: center" :style="{ width: loadedRatio * 100 + '%' }">{{ Math.floor(loadedRatio * 100) }}%</div>
                    <pdf ref="pdf" style="border: 1px solid red"
                         :src=logo.url_jpg
                         :page="1"
                         @progress="loadedRatio = $event"
                         @error="error"
                         @num-pages="numPages = $event"
                         @link-clicked="page = $event"
                    ></pdf>
                </div>-->

            </div>
        </b-card-group>

<!--&lt;!&ndash;        <h3>Combined logos</h3>&ndash;&gt;-->
<!--&lt;!&ndash;        <div v-for="log in logos" :key="log.id">{{ log.name }}</div>&ndash;&gt;-->
<!--        <h5>logos by name</h5>-->
<!--        <div v-for="logo in logosByName" :key="logo.id">{{ logosByName.name }} {{ logosByName.tags }}</div>-->
<!--        <h5>logos by tag</h5>-->
<!--        <div v-for="logo in logosByTag" :key="logo.id">{{ logosByTag.name }} {{ logosByTag.tags }}</div>-->

    </div>
</template>

<script>

    import {mapState} from "vuex";
    import { logosCollection } from '../firebase'
    import { storage } from '../firebase'
    import { JPEG_EXT } from '../const'
    import { PDF_EXT } from '../const'


    function saveBlob(blob, fileName) {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.dispatchEvent(new MouseEvent('click'));
    }


    function queryToArray(query) {
        let znaks = []
        query
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    let znak = {
                        id: doc.id,
                        name: doc.data().name,
                        filename: doc.data().filename,
                        comment: doc.data().comment,
                        tags: doc.data().tags,
                        // jpegUrl: jpegUrl,
                        // pdfUrl: pdfUrl
                    }

                    storage.ref(doc.data().filename+JPEG_EXT).getDownloadURL().then(function(url) {
                            znak.jpegUrl = url
                    }).catch(function(error) {
                        console.log('Error get jpg:', error)
                    });

                    // console.log('jpeg url:', jpegUrl)
                    // console.log('jpeg path type:', Object.prototype.toString.call(jpegUrl))

                    storage.ref(doc.data().filename+PDF_EXT).getDownloadURL().then(function(url) {
                        znak.pdfUrl = url
                    }).catch(function(error) {
                        console.log('Error get pdf:', error)
                    });

                    znaks.push(znak)
                    // znaks.push({
                    //     id: doc.id,
                    //     name: doc.data().name,
                    //     filename: doc.data().filename,
                    //     comment: doc.data().comment,
                    //     tags: doc.data().tags,
                    //     jpegUrl: jpegUrl,
                    //     pdfUrl: pdfUrl
                    // });
                    console.log('processing id:', doc.id, " => ", doc.data().name);
                    // console.log('znak array:', znak)
                });
                console.log('Found records:', znaks.length)
                console.log('Returning data:', znaks)
                return znaks
            })
            .catch((error) => {
                console.log("Error getting documents: ", error)
            })
    }


    export default {

        name: 'Znaki',

        props: {
          // bigCard: Boolean,
        },

        computed: {
            ...mapState({
                cardStateStore: "cardIsBig"
            })
        },

        data() {
            return {
                searchQuery: '',
                logos: [],
            }
        },

        watch: {
            searchQuery: {
                immediate: true,
                handler(searchQuery) {
                    if (searchQuery) {
                        console.log('')
                        console.log('Search by:', searchQuery)

                        // this.$bind('logosByTag', logosCollection.where('tags', 'array-contains-any', [this.searchQuery]))
                        // this.$bind('logosByName', logosCollection
                        //     .where("name", '>=', this.searchQuery)
                        //     .where("name", '<=', this.searchQuery+'\uf8ff')
                        //     .orderBy('name')
                        // );

                        // SWITCH TO NON-BOUND QUERIES
                        let logosByTags = logosCollection
                            .where('tags', 'array-contains-any', [this.searchQuery])
                            .orderBy('name')
                        let logosByName = logosCollection
                            .where("name", '>=', this.searchQuery)
                            .where("name", '<=', this.searchQuery+'\uf8ff')
                            .orderBy('name')
                        let logosByTagsArray = queryToArray(logosByTags)
                        let logosByNameArray = queryToArray(logosByName)
                        this.logos = [...logosByNameArray, ...logosByTagsArray]
                        // logos
                        //     .get()
                        //     .then((querySnapshot) => {
                        //         querySnapshot.forEach((doc) => {
                        //             znaks.push({
                        //                 id: doc.id,
                        //                 name: doc.data().name,
                        //                 filename: doc.data().filename,
                        //                 url_pdf: doc.data().url_pdf,
                        //                 url_jpg: doc.data().url_jpg,
                        //                 comment: doc.data().comment,
                        //                 tags: doc.data().tags,
                        //             });
                        //             console.log(doc.id, " => ", doc.data().name);
                        //         });
                        //         this.znaks = znaks // this.znaks - это "общая" переменная, доступная темплейту.
                        //         console.log('Found records:', znaks.length)
                        //     })
                        //     .catch((error) => {
                        //         console.log("Error getting documents: ", error)
                        //     })
                    } else {
                        console.log('Empty search')
                        let test = queryToArray(logosCollection)
                        console.log('this.logos TEST', this.logos)
                        this.logos = test
                        // bind version
                        // this.$bind('logos', logosCollection)
                        console.log('this.logos', this.logos)
                    }
                }
            },
            // logosByTag: {
            //     handler(logosByTag) {
            //         console.log('Found logos by tags:', logosByTag.length);
            //         this.logos = {...this.logosByTag, ...this.logosByName};
            //     }
            // },
            // logosByName: {
            //     handler(logosByName) {
            //         console.log('Found logos by name:', logosByName.length);
            //         this.logos = {...this.logosByTag, ...this.logosByName};
            //     }
            // },
            // logos: {
            //     handler(logos) {
            //         console.log('Found combined:', logos.length);
            //     }
            // }
        },


        methods: {

            removeLogo: function (id, index) {
                let fn = this.logos[index].filename
                let jpgRef = storage.ref(fn+JPEG_EXT);
                let pdfRef = storage.ref(fn+PDF_EXT);

                jpgRef.delete().then(function() {
                    console.log('Delete jpg success:', jpgRef.name)
                }).catch((error) => {
                    console.error('Delete jpg ERROR:', jpgRef.name, error)
                });

                pdfRef.delete().then(function() {
                    console.log('Delete pdf success:', pdfRef.name)
                }).catch((error) => {
                    console.error('Delete pdf ERROR:', pdfRef.name, error)
                });

                logosCollection.doc(id).delete().then(() =>{
                        this.$bvToast.toast(this.logos[index].name, {
                            title: 'Delete:',
                            autoHideDelay: 3000
                        })
                        this.$delete(this.logos, index);
                })
                    .catch((error) => {
                        console.error(error);
                    })
            },

            downloadLogo (id, index) {
                console.log('Start download id:', id)
                let pdf_filename = this.logos[index].filename+PDF_EXT
                let pdfRef = storage.ref(pdf_filename);
                pdfRef.getDownloadURL().then(function(url) {
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    /*eslint-disable no-unused-vars*/
                    xhr.onload = function(event) {
                        /*eslint-disable no-unused-vars*/
                        let blob = xhr.response;
                        saveBlob(blob, pdf_filename);
                    };
                    xhr.open('GET', url);
                    xhr.send();
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
    }
</script>

<style>

</style>