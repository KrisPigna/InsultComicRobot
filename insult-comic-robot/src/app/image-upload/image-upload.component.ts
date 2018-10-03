import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import resolveExif from 'exif-normalizer';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  selectedFile: File;
  imageSrc: String;
  blob: Blob;
  fileSelected = false;

  constructor(private router: Router, private http: HttpClient) { }

  async onFileChanged(event) {
    try {
      let fileType = event.target.files[0]["type"];
      let validImages = ["image/gif", "image/jpeg", "image/png"];
      if (validImages.indexOf(fileType) == -1) {
        console.log("invalid - file is not an image");
      }
      else {
        this.fileSelected = true;
        this.selectedFile = event.target.files[0];
        var imageData = await this.correctRotation(this.selectedFile);
        var imageUrl = imageData.toString();
        try {
          this.blob = this.b64toBlob(imageUrl, null);
          var imageDataResized = await this.imageResize(this.blob);
          var imageUrlResized = imageDataResized.toString();
          this.blob = this.b64toBlob(imageUrlResized, null);
        }
        catch (err) {
          var imageDataResized = await this.imageResize(this.selectedFile);
          var imageUrlResized = imageDataResized.toString();
          this.blob = this.b64toBlob(imageUrlResized, null);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  correctRotation(file) {
    return new Promise(resolve => {
      var img = new Image();
      img.onload = function () {
        resolveExif(img).then(function (imageUrl) {
          resolve(imageUrl);
        })
      }
      img.src = window.URL.createObjectURL(file);
    })
  }

  imageResize(file) {
    return new Promise(resolve => {
      var img = new Image();
      var MAX_WIDTH = 300;
      var MAX_HEIGHT = 300;
      var width = 0;
      var height = 0;
      var canvas;
      img.onload = function () {
        width = img.width;
        height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type));
      }
      img.src = window.URL.createObjectURL(file);
    })
  }

  b64toBlob(imageUrl, sliceSize) {
    var block = imageUrl.split(';');
    var contentType = block[0].split(':') || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(block[1].split(',')[1]);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  onUpload() {
    if (this.blob != undefined) {
      const uploadData = new FormData();
      uploadData.append('file', this.blob);
      this.http.post('https://insult-comic-robot.herokuapp.com/api/upload', uploadData)
        .subscribe(data => {
          this.router.navigate(["/result", { id: data["filename"] }]);
        });
    }
  }

  reselectFile() {
    this.fileSelected = false;
  }

  ngOnInit() {
    this.imageSrc = "";
  }

}
