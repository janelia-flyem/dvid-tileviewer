(function($){

    // setup
    var url = 'http://emrecon100.janelia.priv/api/node/2a3fd320aef011e4b0ce18037320227c/bodies/raw/0_1_2/1000_1000_1/2300_1800_3000';

    var colors = {};

    // set up a canvas
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // fetch data
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
      //unpack the data
      var responseArray   = new Float64Array(this.response);
      var len = responseArray.length;

      var imgData = ctx.createImageData(Math.sqrt(len), Math.sqrt(len));
      var data    = imgData.data;

      for (var i = 0; i < data.length; i++) {
        var id = responseArray[i];
        if (id) {
          offset = i * 4;
          var hashed = hashCode(id.toString());
          data[offset] = grabDigit(hashed, 1) * 10 + 30;    // red
          data[offset + 1] = grabDigit(hashed, 3) * 10 + 30;     // green
          data[offset + 2] = grabDigit(hashed, 5) * 10 + 30;     // blue
          data[offset + 3] = 100;     // opacity
        }
      }

      // draw data onto the canvas
      ctx.putImageData(imgData, 0, 0);
      // display on the page.

    };
    xhr.send();

    function grabDigit(number, position) {
      return Math.floor(number / (Math.pow(10, position)) % 10)
    }

    function hashCode(string) {
      var hash = 0, i, chr, len;
      if (string.length == 0) return hash;
      for (i = 0, len = string.length; i < len; i++) {
        chr   = string.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

})(jQuery);
