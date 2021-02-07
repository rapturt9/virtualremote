/* rawSend.ino Example sketch for IRLib2
 *  Illustrates how to send a code Using raw timings which were captured
 *  from the "rawRecv.ino" sample sketch.  Load that sketch and
 *  capture the values. They will print in the serial monitor. Then you
 *  cut and paste that output into the appropriate section below.
 */
#include "IRLibAll.h"
#include <IRLib_HashRaw.h>    //Only use raw sender
#include <WebUSB.h>

IRdecode myDecoder;   //create decoder

IRrecvPCI myReceiver(2);//pin number for the receiver

//IRsendRaw mySender;
IRsend mySender;

WebUSB WebUSBSerial(1 /* https:// */, "virtualremote.biz");

#define Serial WebUSBSerial

int arr[5];
int index;

void setup() {
  Serial.begin(9600);
  delay(2000); while (!Serial); //delay for Leonardo
  myReceiver.enableIRIn(); // Start the receiver
  Serial.println(F("Every time you press a key is a serial monitor we will send."));
}
/* Cut and paste the output from "rawRecv.ino" below here. It will 
 * consist of a #define RAW_DATA_LEN statement and an array definition
 * beginning with "uint16_t rawData[RAW_DATA_LEN]= {…" and concludes
 * with "…,1000};"
 */






/*
 * Cut-and-paste into the area above.
 */
int lastProt=1;
long long lastMes=3772833823;
   
void loop() {
  if (Serial.available()) {
    arr[index++] = Serial.read();
    if (index == 5) {
      index = 0;
      lastProt=arr[0];
      lastMes=arr[4]*256L*256L*256L+arr[3]*256L*256L+arr[2]*256L+arr[1];
      mySender.send(lastProt,lastMes);
    }
    
  }
  if (myReceiver.getResults()) { 
    myDecoder.decode();           //Decode it
    Serial.print(myDecoder.protocolNum);
     Serial.print(",");
    Serial.print(myDecoder.value);
    Serial.flush();
    myReceiver.enableIRIn();      //Restart receiver
  }
}
