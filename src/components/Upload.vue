<template>
    <div>
        <div class="mt-3">Select or dropdown here:</div>
        <b-form-file
                v-model="files"
                :state="Boolean(files)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                ref="file-input"
                multiple
                accept=".pdf"
        ></b-form-file>
        <b-progress :value="progress" max=100 show-progress animated class="mt-2"></b-progress>
        <b-button @click="uploadFiles" class="mr-2 mt-2" variant="primary">Upload</b-button>
        <b-button @click="resetFiles" class="mr-2 mt-2">Reset</b-button>

        <div v-if="files.length" class="mt-2">
            <b-table sort-by.sync="name" class="small" striped hover :fields="fileTableFields" :items="fileTable">
                <template v-slot:cell(uploaded)="data">
                    <b-icon v-if="data.value"  icon="circle-fill" variant="success"></b-icon>
                    <b-icon v-else icon="circle-fill" variant="warning"></b-icon>
                </template>
            </b-table>
        </div>

        <p><b>Rendered pdf:</b>
<!--        <div class="p-0">-->
<!--            <canvas id="pdfCanvas"></canvas>-->
<!--        </div>-->
        <div id="listCanvas"></div>

        <div id="successStory"></div>

    </div>
</template>


<script>
    import {storage} from '../firebase';
    import {logosCollection} from '../firebase';
    // import pdf from 'vue-pdf'
    import pdfjs from "pdfjs-dist";
    import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
    //  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    import { PREVIEW_SIZE } from '../const'
    import { JPEG_EXT } from '../const'
    import { PDF_EXT } from '../const'

    // function draw() {
    //     // рисует заленую галочку
    //     var canvas = document.getElementById('canvas');
    //     if (canvas.getContext){
    //         //circle
    //         var ctx = canvas.getContext('2d');
    //         var centerX = canvas.width / 2;
    //         var centerY = canvas.height / 2;
    //
    //         //draw tick
    //         ctx.beginPath();
    //         ctx.moveTo(125,150);
    //         ctx.lineTo(150,175);
    //         ctx.lineTo(200,125);
    //         ctx.lineWidth = 20;
    //         ctx.strokeStyle = 'green';
    //         ctx.stroke();
    //     }}



    export default {
        name: 'Upload',

        data() {
            return {
                imageData: null,
                picture: null,
                imageSrc: "",
                files: [],
                state: false,
                progress: 0,
                filesUploaded: [], // list of success uploaded files, for fileTable
                fileTableFields: [
                    { key: 'name', label: 'Имя_файла' },
                    { key: 'type', label: 'Тип' },
                    { key: 'size', label: 'Размер' },
                    { key: 'uploaded', label: 'Загружен' },
                ],
            }
        },

        computed: {
            fileTable: function () {
                let items = []
                for (const file of this.files) {
                    const name = file.name ? file.name : 'NOT SUPPORTED';
                    const type = file.type ? file.type : 'NOT SUPPORTED';
                    const size = file.size ? file.size : 'NOT SUPPORTED';

                    let uploaded = false
                    for (let file of this.filesUploaded) {
                        if (name === file) uploaded = true
                    }

                    console.log({file, name, type, size, uploaded});
                    // items.push({'Имя_файла':name, 'Тип':type, 'Размер':size, 'Загружен':uploaded})
                    items.push({name, type, size, uploaded})
                }
                return items
            },
        },

        watch: {
          files: function () {

              pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
              // console.log('this.files.length', this.files.length)

              // clean dom node (listCanvas)
              const listCanvas = document.getElementById("listCanvas");
              while (listCanvas.firstChild) {
                  listCanvas.removeChild(listCanvas.lastChild);
              }

              for (const file of this.files) {

                  // let file = this.files[0]
                  const reader = new FileReader();
                  reader.onload = function () {
                      let typedArray = new Uint8Array(reader.result); // <------- WHAT IS THAT 'THIS' (this.result) ??????????
                      // console.log('typedArray', typedArray);
                      const loadingTask = pdfjs.getDocument(typedArray).promise;

                      loadingTask.then(pdf => {
                          // The document is loaded here...
                          pdf.getPage(1).then(function (page) {
                              console.log('')
                              console.log('Filename:', file.name)
                              // console.log('Page loaded');

                              let scale = 1;
                              let viewport = page.getViewport({scale: scale})
                              console.log('viewport W:', viewport.width)
                              console.log('viewport H:', viewport.height)


                              // let canvas = document.getElementById('pdfCanvas');   // можно делать get сущесвующего канваса, а можно создать новый!
                              let new_canvas = document.createElement("pdfCanvass");
                              new_canvas.innerHTML = `<canvas id="${file.name}" class="p-2"></canvas>`;
                              let div_for_canvases = document.getElementById("listCanvas");
                              div_for_canvases.appendChild(new_canvas);
                              let canvas = document.getElementById(file.name);

                              /* start вычисляем нужный scale, чтобы pdf вмещался в квадрат со стороной PREVIEW_SIZE,
                              и затем устанавливаем одну из сторон канваса в размер скалированного PDF*/
                              console.log('square size:', PREVIEW_SIZE)

                              let scale_w = PREVIEW_SIZE / viewport.width;
                              let scale_h = PREVIEW_SIZE / viewport.height;
                              scale = Math.min(scale_h, scale_w)

                              console.log('scale_w', scale_w)
                              console.log('scale_h', scale_h)
                              console.log('scale=', scale)

                              viewport = page.getViewport({scale: scale});
                              console.log('viewport scaled W:', viewport.width)
                              console.log('viewport scaled H:', viewport.height)

                              if (viewport.width>viewport.height) {
                                  canvas.height = viewport.height
                                  canvas.width = PREVIEW_SIZE
                              } else {
                                  canvas.width = viewport.width
                                  canvas.height = PREVIEW_SIZE
                              }
                              /* end вычисляем нужный scale */


                              // canvas.width = 200;
                              // canvas.height = 200;
                              // canvas.style.width  = '200px';
                              // canvas.style.height = '100px';
                              // Рендерится таким образом
                              // <canvas id="pdfCanvas" width=canvas.width height=canvas.height style="width: canvas.style.width"></canvas>


                              let context = canvas.getContext('2d');

                              // Render PDF page into canvas context
                              let renderContext = {
                                  canvasContext: context,
                                  viewport: viewport
                              };
                              let renderTask = page.render(renderContext);
                              renderTask.promise.then(function () {
                                  console.log('Page rendered');
                              });

                          });
                      });
                  };
                  reader.readAsArrayBuffer(file);
              }


              // loadPdf(this.files[0], "#pdf-canvas")
          }
        },

        methods: {
            // DEPRECATED
            // previewImage(event) {
            //     this.uploadValue = 0;
            //     this.picture = null;
            //     this.imageData = event.target.files[0];
            // },

            resetFiles() {
                this.$refs['file-input'].reset()
            },

            uploadFiles() {
                console.log('Start uploading:', this.files.length, 'files')
                // let divSuccess = document.getElementById("successStory");

                for (let file of this.files) {
                    console.log('Upload:', file.name)

                    logosCollection.add({
                        name: file.name.split('.').slice(0, -1).join('.'),
                        comment: '',
                    })
                    .then(docRef => {
                        console.log("Document written with ID: ", docRef.id);
                        let filename = docRef.id

                        // Upload pdf
                        const storagePdfRef = storage.ref(filename+PDF_EXT).put(file);
                        storagePdfRef.on(`state_changed`, snapshot => {
                                this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            }, error => {
                                console.log('Error uploading pdf:', error.message)
                            }, () => {
                                console.log('Upload success:', file.name)
                                this.filesUploaded.push(file.name)
                            }
                        );
                        this.progress = 100;

                        // Upload jpeg - from pdfjs canvas
                        let canvas = document.getElementById(file.name);
                        let jpeg = canvas.toDataURL("image/jpeg", 1)
                        // let typedArray = new Uint8Array(jpeg);
                        let jpegName = filename + JPEG_EXT
                        const storageJpgRef = storage.ref(jpegName)
                        storageJpgRef.putString(jpeg, 'data_url').then(function() {
                            console.log('Uploaded:', jpegName);
                        });

                        let new_canvas = document.createElement("pdfCanvass");
                        new_canvas.innerHTML = `<canvas id="${file.name}"></canvas>`;
                        let div_for_canvases = document.getElementById("listCanvas");
                        div_for_canvases.appendChild(new_canvas);
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });
                }
            }
        }
    }
</script>

<style>

</style>