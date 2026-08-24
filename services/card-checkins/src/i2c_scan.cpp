#include <Arduino.h>
#include <Wire.h>

// ESP32 DOIT devkit v1: SDA=21, SCL=22
#define I2C_SDA 21
#define I2C_SCL 22

void setup()
{
  Serial.begin(115200);
  Wire.begin(I2C_SDA, I2C_SCL);
  Serial.println("Scanning I2C...");
}

void loop()
{
  bool found = false;
  for (byte addr = 1; addr < 127; addr++)
  {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0)
    {
      Serial.print("Ditemukan alamat I2C: 0x");
      Serial.println(addr, HEX);
      found = true;
    }
  }
  if (!found)
    Serial.println("Ga ada device I2C terdeteksi.");

  Serial.println("---");
  delay(5000);
}
