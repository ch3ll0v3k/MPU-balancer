const logger = require('mii-logger.js');
const Canvas = require('./Canvas');

const data = [

  // test 0:
  // [0.17,-0.76,-0.81,0.22,-0.17,-0.60,-2.92,3.12,-1.94,-0.41,-2.83,2.74,2.86,2.08,-0.42,-0.53,0.13,-2.44,2.67,1.87,2.18,0.30,0.00,0.00],
  // [1.74,2.57,1.28,0.52,0.89,2.69,2.73,0.90,1.23,-0.09,-1.06,0.41,1.15,0.49,-1.14,-1.43,-3.08,-2.97,2.19,0.88,-1.76,-2.62,2.02,1.37,0.5],

  // test 1:
  [-0.45,-0.74,-0.72,0.24,-0.23,-0.77,-1.84,2.99,1.77,-0.87,-2.70,2.60,1.85,2.67,-1.51,2.25,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.],
  [2.24,-2.81,2.28,0.94,0.49,-1.09,2.79,0.63,0.04,-0.43,-0.07,2.23,0.10,0.16,0.80,-0.83,0.08,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0],

];

(async()=>{

  const w = 768;
  const h = 768;
  const w2 = w/2;
  const h2 = h/2;
  const DEC_MULL = 0.1;

  const mCanvas = new Canvas({
    w, h, output: './test.png',
  });


  mCanvas.drawRelRect( 0, 0, w, h, '#00F', '#111', 1 );

  // 2x
  // const radStep = (Math.PI *2) / (data[0].length *2);
  // 1x
  // const radStep = (Math.PI *2) / data.length;

  const radStep = (Math.PI /1) / data[0].length;

  console.json({
    radStep,
    items: data[0].length,
  });

  const normalized = false;

  for( let rad = 0, index = 0; rad < (Math.PI /1); rad += (radStep), index++ ){
    console.log({index, rad });

    if( normalized ){
      const rad_0 = rad;
      const a0_x = w2 +( Math.cos( rad_0 ) * ( w *DEC_MULL ) * data[ 0 ][ index ] );
      const a0_y = h2 +( Math.sin( rad_0 ) * ( w *DEC_MULL ) * data[ 0 ][ index ] );
      mCanvas.drawRelLine( w2, h2, a0_x, a0_y, '#00F', 1 );      
    }else{
      const rad_0 = rad;
      const a0_x = w2 +( Math.cos( rad_0 ) * ( w *DEC_MULL ) * (data[ 0 ][ index ] +data[ 1 ][ index ] ) );
      const a0_y = h2 +( Math.sin( rad_0 ) * ( w *DEC_MULL ) * (data[ 0 ][ index ] +data[ 1 ][ index ] ) );
      mCanvas.drawRelLine( w2, h2, a0_x, a0_y, '#00F', 1 );      
    }


    // const rad_1 = (rad) + Math.PI;
    // const a1_x = w2 +( Math.cos( rad_1 ) * ( w *DEC_MULL ) * (data[ 1 ][ index ] -data[ 0 ][ index ] ) );
    // const a1_y = h2 +( Math.sin( rad_1 ) * ( w *DEC_MULL ) * (data[ 1 ][ index ] -data[ 0 ][ index ] ) );
    // mCanvas.drawRelLine( w2, h2, a1_x, a1_y, '#F00', 1 );

  }

  // await mCanvas.test();
  await mCanvas.save();

})();
