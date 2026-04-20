
# It is time to Work with a real device

[Lastminuteengineers](https://lastminuteengineers.com/getting-started-with-esp32/) and [Random Nerd Tutorial](https://randomnerdtutorials.com/projects-esp32/) are plenty of excellent examples to integrate a multitude of sensors and actuators, and to interact with a number of protocols.

!!! fact

    Exactly the same code you wrote in the simulator, works on the real device, **but in the real device you can do even more!**

* You can easily download the code from Wokwi in the form of a zip project file. 

![](assets/images/2024-12-16-17-01-45.png)

## Reference Hardware

You are free to use any hardware, but most of the examples will be based on the [ESP32](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32/hw-reference/index.html) 

It is relatively cheap and powerful. 
## Arduino IDE

* One convenient possibility is to use [Arduino IDE](https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE) 
* Since we are using the ESP32, you have to follow these [intructions](https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/)
* Select the DOIT ESP32 DEVKIT V1 as in the picture below and upload the code

![](assets/images/2023-07-18-13-48-40.png)

## Platformio 

* Another option is to use [PlatformIO](https://platformio.org/). In particular I like the [vscode extension](https://docs.platformio.org/en/latest/integration/ide/vscode.html).
* [Quick Start](https://docs.platformio.org/en/latest/core/quickstart.html)
* To work with the ESP32, this is the minimal setup for the platformio.ini file

```
[env:esp32dev]
platform = espressif32
;board = esp32dev
board = esp32doit-devkit-v1
framework = arduino
; framework = espidf

; Custom Serial Monitor port
monitor_port = /dev/ttyUSB0

; Custom Serial Monitor speed (baud rate)
monitor_speed = 115200
```

## From [Wokwi](https://wokwi.com/) to a real device

1. Compile the code and on the code editor press F1 to download the firmware. It is a .bin file, let's name it sketch.bin file 
2. ```
   esptool.py --chip esp32 --port "/dev/ttyUSB0" --baud 921600  --before default_reset --after hard_reset write_flash  -z --flash_mode keep --flash_freq keep --flash_size keep 0x1000 "bootloader.bin" 0x8000 "partitions.bin" 0xe000 "boot_app0.bin" 0x10000 "sketch.bin"
   ```
Once partitions and bootloader are uploaded, you can simply upload the sketch. To upload for the first time the partitions and the bootloader you can simply used arduino IDE 

3. ```
   esptool.py --chip esp32 --port "/dev/ttyUSB0" --baud 921600  --before default_reset --after hard_reset write_flash  -z --flash_mode keep --flash_freq keep --flash_size keep 0x10000 ./sketch.bin 
   ```

In principle you can even use a [Web tool](https://learn.adafruit.com/adafruit-metro-esp32-s2/web-serial-esptool)

### [Partition Table](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/partition-tables.html)

| # Name   |    Type    |  SubType  |  Offset     |   Size    |  Flags |
|----------|------------|-----------|-------------|-----------|--------|
| nvs      |       data |  nvs      |      0x9000 |   0x5000  |        |
| otadata  |   data     |  ota      |      0xe000 |   0x2000  |        |
| app0     |      app   |   ota_0   |    **0x10000**  |  0x140000 |        |
| app1     |      app   |   ota_1   |    0x150000 | 0x140000  |        |
| spiffs   |    data    |  spiffs   |   0x290000  | 0x160000  |        |
| coredump |  data      |  coredump | 0x3F0000    | 0x10000   |        |