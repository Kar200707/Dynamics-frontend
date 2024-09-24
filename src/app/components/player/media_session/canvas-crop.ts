export async function cropBlobImageToSquare(imgsrc: string, size = 192) {
  var image = new Image();
  image.src = imgsrc;
  var imagePieces = [];
  // console.log(image.height)


  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  var context = canvas.getContext('2d');

  context!.drawImage(image, 100, 100, image.width, image.height, 0, 0, canvas.width, canvas.height);

  // console.log(canvas.toDataURL());
  // imagePieces = canvas.toDataURL();
  //
  // return imagePieces;
}
