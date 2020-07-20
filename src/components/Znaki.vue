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

        <b-card-group v-if="true" deck>
            <div v-for="(logo, index) in logos" :key="logo.id">
                <b-card
                        style="max-width: 232px;"
                        class="mb-2 mr-1 card-item"
                    >
<!--                <b-card-->
<!--                        :title=logo.name-->
<!--                        :img-src=logo.url_jpg-->
<!--                        img-alt="Image"-->
<!--                        img-top-->
<!--                        style="max-width: 240px;"-->
<!--                        class="mb-2 card-item"-->
<!--                    >-->
                    <pdf :src=logo.url_jpg style="max-width: 200px"></pdf>
                    <b-card-text>
                        <h5>{{ logo.name }}</h5>
                        {{ logo.comment }}
                    </b-card-text>
                    <div>
                        <b-button :to="{ name: 'edit', params: { id: logo.id } }" class="mr-1 mb-1" variant="primary" size="sm"><b-icon icon="pencil"></b-icon> Edit</b-button>
                        <b-button v-on:click="removeLogo(logo.id, index)" class="mr-1 mb-1" href="#" variant="primary" size="sm" ><b-icon icon="trash-fill"></b-icon> Delete</b-button>
                        <b-button v-on:click="downloadLogo(logo.id, index)" title="Download file" class="mr-1 mb-1" variant="primary" size="sm" ><b-icon icon="cloud-download
"></b-icon></b-button>
                    </div>
                    <div style="max-width: 185px">
                    <b-form-tags  v-if="logo.tags" size="sm" placeholder=""  v-model="logo.tags" ></b-form-tags>
                    </div>

                </b-card>
            </div>
        </b-card-group>
        <b-card-group v-else>
            <div v-for="(logo) in logos" :key="logo.id">
                <b-card
                        style="max-width: 231px;"
                        class="mb-2 mr-1 card-item">
                    <a href="#" :click="downloadLogo(logo.id, index)">
                    <pdf :src=logo.url_jpg style="max-width: 100px" ></pdf>
                    </a>
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

<!--        <h3>Combined logos</h3>-->
<!--        <div v-for="log in logos" :key="log.id">{{ log.name }}</div>-->
        <h5>logos by name</h5>
        <div v-for="logo in logosByName" :key="logo.id">{{ logosByName.name }} {{ logosByName.tags }}</div>
        <h5>logos by tag</h5>
        <div v-for="logo in logosByTag" :key="logo.id">{{ logosByTag.name }} {{ logosByTag.tags }}</div>

    </div>
</template>

<script>

    function saveBlob(blob, fileName) {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.dispatchEvent(new MouseEvent('click'));
    }

    import { logosCollection } from '../firebase'
    import { storage } from '../firebase'
    import pdf from "vue-pdf";

    export default {

        name: 'Znaki',

        components: {
            pdf
        },

        props: {
          // bigCard: Boolean,
        },

        computed: {
            // cardState() {
            //     return this.$store.state.count;
            // }
        },

        data() {
            return {
                // isResult: false,
                searchQuery: '',
                logos: [],
                logosByName: [],
                logosByTag: [],
            }
        },

        watch: {
            searchQuery: {
                immediate: true,
                handler(searchQuery) {
                    if (searchQuery) {
                        console.log('')
                        console.log('Search:', searchQuery)
                        this.$bind('logosByTag', logosCollection.where('tags', 'array-contains-any', [this.searchQuery]))
                        this.$bind('logosByName', logosCollection
                            .where("name", '>=', this.searchQuery)
                            .where("name", '<=', this.searchQuery+'\uf8ff')
                            .orderBy('name')
                        );
                        // this.logosByTag = logosCollection
                        //     .where('tags', 'array-contains-any', [this.searchQuery])
                        // this.logosByName = logosCollection
                        //     .where("name", '>=', this.searchQuery)
                        //     .where("name", '<=', this.searchQuery+'\uf8ff')
                        //     .orderBy('name')
                    } else {
                        console.log('Empty search')
                        this.$bind('logos', logosCollection)
                    }
                }
            },
            logosByTag: {
                handler(logosByTag) {
                    console.log('Found logos by tags:', logosByTag.length);
                    this.logos = {...this.logosByTag, ...this.logosByName};
                }
            },
            logosByName: {
                handler(logosByName) {
                    console.log('Found logos by name:', logosByName.length);
                    this.logos = {...this.logosByTag, ...this.logosByName};
                }
            },
            logos: {
                handler(logos) {
                    console.log('Found combined:', logos.length);
                }
            }


            // /*eslint-disable no-unused-vars*/
            // logos1: function (val) {
            //     // this.logos=val.concat(this.logos2);
            //     this.logos = this.logos2
            // },
            // /*eslint-disable no-unused-vars*/
            // logos2: function (val) {
            //     // this.logos=this.logos1.concat(val);
            //     this.logos = this.logos2
            // },

        },


        methods: {

            removeLogo: function (id, index) {
                let jpg_fn = this.logos[index].filename
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
                console.log('Start download...')
                let pdf_filename = this.logos[index].filename
                let pdfRef = storage.ref().child(pdf_filename);
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