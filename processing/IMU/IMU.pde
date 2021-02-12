import processing.serial.*;

// 4s => 16.8v
// 1200kv
// => 1200.0 * 16.8 == 20,160.00 rp/m
// => (1200.0 * 16.8) /60.0 == 336.0 rp/s

Serial mega;
final static int SPEED = 115200;

void setup() {
  size(640, 360);
  frameRate(30);
  noLoop();

  String[] ports = Serial.list();
  String serialPort = "";
  boolean foundDevice = false;

  for(String port : ports ){
    // println( port );
    String[] m = match(port, "/dev/ttyUSB*");
    if( m.length > 0 ){
      foundDevice = true;
      serialPort = port;
      break;
    }
  }

  if( !foundDevice ){
    println("Serial device not found");
    return;
  }

  mega = new Serial(this, serialPort, SPEED);
  // mega.write("...");

}

void draw() { 

  /*
  if ( mega.available() > 0) {
    String val = mega.readStringUntil('\n');
  }
  */
  
  // stroke(255);
  // background(0);
} 

void mousePressed() {
  // loop();
}
