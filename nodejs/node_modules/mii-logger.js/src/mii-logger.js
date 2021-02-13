// TODO: Create NPM Repo => 

// 'use strict';

const strict = ( function () { return !!!this } ) ()

if( console.__MII_LOGGER__ ){
  // Already Importen
  return true;
}

console.__MII_LOGGER__ = true;

const _fs = require('fs');
const _os = require('os');
const _chi = require('child_process');
const _path = require('path');
const _crypto = require('crypto');

let allowPrint = true;
let _logTime = true;
let _logColor = true;

let gray = "\033[01;30m";
let red = "\033[01;31m";
let green = "\033[01;32m";
let blue = "\033[01;34m";
let yellow = "\033[01;33m";
let purple = "\033[01;35m";
let blue2 = "\033[01;36m";
let white = "\033[01;37m";
let endl = "\033[0m";

let l_gray = "\033[00;30m";
let l_red = "\033[00;31m";
let l_green = "\033[00;32m";
let l_yellow = "\033[00;33m";
let l_blue = "\033[00;34m";
let l_purple = "\033[00;35m";
let l_blue2 = "\033[00;36m";
let l_white = "\033[00;37m";
let _endl = "\033[0m";

// NO_COLOUR="\[\033[0m\]"
// LIGHT_WHITE="\[\033[1;37m\]"
// WHITE="\[\033[0;37m\]"
// GRAY="\[\033[1;30m\]"
// BLACK="\[\033[0;30m\]"

// RED="\[\033[0;31m\]"
// LIGHT_RED="\[\033[1;31m\]"
// GREEN="\[\033[0;32m\]"
// LIGHT_GREEN="\[\033[1;32m\]"
// YELLOW="\[\033[0;33m\]"
// LIGHT_YELLOW="\[\033[1;33m\]"
// BLUE="\[\033[0;34m\]"
// LIGHT_BLUE="\[\033[1;34m\]"
// MAGENTA="\[\033[0;35m\]"
// LIGHT_MAGENTA="\[\033[1;35m\]"
// CYAN="\[\033[0;36m\]"
// LIGHT_CYAN="\[\033[1;36m\]"

function R( data ){ return red +data +endl; }
function G( data ){ return green +data +endl; }
function B( data ){ return blue +data +endl; }
function Y( data ){ return yellow +data +endl; }
function P( data ){ return purple +data +endl; }
function W( data ){ return white +data +endl; }
function LR( data ){ return l_red +data +endl; }
function LG( data ){ return l_green +data +endl; }
function LB( data ){ return l_blue +data +endl; }
function LY( data ){ return l_yellow +data +endl; }
function LP( data ){ return l_purple +data +endl; }
function LW( data ){ return l_white +data +endl; }

module.exports.R = R; module.exports.LR = LR;
module.exports.G = G; module.exports.LG = LG;
module.exports.B = B; module.exports.LB = LB;
module.exports.Y = Y; module.exports.LY = LY;
module.exports.P = P; module.exports.LP = LP;
module.exports.W = W; module.exports.LW = LW;

console.R = R; console.LR = LR;
console.G = G; console.LG = LG;
console.B = B; console.LB = LB;
console.Y = Y; console.LY = LY;
console.P = P; console.LP = LP;
console.W = W; console.LW = LW;

// console.log( console.R('RED')+' => '+console.G('GREEN')+' => '+console.B('BLUE') );

const console_error = console.error;
const console_warn  = console.warn;
const console_info  = console.info;
const console_log   = console.log;
const console_table = console.table;

// --------------------------------------------------------------------
console.U = {
  s: { // Shade characters
    s0: '░', // :U+2591 (alt-09617) LIGHT SHADE
    s1: '▒', // :U+2592 (alt-09618) MEDIUM SHADE
    s2: '▓', // :U+2593 (alt-09619) DARK SHADE
  },
  b:{ // Block elements
    upper_half_block : '▀', // :U+2580 (alt-09600) UPPER HALF BLOCK
    lower_half_block : '▄', // :U+2584 (alt-09604) LOWER HALF BLOCK
    left_half_block : '▌', // :U+258C (alt-09612) LEFT HALF BLOCK
    right_half_block : '▐', // :U+2590 (alt-09616) RIGHT HALF BLOCK
    solid_block : '█', // :U+2588 (alt-09608) FULL BLOCK = solid

    v0: '▁', //:U+2581 (alt-09601) LOWER ONE EIGHTH BLOCK
    v1: '▂', //:U+2582 (alt-09602) LOWER ONE QUARTER BLOCK
    v2: '▃', //:U+2583 (alt-09603) LOWER THREE EIGHTHS BLOCK
    v3: '▄', //:U+2584 (alt-09604) ***
    v4: '▅', //:U+2585 (alt-09605) LOWER FIVE EIGHTHS BLOCK
    v5: '▆', //:U+2586 (alt-09606) LOWER THREE QUARTERS BLOCK
    v6: '▇', //:U+2587 (alt-09607) LOWER SEVEN EIGHTHS BLOCK
    v7: '█', // :U+2588 (alt-09608) FULL BLOCK = solid

    h0: '▏', // :U+258F (alt-09615) LEFT ONE EIGHTH BLOCK
    h1: '▎', // :U+258E (alt-09614) LEFT ONE QUARTER BLOCK
    h2: '▍', // :U+258D (alt-09613) LEFT THREE EIGHTHS BLOCK
    h3: '▌', // :U+258C (alt-09612) ***
    h4: '▋', // :U+258B (alt-09611) LEFT FIVE EIGHTHS BLOCK
    h5: '▊', // :U+258A (alt-09610) LEFT THREE QUARTERS BLOCK
    h6: '▉', // :U+2589 (alt-09609) LEFT SEVEN EIGHTHS BLOCK
    h7: '█', // :U+2588 (alt-09608) FULL BLOCK = solid
  },
}







// --------------------------------------------------------------------
// Override below
let timers = {}
let console_time   = console.time;
let console_timeEnd   = console.timeEnd;
let TAB = '    ';
let NL = "\n";

function getFuncArg( args ){

  let output = '';
  let types = { 'object':1, 'function':1 };

  try{

    for (let i in args)
      output += ( types.hasOwnProperty( typeof args[i] ) ) ? JSON.stringify( args[i] )+', ' : args[i]+', ';

  }catch(e) {
    console_log( e );
    output = red+' Error while compiling logging data-string from arguments ....'+endl;
  }

  if( output.lastIndexOf(', ') != -1 )
    output = output.substr( 0, output.lastIndexOf(', ') )

  return output;

  try{

    for (let i in args) {

      if( typeof args[i] === "object" ){

        output += NL;

        for( let key in args[i] ){

          if( typeof args[i][ key ] === "object" ){
            for( let key_2 in args[i][ key ] ){
              output += TAB+key_2+' => '+args[i][ key ][ key_2 ]+', '+NL;
            }

          }else{
            output += TAB+key+' => '+args[i][ key ]+' '+NL;
          }

        }

      }else{ output += args[i]; }

    }

  }catch(e) {
    console_log( e );
    output = red+' Error while compiling logging data-string from arguments ....'+endl;
  }

  if( output.substr(0, 1) != ' ' ) output = ' '+output;
  return output;

}

function getlLogDate(){

    let D = new Date();

    let d = D.getDate();          // Get the day as a number (1-31)
    let m = D.getMonth();         // Get the month (0-11)
    let Y = D.getFullYear();      // Get the four digit year (yyyy)

    let H = D.getHours();         // Get the hour (0-23)
    let i = D.getMinutes();       // Get the minutes (0-59)
    let s = D.getSeconds();       // Get the seconds (0-59)
    // let ms = D.getTime();      // Get the time (milliseconds since January 1, 1970)

    d = d < 10 ? '0'+d : d;
    m = m < 10 ? '0'+m : m;

    H = H < 10 ? '0'+H : H;
    i = i < 10 ? '0'+i : i;
    s = s < 10 ? '0'+s : s;

    return ' ['+H+':'+i+':'+s+']';
    // return ' ['+d+'-'+m+'-'+Y+']';
    // return ' ['+d+'-'+m+'-'+Y+' '+H+':'+i+':'+s+']';

}

function processArgs( args ){

  try{
    let res = [];

    for( let i in args ){

      // if( args[ i ] && typeof args[ i ] !== "undefined" && args[ i ].message && args[ i ].message !== "undefined" ){
      if( args[ i ] instanceof Error ){

        console_log( l_white+getlLogDate()+endl+'[*] : '+R(' #Exception: '+args[ i ].message));
        let stack = args[ i ].stack.split("\n");

        for( let si=1; si<stack.length; si++ )
          console_log( l_white+getlLogDate()+endl+'[*] : '+R('     ['+si+']: '+( stack[ si ].trim() ) ) );

      }else{
        res.push( args[ i ] );
      }

    }

    return res;
  }catch( e ){
    console_log(' logger Exception: '+e.message );
    return ['Exception:', e.message];
  }

}

console.logTime = ( val )=>{
  _logTime = (val);
}

console.logColor = ( val )=>{
  _logColor = (val);
}

const logLine = ' ----  ----  ----  ----  ----  ----  ----  ----  ---- ';
console.line = function(){
  if( !allowPrint ) return;
  if( _logColor ){
    console.log( l_white+logLine+endl );
  }else{
    console.log( logLine );
  }
}

console.log = function(){
  if( !allowPrint ) return;
  let args = processArgs( arguments );

  if( _logColor ){
    let pre = _logTime ? l_white+getlLogDate()+endl+'[L] : ' : '';
    console_log( pre+l_white+getFuncArg( args )+endl );
  }else{
    let pre = _logTime ? getlLogDate()+'[L] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }

}

console.info = function(){
  if( !allowPrint ) return;

  let args = processArgs( arguments );

  if( _logColor ){
    let pre = _logTime ? l_white+getlLogDate()+_endl+'[I] : ' : '';
    console_log( pre+blue+getFuncArg( args )+_endl );
  }else{
    let pre = _logTime ? getlLogDate()+'[I] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }

}

console.info2 = function(){
  if( !allowPrint ) return;

  let args = processArgs( arguments );

  if( _logColor ){
    let pre = _logTime ? l_white+getlLogDate()+endl+'[I] : ' : '';
    console_log( pre+l_blue2+getFuncArg( args )+endl );
  }else{
    let pre = _logTime ? getlLogDate()+'[I] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }

}

console.ok = function(){
  if( !allowPrint ) return;

  let args = processArgs( arguments );
  if( _logColor ){
    let pre = _logTime ? l_white+getlLogDate()+endl+'[O] : ' : '';
    console_log( pre+green+getFuncArg( args )+endl );
  }else{
    let pre = _logTime ? getlLogDate()+'[O] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }

}

console.warn = function(){
  if( !allowPrint ) return;

  let args = processArgs( arguments );

  if( _logColor ){
    let pre = _logTime ? l_white+getlLogDate()+endl+'[W] : ' : '';
    console_log( pre+yellow+getFuncArg( args )+endl );
  }else{
    let pre = _logTime ? getlLogDate()+'[W] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }

}

console.error = function(){

  let args = processArgs( arguments );

  if( _logColor ){
    let pre = _logTime ? l_white+getlLogDate()+endl+'[E] : ' : '';
    console_log( pre+red+getFuncArg( args )+endl );
  }else{
    let pre = _logTime ? getlLogDate()+'[E] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }

}

console.debug = function(){
  if( !allowPrint ) return;
  let args = processArgs( arguments );

  if( _logColor ){
    let pre = _logTime ? l_white+getlLogDate()+endl+'[D] : ' : '';
    console_log( pre+purple+getFuncArg( args )+endl );
  }else{
    let pre = _logTime ? getlLogDate()+'[D] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }
}

console.nocol = function(){
  if( !allowPrint ) return;
  let args = processArgs( arguments );
  let pre = _logTime ? getlLogDate()+'[N] : ' : '';
  console_log( pre+getFuncArg( args ) );
}

console.p = function(){
  if( !allowPrint ) return;

  let args = processArgs( arguments );
  if( _logColor ){
    let pre = _logTime ? l_white+getlLogDate()+endl+'[P] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }else{
    let pre = _logTime ? getlLogDate()+'[P] : ' : '';
    console_log( pre+getFuncArg( args ) );
  }

}

console.watch = function(){
  if( !allowPrint ) return;
  if( _logColor ){
    console_info( purple+getlLogDate()+endl+'[H] : '+purple+getFuncArg( arguments )+endl );
  }else{
    console_info( getlLogDate()+'[H] : '+getFuncArg( arguments ) );
  }
}

console.force = function(){ // FORCE STDOUT
  // if( !allowPrint ) return;

  if( _logColor ){
    console_info( l_white+getlLogDate()+endl+'[H] : '+green+getFuncArg( arguments )+endl );
  }else{
    console_info( getlLogDate()+'[H] : '+getFuncArg( arguments ) );
  }
}

console.json = function( obj, format=true, indent=2, lineByLine=true ) {

  if( format ){
    let res = typeof obj === 'object' ? JSON.stringify( obj, null, indent ) : obj;
    if( lineByLine ){
      res = (''+res).split("\n");
      for( let i in res ){
        console.log( res[ i ] );
      }
    }else{
      console.log( res );
    }
  }else{
    let res = typeof obj === 'object' ? JSON.stringify( obj ) : obj;
    console.log( res );
  }

};

console.toJson = function( obj, format=false, indent=2 ) {

  try{ 
    if( format ){
      let res = typeof obj === 'object' ? JSON.stringify( obj, null, indent ) : obj;
      return res;
    }else{
      let res = typeof obj === 'object' ? JSON.stringify( obj ) : obj;
      return res;
    }
  }catch( e ){
    return console.toJson({ method:'console.toJson', error: e.message});
  }

};

console.mute = function(){
  console.warn(' #logger: is disabled');
  allowPrint = false;
}

console.unMute = function(){
  allowPrint = true;
  console.ok(' #logger: is enabled');
}

// console.dir = function( mObj, padding=' ' ){
//   Object.keys(mObj).map((key)=>{
//     console.log({key, type: typeof mObj[ key ] });
//   });
// }

console.printObjectTree = function( mObj, maxDepth=7 ) {

  try{

    // getlLogDate()'[H] :.log(' #createObjectTree');
    let currDepth = -1;

    function _getType( mObj ){
      return (typeof mObj);
    }

    function _isObj( mObj ){
      return mObj !== null && mObj !== undefined &&  _getType( mObj ) === 'object';
    }

    function _print( pd, key, type ){
      console.log( pd+' ['+key+'] => ['+type+']' );
    }

    function _getObjKeys( mObj ){
      return Object.keys( mObj );
    }

    function _mkTree( pd, mObj, depth ){

      let keys = _getObjKeys( mObj );
      let allowNext = (depth) <= maxDepth;

      keys.map((key)=>{
        _print( pd, key, _getType( mObj[ key ] ) );
        if( _isObj( mObj[ key ] ) && allowNext ){
          _mkTree( pd+'  ', mObj[ key ], (depth+1) );
        }

      });

    }

    _mkTree( ' ', mObj, currDepth );
  }catch(e){
    console.error(e);
  }

};

console.randInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.randFloat = function(min, max){
  return Math.random() * (max - min + 1) + min;
}

console.getHostname = function(){
  return _os.hostname().trim();
}

console.getFileInfo = function( path ){
  try{ 
    return _fs.statSync(path); // .isDirectory(); 
  }catch( e ){
    return false;
  }
}

console.isFile = function( path ){
  const info = console.getFileInfo( path );
  // console.json({info});
  return info && !info.isDirectory();
  // return console.isFile => [ info &&  => will return wrong result, if file (is-unix-socket) =>  info.isFile() ];
};

console.isDir = function( path ){
  const info = console.getFileInfo( path );
  return info && info.isDirectory();
};

console.getAbsPath = function( relPath ){

  try{
    return _path.resolve( relPath );
  }catch(e){
    console.error(' console.getAbsPath: Exception: '+e.message);
    // console.error( e );
    return false;
  }
};


console.readDir = function ( path ){

  try{ 
    return _fs.readdirSync( path );
  }catch( e ){
    console.error(' console.readDir: Exception: '+e.message);
    // console.error( e );
    return [];
  }

};

console.listDir = function( path ){
  return console.readDir( path );
}

console.writeFileSync = function( path, data, encoding='utf-8' ){

  try{ 

    while( path.replace(/\/\//gi,'/') != path )
      path = path.replace(/\/\//gi,'/');
    return _fs.writeFileSync( path, data, encoding );

  }catch( e ){
    console.error(' console.writeFileSync: ['+path+'] Exception: '+e.message);
    return false;
  }

};

console.appendFileSync = function( path, data ){
  try{ 
    while( path.replace(/\/\//gi,'/') != path )
      path = path.replace(/\/\//gi,'/');
    return _fs.appendFileSync( path, data );
  }catch( e ){
    console.error(' console.appendFileSync: ['+path+'] Exception: '+e.message);
    return false;
  }
};

console.readFileSync = function( path, encoding='utf-8' ){

  try{ 

    while( path.replace(/\/\//gi,'/') != path )
      path = path.replace(/\/\//gi,'/');
    // return _fs.readFileSync( console.getAbsPath( path ), encoding );
    return _fs.readFileSync( path, encoding );

  }catch( e ){
    console.error(' console.readFileSync: ['+path+'] Exception: '+e.message);
    return false;
  }

};

console.jsonFromFile = function( path){

  try{ 
    return JSON.parse( console.readFileSync( path ) );
  }catch( e ){
    console.error(' console.jsonFromFile: ['+path+'] Exception: '+e.message);
    return false;
  }

};

console.jsonToFile = function( path, mObj, format=false, indent=2 ){

  try{ 
    mObj = typeof mObj === "object" ? (format ? JSON.stringify(mObj, null, indent) : JSON.stringify(mObj)) : mObj;
    console.writeFileSync( path, mObj );
  }catch( e ){
    console.error(' console.jsonFromFile: ['+path+'] Exception: '+e.message);
    return false;
  }

};

function _hash( func='sha256', rawData, fromEncoding='utf-8', toEncoding='hex' ){
  try{
    return _crypto.createHash( func ).update(rawData, fromEncoding).digest( toEncoding );
  }catch(e){
    console.error(' Hash: ['+func+'] Exception: '+e.message);
    // console.error( e );
    return false;
  }

}

console.hash = {
  sha1: function( rawData, fromEncoding='utf-8', toEncoding='hex' ){
    return _hash( 'sha1', rawData, fromEncoding, toEncoding );
  },
  sha256: function( rawData, fromEncoding='utf-8', toEncoding='hex' ){
    return _hash( 'sha256', rawData, fromEncoding, toEncoding );
  },
  sha384: function( rawData, fromEncoding='utf-8', toEncoding='hex' ){
    return _hash( 'sha384', rawData, fromEncoding, toEncoding );
  },
  sha512: function( rawData, fromEncoding='utf-8', toEncoding='hex' ){
    return _hash( 'sha512', rawData, fromEncoding, toEncoding );
  },
  md5: function( rawData, fromEncoding='utf-8', toEncoding='hex' ){
    return _hash( 'md5', rawData, fromEncoding, toEncoding );
  },
};

console.hash.sha1File = function( fileName ){
  return console.hash.sha1( console.readFileSync( fileName ) );
}

console.hash.sha256File = function( fileName ){
  return console.hash.sha256( console.readFileSync( fileName ) );
}

console.hash.sha384File = function( fileName ){
  return console.hash.sha384( console.readFileSync( fileName ) );
}

console.hash.sha512File = function( fileName ){
  return console.hash.sha512( console.readFileSync( fileName ) );
}

console.hash.md5File = function( fileName ){
  return console.hash.md5( console.readFileSync( fileName ) );
}

console.shell = {

  sync: function( cmd, options={} ){
    try{
      const defOptions = { ...(options||{}) }; // {stdio:[0,1,2]};
      const res = (''+_chi.execSync( cmd, defOptions ));
      // console.log({shell: res});
      return res;
    }catch(e){
      console.error(` #console.shell.sync: ${e.message}`);
      return false;

    }
  },
  async: async ( cmd )=>{
    return new Promise( async(resolve, reject)=>{   
      try{
        _chi.exec( cmd, (error, stdout, stderr)=>{
          if( error ){
            const message = error.message || error;
            resolve( {success:false, message, stdout, stderr } );
            return;
          }

          resolve( {success:true, message: 'OK', data: stdout, stderr } );

        });
      }catch(e){
        console.error(` #console.shell.async: ${e.message}`);
        resolve( {success:false, message: e.message, stdout: null, stderr: null } );
      }
    })
  },
}

console.mkdir = ( path, mode ) => {
  try{ 
    console.shell.sync(' mkdir -p '+console.getAbsPath(path) );
    return true;
  }catch( e ){
    console.error(' #console.mkdir: '+e.message);
    return false;
  }
};

console.createDir = console.mkdir;

// --------------------------------------------------------------------
// [STDOUT]

console.clearLine = ()=>{
  try{
    // const C_LINE = '\x1b[1A'+'\x1b[2K'+'\x1b[1A';
    const C_LINE = '\x1b[1A'+'\x1b[2K'; //+'\x1b[1A';
    process.stdout.write( C_LINE );
  }catch(e){
    console.warn(` #console:clearLine: ${e.message}`);
  }
}

console.getWidth = ()=>{
  try{
    return process.stdout.columns;
  }catch(e){
    console.warn(` #console:getWidth: ${e.message}`);
    return 0;
  }
}
console.getHeight = ()=>{
  try{
    return process.stdout.rows;
  }catch(e){
    console.warn(` #console:getHeight: ${e.message}`);
    return 0;
  }
}

console.getSize = ()=>{
  return {
    w: console.getWidth(),
    h: console.getHeight(),
  }
}

console.lineUp = ()=>{
  try{
    // const C_LINE = '\x1b[1A'+'\x1b[2K'+'\x1b[1A';
    const C_LINE = '\x1b[1A'; //+'\x1b[1A';
    process.stdout.write( C_LINE );
  }catch(e){
    console.warn(` #console:lineUp: ${e.message}`);
  }
}

console.lineDown = ()=>{
  try{
    process.stdout.write('\n');
  }catch(e){
    console.warn(` #console:lineDown: ${e.message}`);
  }
}

console.write = (data)=>{
  try{
    process.stdout.write( data );
  }catch(e){
    console.warn(` #console:write: ${e.message}`);
  }
}

// --------------------------------------------------------------------
console.sleep = async( msec )=>{
  return new Promise( async(resolve, reject)=>{
    try{
      const timeout_t = setTimeout(async()=>{
        resolve(true);
      }, msec);
    }catch(e){
      console.error(' console.sleep: '+e.message);
      resolve(true);
    }
  });
}

console.beep = async( times=1, delay=200 ) => {
  for( let i=0; i<times; i++ ){
    process.stdout.write('\x07');
    await console.sleep( delay );
  }
}

// console.isStrictMode = ()=>{
//   return (typeof this === 'undefined');
// }

console.isStrictMode = ()=>{
  return strict;
}

// console.isStrictMode = ()=>{
//   try{var o={p:1,p:2};}catch(E){return true;}
//   return false;
// }

console.clear = () => {
  try{
    if( !console.isStrictMode() ){
      process.stdout.write('\033c');
    }else{
      console.warn(` console.clear: Octal escape sequences are not allowed in strict mode `);
    }
  }catch(e){
    console.warn(` console.clear: ${e.message}`);
  }
}

// --------------------------------------------------------------------
console.deepClone = ( data )=>{

  try{

    if( !data ) return data;

    let res = Array.isArray( data ) ? [] : typeof data === 'object' ? {} : false;
    if( !res ){
      console.log(` res == false`);
      return data;
    }

    // let foundIndexes = false;
    // let foundKeys = false;

    if( Array.isArray( data ) ){
      for( let i=0; i<data.length; i++ ){
        const isObject = typeof data[ i ] === 'object';
        const isArray = Array.isArray( data[ i ] );
        if( isArray || isObject ){
          // foundIndexes = true;
          res[ i ] = console.deepClone( data[ i ] );
        }else{
          res[ i ] = data[ i ];
        }
      }
    }

    if( typeof data === 'object' && !Array.isArray( data ) ){
      for( const key of Object.keys(data) ){
        const isObject = typeof data[ key ] === 'object';
        const isArray = Array.isArray( data[ key ] );
        if( isArray || isObject ){
          // foundKeys = true;
          res[ key ] = console.deepClone( data[ key ] );
        }else{
          res[ key ] = data[ key ];
        }
      }
    }

    return res;
  }catch(e){
    console.error(e);
    console.log( { data } );
    JSON.parse( JSON.stringify(data) );
  }

}

// --------------------------------------------------------------------
// console argv

console.getArg = ( name ) => {

  const argv = process.argv; // .slice(2);
  const index = argv.indexOf( name.trim() );
  if( index !== -1 && argv[ index +1 ] ){
    return (argv[ index +1 ]).trim();
  }
  return null

}

const timers_t = {};
console.TS = (lable)=>{ timers_t[ lable ] = Date.now(); return timers_t[ lable ]; }
console.TE = (lable)=>{ const res = Date.now() - timers_t[ lable ]; delete timers_t[ lable ];  return res; }
console.F = (val)=>{ return ((+val).toFixed(5)); };

// --------------------------------------------------------------------
module.exports = {
  log : console_log,
  R :R,G :G,B :B,Y :Y,P :P,W :W,
}
