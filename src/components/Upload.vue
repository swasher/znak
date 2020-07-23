<template>
    <div>
        <!-- Styled -->
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
        <b-progress :value="progress" max=100 show-progress animated></b-progress>
        <b-button @click="uploadFiles" class="mr-2 mt-2" variant="primary">Upload</b-button>
        <b-button @click="resetFiles" class="mr-2 mt-2">Reset</b-button>

        <div v-if="files.length" class="mt-2">
            <b-table sort-by.sync="name" striped hover :items="fileData"></b-table>
        </div>

        <p><b>Rendered pdf:</b>
<!--        <div class="p-0">-->
<!--            <canvas id="pdfCanvas"></canvas>-->
<!--        </div>-->
        <div id="listCanvas"></div>

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
                progress: 0
            }
        },

        computed: {
            fileData: function () {
                let items = []
                for (const file of this.files) {
                    const name = file.name ? file.name : 'NOT SUPPORTED';
                    const type = file.type ? file.type : 'NOT SUPPORTED';
                    const size = file.size ? file.size : 'NOT SUPPORTED';
                    console.log({file, name, type, size});
                    items.push({name, type, size})
                }
                return items
            },
        },

        watch: {
          files: function () {

              // const PREVIEW_SIZE = 96; // pdf будет скалироваться пропорционально, чтобы меньшая сторона была PREVIEW_SIZE
              pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
              console.log('this.files.length', this.files.length)


              // clean dom node (listCanvas)
              const listCanvas = document.getElementById("listCanvas");
              while (listCanvas.firstChild) {
                  listCanvas.removeChild(listCanvas.lastChild);
              }


              for (const file of this.files) {

                  // console.log('this.files[0] type:', typeof file)
                  // console.log('this.files[0] type:', Object.prototype.toString.call(file))

                  // let file = this.files[0]
                  const reader = new FileReader();
                  reader.onload = function () {
                      let typedArray = new Uint8Array(reader.result); // <------- WHAT IS THAT 'THIS' (this.result) ??????????
                      console.log('typedArray', typedArray);
                      const loadingTask = pdfjs.getDocument(typedArray).promise;

                      loadingTask.then(pdf => {
                          // The document is loaded here...
                          pdf.getPage(1).then(function (page) {
                              console.log('Page loaded');

                              let scale = 1;
                              let viewport = page.getViewport({scale: scale})


                              // let canvas = document.getElementById('pdfCanvas');   // можно делать get сущесвующего канваса, а можно создать новый!
                              let new_canvas = document.createElement("pdfCanvass");
                              new_canvas.innerHTML = `<canvas id="${file.name}"></canvas>`;
                              let div_for_canvases = document.getElementById("listCanvas");
                              div_for_canvases.appendChild(new_canvas);
                              let canvas = document.getElementById(file.name);

                              // canvas.setAttribute('width', '300');
                              // canvas.setAttribute('height', '300');


                              /* start вычисляем нужный scale */
                              const {width, height} = viewport;

                              let canvasWidth = width;
                              let canvasHeight = height;
                              // console.log('pdfWidth=', canvasWidth, 'pdfHeight=', canvasHeight)
                              if (width > PREVIEW_SIZE || height > PREVIEW_SIZE) {
                                  let scale = 1;
                                  let canvasWidth = PREVIEW_SIZE;
                                  let canvasHeight = PREVIEW_SIZE;

                                  if (height > width) {
                                      scale = canvasWidth / width;
                                      canvasHeight = height * scale;
                                  }

                                  if (width > height) {
                                      scale = canvasHeight / height;
                                      canvasWidth = width * scale;
                                  }

                                  console.log('scale=', scale)
                                  viewport = page.getViewport({scale: scale});
                              }
                              canvas.width = canvasWidth;
                              canvas.height = canvasHeight;
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

                // this.picture = null;
                // const storageRef = storage.ref(`${this.imageData.name}`).put(this.imageData);
                // storageRef.on(`state_changed`, snapshot => {
                //         this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //     }, error => {
                //         console.log(error.message)
                //     },
                //     () => {
                //         this.uploadValue = 100;
                //         storageRef.snapshot.ref.getDownloadURL().then((url) => {
                //             this.picture = url;
                //             console.log(storageRef.snapshot.ref)
                //
                //             logosCollection.add({
                //                 name: `${this.imageData.name}`,
                //                 comment: '',
                //                 filename: `${this.imageData.name}`,
                //                 url_jpg: url,
                //                 url_pdf: url
                //             });
                //
                //             this.imageSrc = url
                //             console.log('url=', url)
                //
                //         });
                //     }
                // );

                console.log('Start uploading:', this.files.length, 'files')

                for (let file of this.files) {
                    console.log('Upload:', file.name)

                    // Upload pdf
                    const storagePdfRef = storage.ref(`${file.name}`).put(file);
                    storagePdfRef.on(`state_changed`, snapshot => {
                        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        }, error => {
                            console.log('Error uploading pdf:', error.message)
                        }, () => {
                            console.log('Upload sucess:', file.name)
                        }
                    );
                    this.progress = 100;

                    // Upload jpeg from pdfjs canvas
                    let canvas = document.getElementById(file.name);
                    let jpeg = canvas.toDataURL("image/jpeg", 0.8)
                    // let typedArray = new Uint8Array(jpeg);
                    let jpegName = file.name.substr(0, file.name.lastIndexOf(".")) + ".jpeg";
                    const storageJpgRef = storage.ref(jpegName)
                    storageJpgRef.putString(jpeg, 'data_url').then(function() {
                        console.log('Uploaded:', jpegName);
                    });

                    logosCollection.add({
                        name: file.name,
                        comment: '',
                        filename: file.name.substr(0, file.name.lastIndexOf(".")), // store only filename without extension
                    });
                }
            }
        }
    }
</script>