# Security

!!!warning
    This is not a course on security

The security of IoT devices presents a unique set of challenges compared to traditional computing. Because these devices often operate with constrained resources, limited CPU cycles, RAM, and power, implementing heavy, standard cryptographic suites can be computationally prohibitive.

Beyond software limitations, IoT devices face a significant physical threat vector. Unlike a server locked in a secure data center, an IoT device is often deployed in the field where it can be stolen, disassembled, and subjected to side-channel attacks or firmware extraction in a laboratory environment. This intersection of hardware vulnerability and limited defensive overhead makes securing the "edge" a complex engineering hurdle.

In the followng we summarize the main security threats for IoT devices.

## Secure Communication (TLS/SSL)

Encrypting data in transit so a "Man-in-the-Middle" (like someone on the same Wi-Fi) cannot read the exchanged data. Use [WiFiClientSecure](https://github.com/tuan-karma/ESP32_WiFiClientSecure) in Arduino or [esp_tls](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/protocols/esp_tls.html) in ESP-IDF.

!!!note
    The real challenge is Certificate management. Hardcoding a Root CA certificate is easy; handling certificate expiration (rotation) without bricking the device is more complex.

## Secure Provisioning (The "First Connect" Problem)

How do you give a headless device your Wi-Fi password without sending it over the air in plain text?
Many devices create an open Access Point (AP) to take credentials. If an attacker is nearby, they can sniff those credentials. A Solution is ESP-Provisioning. This uses a secure "Proof of Possession" (usually a QR code on the box) and an encrypted channel (Curve25519) to pass Wi-Fi credentials from a phone app to the ESP32

## Identity and Secret Management

Never use the same "Secret Key" for 1,000 devices. If one is dumped, the whole fleet is compromised. NVS Encryption allows you to encrypt the specific NVS partition where Wi-Fi passwords and other secrets live. For high-security projects, you might consider Hardware Security Modules (HSM), an external chip like the ATECC608, which stores private keys in a way that is physically impossible to dump, even with a lab.

## Over-The-Air (OTA) Security

If you can update your code remotely, so can an attacker. An attacker might try to "downgrade" your device to an older, vulnerable version of your firmware (Rollback Protection). The ESP32 has an "Anti-rollback" feature that stores a version number in hardware fuses. The chip will refuse to boot any firmware with a lower version number than the one currently "burned" into the fuse.

!!!note
    eFuses (electronic fuses) are a form of non-volatile memory that can only be written once. Unlike Standard Flash memory or EEPROM, which can be erased and rewritten thousands of times, an eFuse is a physical "one-way street."
    
    Think of them as a bank of tiny physical wires inside the silicon of the CPU. When you "burn" an eFuse, you are physically blowing that connection, changing a bit from 0 to 1 forever.
    
    Because eFuses are part of the chip itself (not the external Flash chip), they are the most secure place to store information. They form the foundation of the device's security. If you store a secret key in an eFuse, it cannot be modified or "hacked" via a software update.
    
    four categories of eFuses:
    
    * Security Keys: They store the AES-256 keys used for Flash Encryption and the Public Key hashes used for Secure Boot.
    * Hardware Configuration: They tell the ESP32 how to behave at a hardware level (e.g., setting the default voltage for the Flash chip).
    * Locking Features: They can be used to permanently disable hardware "backdoors." For example, you can burn an eFuse to disable the JTAG debugging port so an attacker can't plug in a debugger to see your code.
    * MAC Address: The unique identification number of your ESP32 is burned into eFuses at the factory by Espressif.

## Secure Boot (The Root of Trust)

Flash Encryption protects your secrets, but Secure Boot protects your logic. The ESP32 checks a digital signature on the firmware before running it. If the signature doesn't match your private key, the device won't start. Secure Boot prevents an attacker from taking a "smart plug" and turning it into a "malicious Wi-Fi sniffer" by flashing their own code.

## JTAG and Console Lockdown

Even with encryption, a physical attacker can connect a debugger (JTAG) to the pins and "step through" your code while it's running to see the decrypted data in RAM. You must burn eFuses to permanently disable JTAG and the UART ROM Download mode. Once you do this, the "debug" doors are welded shut.

## Firmware dumping

Assume you have the followng code upladed on the ESP32

```c

const char* key = "SECRET_12345";

void setup() {
  Serial.begin(115200);
  // If you do not use the constant key the compiler remove it
  Serial.println(key); // Force the compiler to keep the string
}

void loop() {
  // Key is just sitting in memory
}

```

### Extracting the Firmware (Dumping)
To get the data off the chip, you use the 'esptool.py' utility, which is the same tool Platformi or the Arduino IDE uses to upload code. Instead of writing, we will read.

* Step A: Connect the ESP32 to your PC via USB.
* Step B: Identify the Flash size (usually 4MB).
* Step C: Run the read_flash command.

`
pio pkg exec -p "tool-esptoolpy" -- esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 115200 read_flash 0 0x400000 firmware_dump.bin`
`

or 

`
python -m esptool --chip esp32 --port /dev/ttyUSB0 --baud 115200 read_flash 0 0x400000 firmware_dump.bin
`

* 0: The starting address.
* 0x400000: The size to read (4MB in hex).
* firmware_dump.bin: The raw binary file saved to your computer.

!!!note
    It takes time

### Reverse Engineering (Finding the Key)
Because your variable is a "Global Constant," it is stored in the DROM (Data Read-Only Memory) section of the flash. There are two ways to find it:

**Method A:** The "Strings" Utility (Easy Mode)
If the key is a plain text string, you don't even need a decompiler. You can use a utility called strings to look for sequences of printable characters.

`
strings firmware_dump.bin | grep "SECRET"
`

Result: This will  print SECRET_12345 immediately.

**Method B:** Using a Disassembler (Pro Mode)
If the key isn't a simple string or you need to see how it's used, you use a tool like Ghidra or IDA Pro.

* Load the Binary: Open firmware_dump.bin in Ghidra.
* Set Architecture: Select Xtensa (the ESP32 CPU architecture).
* Analyze: Let the tool map out the functions.
* Search Memory: Look for the data segments. Even if the key isn't printed to the Serial monitor, it exists in a specific memory offset that the CPU points to when the program runs.

## Tools

* Flash Encryption (**confidentiality**): The ESP32 has a built-in hardware engine that encrypts the firmware. Even if you dump the bits, they will look like gibberish (high entropy noise).
* Secure Boot(**Integrity**): Ensures only your signed firmware can run on the chip. Prevents someone from uploading their code to your device (e.g., a botnet).
* NVS Encryption: Storing keys in the Non-Volatile Storage (NVS) partition rather than hardcoding them in the binary.


!!!note
    All these tools heavy-duty security features are managed much more effectively through the (Espressif IoT Development Framework) ESP-IDF.

### The "Must-Read" Official Guides

[ESP-IDF Security Features Overview](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/security/index.html) explains the "Chain of Trust", namelyhow the hardware ensures that only your code runs from the moment the power is turned on.

[Flash Encryption Guide](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/security/flash-encryption.html) explains the AES-256 hardware engine that would have prevented you from reading that "SECRET_" string earlier. It even covers "Development Mode" vs "Release Mode."

### Best Step-by-Step Tutorials

If you prefer a hands-on walk-through, these are the top community resources:

[Zbotic: ESP32 Secure Boot and Flash Encryption](https://zbotic.in/esp32-secure-boot-and-flash-encryption-protect-your-device/) is a guide that simplifies the menuconfig settings. 

[PBearson’s GitHub Tutorial](https://github.com/PBearson/ESP32_Secure_Boot_Tutorial) is a well-maintained repository that provides a sample project you can clone to test Secure Boot in "Reflashable Mode."

!!!warning
    When following security tutorials, you will encounter eFuses. These are physical fuses inside the ESP32 chip.Once you "burn" a fuse (like disabling JTAG or enabling Secure Boot Release Mode), it is permanent. **You cannot "factory reset" an eFuse.**
    
    Tutorial Tip: Always start with "Development Mode" first. This allows you to test the encryption without permanently locking the chip.
    
    Helpful Peer Advice: If you are serious about this, buy 2 or 3 cheap ESP32 "sacrificial" boards. You will likely brick at least one while learning how to lock down the eFuses properly. 

<!-- https://www.motius.com/post/how-to-build-a-secure-iot-prototype-with-arduino-and-esp32 -->
