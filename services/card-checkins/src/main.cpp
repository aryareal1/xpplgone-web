#include <Arduino.h>
#include <SPI.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <MFRC522.h>
#include "secrets.h"

#define SS_PIN 5
#define RST_PIN 4

MFRC522 mfrc522(SS_PIN, RST_PIN);

#define LED_PIN 2

void setup()
{
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  SPI.begin();
  mfrc522.PCD_Init();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP: " + WiFi.localIP().toString());
  Serial.println("RFID ready. Tap card...");
}

String readUID()
{
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  uid.trim();
  return uid;
}

// POST /iots/attendance, returns true on HTTP 200.
bool sendAttendance(String uid)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("✗ WiFi not connected");
    return false;
  }

  HTTPClient http;
  http.begin(API_URL "/iots/attendance");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " ACCESS_KEY);

  String body = "{\"uid\":\"" + uid + "\"}";
  int code = http.POST(body);

  if (code <= 0)
  {
    Serial.println("✗ Request failed: " + http.errorToString(code));
    http.end();
    return false;
  }

  String resp = http.getString();
  Serial.println("HTTP " + String(code) + ": " + resp);
  http.end();

  if (code != 200)
    return false;

  JsonDocument doc;
  DeserializationError err = deserializeJson(doc, resp);
  if (err)
  {
    Serial.println("✗ Bad JSON: " + String(err.c_str()));
    return false;
  }
  Serial.println("✓ " + String(doc["message"].as<const char *>()) + " — " + String(doc["data"]["name"].as<const char *>()));
  return true;
}

void blink(int times)
{
  for (int i = 0; i < times; i++)
  {
    digitalWrite(LED_PIN, HIGH);
    delay(150);
    digitalWrite(LED_PIN, LOW);
    delay(150);
  }
}

void loop()
{
  if (!mfrc522.PICC_IsNewCardPresent())
    return;
  if (!mfrc522.PICC_ReadCardSerial())
    return;

  String uid = readUID();
  Serial.println("UID read: " + uid);

  if (sendAttendance(uid))
    blink(2);
  else
    blink(1);

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}