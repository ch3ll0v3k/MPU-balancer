const { createCanvas, loadImage, registerFont } = require('canvas');

class Canvas{

  constructor(params={}){
    this.w = params.w || 512;
    this.h = params.h || 512;
    this.output = params.output || false;
    this.canvas = null;
    this.ctx = null;
    this.fgColor = '#F00';
    this.fontSize = 14;
    this._init();
  }

  async _init(){

    // registerFont('comicsans.ttf', { family: 'Comic Sans' });

    this.canvas = createCanvas(this.w, this.h);
    this.ctx = this.canvas.getContext('2d');

  }

  async test(){

    const string = 'Awesome!';
    this.ctx.font = '30px Impact';
    this.ctx.rotate(0.1);
    this.ctx.fillText(string, 50, 100);

    var text = this.ctx.measureText(string);
    this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    this.ctx.beginPath();
    this.ctx.lineTo(50, 102);
    this.ctx.lineTo(50 + text.width, 102);
    this.ctx.stroke();

  }

  clear( toColor=true ){ 
    // this.clearInfoTextIndex();
    this.ctx.clearRect( 0, 0, this.w, this.h );
    // this.drawRelRect( 0, 0, this.W, this.H, '#999', '#999', 1 );
  }

  drawRelRect( x0, y0, w, h, fgColor, bgColor, lw=1 ){
    this.ctx.beginPath();
    this.ctx.strokeStyle = fgColor || '#F00';
    this.ctx.fillStyle = bgColor || 'rgb(0,0,0,0)';
    this.ctx.lineWidth = (+lw);
    this.ctx.rect( x0, y0, w, h);
    this.ctx.stroke();
    this.ctx.fill();
  }

  drawRelLine( x0, y0, x1, y1, clr, w ){
    this.ctx.beginPath();
    this.ctx.strokeStyle = clr || this.fgColor;
    this.ctx.lineWidth = (w || 1);
    this.ctx.fillStyle = "rgb(0,255,0)" ;
    this.ctx.moveTo( x0, y0 );
    this.ctx.lineTo( x1, y1 );
    this.ctx.stroke();
  }

  drawRelArc( x0, y0, R, start, end, clr ){
    this.ctx.beginPath();
    this.ctx.moveTo( x0, y0 );
    this.ctx.arc( x0, y0, (R || 5), (start || 0), ( end || (2*Math.PI) ));
    // this.ctx.closePath();
    this.ctx.fillStyle = clr || this.fgColor;
    this.ctx.fill();

  }
  drawRelDot( x0, y0, D, clr, strokeStyle=false, stroke_w=false ){
    this.ctx.beginPath();
    this.ctx.fillStyle = clr || this.fgColor;
    this.ctx.arc( x0, y0, (D || 5), 0, 2*Math.PI);
    this.ctx.fill();
    if( strokeStyle ){
      this.ctx.lineWidth = (stroke_w || 1);
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.stroke();
    }

  }
  drawRelDotField( _x0, _y0, D, strokeStyle, lineWidth ){
    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle || this.fgColor;
    this.ctx.lineWidth = (lineWidth || 1);
    this.ctx.arc( _x0, _y0, (D||5), 0, 2*Math.PI);
    this.ctx.stroke();
  }

  drawRelImage( image, sx, sy, sw, sh, dx=null, dy=null, dw=null, dh=null ){

    try{

      if( !image ) return;
      if( dx && dy && dw && dh ){
        this.ctx.drawImage( image, sx, sy, sw, sh, dx, dy, dw, dh );
      }else{
        this.ctx.drawImage( image, sx, sy, sw, sh );
      }
    }catch(e){
      console.log(` #canvas:drawRelImage: ${e.message}`);
    }

  }

  drawRelText( string, x0, y0, clr, size, font='monospace' ){
    this.ctx.font = `${ size || this.fontSize }px ${ font }`;
    this.ctx.fillStyle = clr || this.fgColor;
    this.ctx.fillText( string, x0, y0 );
  }

  async save(){
    if( !this.output )
      return console.warn(` #canvas:save: ${'output is null'}`);

    const buffer = this.canvas.toBuffer('image/png', {
      compressionLevel: 3,
      filters: this.canvas.PNG_FILTER_NONE,
    });

    console.writeFileSync( this.output, buffer, 'binary' );
    return console.ok(` #canvas:save: ${this.output}: done`);

    // ascii
    // base64
    // hex
    // ucs2/ucs-2/utf16le/utf-16le
    // utf8/utf-8
    // binary/latin1 (ISO8859-1, latin1 only in node 6.4.0+)


    // const image = await loadImage('examples/images/lime-cat.jpg')
    // .then(() => {
    //   // ctx.drawImage(image, 50, 0, 70, 70)
    //   // console.log('<img src="' + canvas.toDataURL() + '" />')
    //   return console.warn(` #canvas:save: ${'output is null'}`);
    // });

  }

}


module.exports = Canvas;

// const W = 512;
// const H = 512;

// const canvas = createCanvas(W, H);
// const ctx = canvas.getContext('2d');

// // Write "Awesome!"
// ctx.font = '30px Impact'
// ctx.rotate(0.1)
// ctx.fillText('Awesome!', 50, 100)

// // Draw line under text
// var text = ctx.measureText('Awesome!')
// ctx.strokeStyle = 'rgba(0,0,0,0.5)'
// ctx.beginPath()
// ctx.lineTo(50, 102)
// ctx.lineTo(50 + text.width, 102)
// ctx.stroke()

// Draw cat with lime helmet

