#include <math.h>
#include <Wire.h>
#include <MPU6050.h>
#include <Servo.h>

// mega => SRAM: 8 KB
#define MAX_READING_P_180_DEG 200 // (336.0 rp/s) / 2.0

// 4s => 16.8v
// 1200kv
// => 1200.0 * 16.8 == 20,160.00 rp/m
// => (1200.0 * 16.8) /60.0 == 336.0 rp/s => 672 interrupts

// Digital Pins With Interrupts Mega2560
// 2, 3, 18, 19, 20, 21

void toggleArm();
void intFunc();
void cleanUpData();

MPU6050 mpu;
Servo esc;
uint16_t mDealy = 50;
uint8_t isArmed = 1;
uint8_t currSide = 0;

uint8_t low_past = 0;
uint8_t hight_past = 0;
uint8_t rev_past = 0;
uint8_t started = 0;

unsigned long time_t = millis(); 
unsigned long side_0_t = millis(); 
unsigned long side_1_t = millis(); 

uint16_t side_0_readings = 0;
uint16_t side_1_readings = 0;

uint16_t side_0_angs = 0;
uint16_t side_1_angs = 0;

float side_0_x[ MAX_READING_P_180_DEG ];
float side_0_y[ MAX_READING_P_180_DEG ];
float side_0_z[ MAX_READING_P_180_DEG ];

float side_1_x[ MAX_READING_P_180_DEG ];
float side_1_y[ MAX_READING_P_180_DEG ];
float side_1_z[ MAX_READING_P_180_DEG ];

void setup() {

  Serial.begin(115200);
  Serial.println("Initialize MPU6050");
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G)){
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(1000);
  }

  cleanUpData();

  // mpu.setAccelOffsetX();
  // mpu.setAccelOffsetY();
  // mpu.setAccelOffsetZ();

  attachInterrupt( digitalPinToInterrupt(2), intFunc, FALLING );
  attachInterrupt( digitalPinToInterrupt(3), toggleArm, CHANGE );

  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(A2, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  esc.attach( A2 );
  esc.writeMicroseconds( 800 );

}

uint32_t counter = 0;

void loop(){

  digitalWrite( LED_BUILTIN, isArmed );

  Serial.println( counter++ );
  delay(100);
  return;

  if( !isArmed || !started ){
    delay(100);
    return;
  }

  Vector nAcc = mpu.readNormalizeAccel();

  if( !currSide ){
    if( side_0_readings < MAX_READING_P_180_DEG ){
      side_0_x[ side_0_readings ] = nAcc.XAxis;
      side_0_y[ side_0_readings ] = nAcc.YAxis;
      side_0_z[ side_0_readings ] = nAcc.ZAxis;
      side_0_readings++;
    }
  }else{
    if( side_1_readings < MAX_READING_P_180_DEG ){
      side_1_x[ side_1_readings ] = nAcc.XAxis;
      side_1_y[ side_1_readings ] = nAcc.YAxis;
      side_1_z[ side_1_readings ] = nAcc.ZAxis;
      side_1_readings++;
    }
  }

  delay(1);

  // uint16_t a1 = analogRead(A1);
  // uint16_t a1_map = map(a1, 0, 500, 2400, 600 ); 
  // Serial.print(" a1_map: "); Serial.print(a1_map);
}

void intFunc(){

  if( !isArmed ) return;

  if( !started ){
    started = 1;
  }else{
    currSide = !currSide;
  }

  if( !currSide ){
    side_0_t = millis();
    // side_0_readings = 0;
    if( hight_past )
      low_past = 1;
  }else{
    side_1_t = millis();
    // side_1_readings = 0;
    hight_past = 1;
  }

  rev_past = ( low_past && hight_past );
  if( rev_past ){
    low_past = 0;
    hight_past = 0;
  }

  if( !rev_past ) return;

  side_0_angs = 180.0 / (float)side_0_readings;
  side_1_angs = 180.0 / (float)side_1_readings;

  uint16_t lessRedings = side_0_readings > side_1_readings 
    ? side_1_readings 
    : side_0_readings;

  float delta_a[ lessRedings ];
  float maxOffset = 0;
  float maxIndex = 0;

  float minOffset = 0;
  float minIndex = 0;

  for( uint16_t i=0; i<lessRedings; i++ ){
    float a0x = side_0_x[ i ];
    float a0y = side_0_y[ i ];
    float a0 = atan2( a0y, a0x );

    float a1x = side_1_x[ i ];
    float a1y = side_1_y[ i ];
    float a1 = atan2( a1y, a1x );

    delta_a[ i ] = (a0 -a1);

    if( delta_a[ i ] > maxOffset ){
      maxOffset = delta_a[ i ];
      maxIndex = i;
    }

    if( delta_a[ i ] < minOffset ){
      minOffset = delta_a[ i ];
      minIndex = i;
    }

  }

  // float relAngle = biggestIndex * side_0_angs;

  Serial.print(" min-i: "); Serial.print(minIndex);
  Serial.print(" min-v: "); Serial.print(minOffset);

  Serial.print(" max-i: "); Serial.print(maxIndex);
  Serial.print(" max-v: "); Serial.print(maxOffset);

  Serial.println("");

  side_0_readings = 0;
  side_1_readings = 0;

}

void cleanUpData(){
  for( uint16_t i = 0; i < MAX_READING_P_180_DEG; i++ ){
    side_0_x[ i ] = 0.0f;
    side_0_y[ i ] = 0.0f;
    side_0_z[ i ] = 0.0f;
    side_1_x[ i ] = 0.0f;
    side_1_y[ i ] = 0.0f;
    side_1_z[ i ] = 0.0f;
  }
}

void toggleArm(){
  isArmed = !isArmed;
  delay( 250 );
}
