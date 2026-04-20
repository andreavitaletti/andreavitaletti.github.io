If you ask multiple people what the Internet of Things (IoT) is, you will likely get many different answers. Devices such as a Raspberry Pi, Jetson Nano, Arduino Uno, or ESP32 are all legitimately considered IoT devices, but they differ significantly in capabilities.

The Raspberry Pi, Jetson Nano, and Arduino Uno Q can handle relatively complex tasks, including AI workloads, whereas the resource-constrained ESP32 cannot easily achieve the same performance.

!!!note
    In this course, we make an **unconditional choice**: students will work with the **ESP32 powered by a battery**

**Why?**

- From a teaching perspective, it provides the most valuable learning experience, emphasising efficiency and thoughtful system design.
- It presents a greater challenge, encouraging careful design.
- Solutions developed for the resource-limited ESP32 will generally scale easily to more powerful devices.
- The battery force students to design power efficient solutions

!!! note
    In many IoT environments, particularly industrial ones, devices are easily line-powered. Yet, the constraints of battery-powered design offer a much more engaging set of challenges.


Regardless of the fact that, for simplicity, you might use a more resource-demanding (“non-IoT‑friendly”) technology, we expect you to **demonstrate a thoughtful design process and provide a prototype** that shows how you optimised limited resources to meet your application’s requirements.

As an example, it is well known that Wi-Fi is not particularly IoT-friendly, as it consumes a significant amount of energy. At the same time, most ESP32 devices natively support Wi-Fi, making it a very convenient choice.

While we encourage you to challenge yourself with more IoT-friendly technologies (e.g., LoRa), using WiFi is perfectly acceptable **provided that you demonstrate the following**:

1. You clarify what is the most suitable technology and you are aware of pros and cons;
2. You measure and report the energy consumption of your solution employing WiFi;
3. You discuss whether your design meets the requirements of your application;
4. You optimise your design to meet the requirements (e.g. applying energy-aware mechanisms such as duty cycling, sleep modes, or other techniques) under **suitable assumptions** (e.g. assuming you are using LoRa instead of WiFi).

This approach ensures that even when using convenient technologies like Wi-Fi, you remain mindful of IoT constraints and practice efficient design principles.

<!-- both the admonitions below work, but the second one is rendered properly also on obsidian -->

!!! note
    We value the process and the right questions with sound answers more than the final product.
