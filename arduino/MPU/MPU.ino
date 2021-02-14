#include <math.h>
#include <Wire.h>
#include <MPU6050.h>
#include <Servo.h>

// mega => SRAM: 8 KB
#define MAX_READING_P_180_DEG 200 // (336.0 rp/s) / 2.0
#define SERIAL_SPEED 115200
#define ESC_MIN_MSEC 800
#define ESC_WORK_MSEC 920
#define ESC_MAX_MSEC 1300 // => 2400 real-value

#define ESC_PIN A2
#define PROP_INT 2
#define ARM_INT 3

// LOW to trigger the interrupt whenever the pin is low,
// CHANGE to trigger the interrupt whenever the pin changes value
// RISING to trigger when the pin goes from low to high,
// FALLING for when the pin goes from high to low.

// 4s => 16.8v
// 1200kv
// => 1200.0 * 16.8 == 20,160.00 rp/m
// => (1200.0 * 16.8) /60.0 == 336.0 rp/s => 672 interrupts

// Digital Pins With Interrupts Mega2560
// 2, 3, 18, 19, 20, 21

void toggleArm();
void intFunc();
void cleanUpData();
void updateEsc();

MPU6050 mpu;
Servo esc;

uint8_t isArmed = 0;
uint8_t isRevPast = 0;
uint8_t isStarted = 0;
uint8_t currSide = 1;
uint8_t useNormVector = 1;

uint8_t lowPast = 0;
uint8_t hightPast = 0;
uint8_t revPast = 0;
uint32_t revCounter = 0;

float a0[3] = { 0, 0, 0 };
float a1[3] = { 0, 0, 0 };

int16_t f_x = 0;
int16_t f_y = 0;
int16_t f_z = 0;

void setup() {

  Serial.begin( SERIAL_SPEED );
  // Serial.println("Initialize MPU6050");
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G)){
    // Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(1000);
  }

  cleanUpData();

  attachInterrupt( digitalPinToInterrupt(PROP_INT), intFunc, RISING ); // FALLING, RISING
  attachInterrupt( digitalPinToInterrupt(ARM_INT), toggleArm, FALLING );

  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(ESC_PIN, OUTPUT);
  pinMode(A3, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  esc.attach( ESC_PIN );
  esc.writeMicroseconds( ESC_MIN_MSEC );
  digitalWrite( LED_BUILTIN, isArmed );

  f_x = mpu.getAccelOffsetX();
  f_y = mpu.getAccelOffsetY();
  f_z = mpu.getAccelOffsetZ();

}

unsigned long loop_time_t = millis();
float dx = 0;
float dy = 0;
float dz = 0;

void loop(){

  if( !isArmed ){
    esc.writeMicroseconds( ESC_MIN_MSEC );
    delay(100);
    return;
  }

  if( !isStarted ){
    // delay(100);


    /*
    if( useNormVector ){
      Vector nAcc = mpu.readNormalizeAccel();
      dx = nAcc.XAxis + 0;
      dy = nAcc.YAxis + 0;
      // dz = nAcc.ZAxis + 0;

    }else{
      Vector nAcc = mpu.readRawAccel();
      dx = nAcc.XAxis + f_x;
      dy = nAcc.YAxis + f_y;
      // dz = nAcc.ZAxis + f_z;
    }
    */

    /*
    // Serial.print(" rev: "); Serial.print( revCounter );
    // Serial.print(" u:"); Serial.print( useNormVector ? 10 : 10000 );
    Serial.print(" u:"); Serial.print( 10000 );
    Serial.print(" dx:"); Serial.print( dx );
    Serial.print(" dy:"); Serial.print( dy );
    Serial.print(" d:"); Serial.print( -10000 );
    // Serial.print(" d:"); Serial.print( useNormVector ? -10 : -10000  );
    // Serial.print(" dz:"); Serial.print( dz );
    Serial.println();
    */
    
    // delay(1);
    return;
  }

  unsigned long time_t = millis(); 
  if( loop_time_t +1000 < time_t ){
    loop_time_t = time_t;
    // Serial.print(" revCounter: [0]: "); Serial.println(revCounter *60);
    // revCounter = 0;
    // isRevPast = 1;
    updateEsc();
  }

  if( isRevPast ){
    isRevPast = !isRevPast;

    // Vector nAcc = mpu.readNormalizeAccel();
    // Vector nAcc = mpu.readRawAccel();

    if( useNormVector ){
      Vector nAcc = mpu.readNormalizeAccel();
      dx = nAcc.XAxis + 0;
      dy = nAcc.YAxis + 0;
      // dz = nAcc.ZAxis + 0;

    }else{
      Vector nAcc = mpu.readRawAccel();
      dx = nAcc.XAxis + f_x;
      dy = nAcc.YAxis + f_y;
      // dz = nAcc.ZAxis + f_z;
    }

    // Serial.print(" rev: "); Serial.print( revCounter );
    Serial.print(" u:"); Serial.print( useNormVector ? 10 : 10000 );
    Serial.print(" dx:"); Serial.print( dx );
    Serial.print(" dy:"); Serial.print( dy );
    Serial.print(" d:"); Serial.print( useNormVector ? -10 : -10000  );
    Serial.println();

  }

}

void intFunc(){

  if( !isArmed ) return;
  currSide = !currSide;
  isStarted = 1;

  if( !currSide ){
    if( hightPast ) 
      lowPast = 1;

    // a0[ 0 ] = nAcc.XAxis;
    // a0[ 1 ] = nAcc.YAxis;
    // a0[ 2 ] = nAcc.ZAxis;

  }else{
    hightPast = 1;
    // a1[ 0 ] = nAcc.XAxis;
    // a1[ 1 ] = nAcc.YAxis;
    // a1[ 2 ] = nAcc.ZAxis;
  }

  isRevPast = 1;

  revPast = ( lowPast && hightPast );
  if( revPast ){
    revCounter++;  
    lowPast = 0;
    hightPast = 0;
    isRevPast = 1;
  }

}

void updateEsc(){
  if( !isArmed ) return;
  uint16_t a1 = analogRead(A1);
  uint16_t a1_map = map(a1, 0, 500, 2400, 600 ); 
  // Serial.print(" a1_map: "); Serial.println(a1_map);
  esc.writeMicroseconds( a1_map );
}

void cleanUpData(){ }

unsigned long armToggle_time_t = 0; 
void toggleArm(){

  unsigned long time_t = millis(); 

  if( armToggle_time_t +250 > time_t )
    return;

  armToggle_time_t = time_t;

  if( isArmed ){

    // // Serial.print("a0: ");
    // for( uint16_t i=0; i<MAX_READING_P_180_DEG; i++ ){
    //   float a0x = side_0_x[ i ];
    //   float a0y = side_0_y[ i ];
    //   float a0 = atan2( a0y, a0x );
    //   Serial.print( a0 ); Serial.print(",");
    // }
    // Serial.println("");

    // // Serial.print("a1: ");
    // for( uint16_t i=0; i<MAX_READING_P_180_DEG; i++ ){
    //   float a1x = side_1_x[ i ];
    //   float a1y = side_1_y[ i ];
    //   float a1 = atan2( a1y, a1x );
    //   Serial.print( a1 ); Serial.print(",");
    // }
    // Serial.println("");

  }

  // cleanUpData();
  revCounter = 0;
  currSide = 1;
  isArmed = !isArmed;
  digitalWrite( LED_BUILTIN, isArmed );
  updateEsc();
  // Serial.print(" toggleArm: "); Serial.println(isArmed);
  delay( 250 );
}
