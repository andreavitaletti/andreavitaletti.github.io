# The Connected Studio: Object Catalogue

> Back to the [course outline](intro.md) · [Course slides](assets/slides.pdf)

All exercises share one scenario: a **shared studio / co-working room** that the class progressively brings to life (see [§2 of the outline](intro.md#2-running-scenario-the-connected-studio)). Each group (2–3 students) designs and builds **one object** for the studio.

This page describes the objects groups can choose from. Each object:

- uses only the **Core Kit** (button, potentiometer, LEDs) plus **one or two Specialized Project Modules** ([§4.2](intro.md#42-specialized-project-modules-introduced-from-exercise-3));
- has at least **three states**, ready for the state machine of **Exercise 3**;
- **publishes** at least one topic of the shared **topic contract** ([§5.2](intro.md#52-shared-conventions-the-topic-contract)) and **subscribes** to at least one published by another object, so that from Exercise 7 every object has someone to talk to;
- comes with a **design question** to drive the design reflections.

Technical background for the sensors, the network and the backend is in the [IoT course notes](../Iot_new/index.md), e.g. [Simulating a node](../Iot_new/simulation.md), [MQTT](../Iot_new/simulation.md#mqtt) and [ThingsBoard](../Iot_new/backend.md).

The descriptions are starting points, not specifications. Groups are expected to change states, outputs and behaviours, as long as they keep the topics of the contract.

---

## Overview

| #   | Object                                                  | Core Kit use                          | Specialized module(s)                       | Publishes                          | Subscribes to                          |
| --- | ------------------------------------------------------- | ------------------------------------- | ------------------------------------------- | ---------------------------------- | -------------------------------------- |
| 1   | [Focus Lamp](#1-focus-lamp)                             | Button, pot, PWM LED                  | LDR or PIR                                  | `lamp/mode`                        | `studioScene`, `co2`                   |
| 2   | [Focus Totem](#2-focus-totem)                           | Button, pot                           | NeoPixel ring                               | `totem/mode`                       | `studioScene`, `noiseLevel`            |
| 3   | [Air Quality Monitor](#3-air-quality-window-monitor)    | Button, LED, **pot (simulated CO₂)**  | DHT22 / BME280, buzzer                      | `co2`                              | `roomOccupied`                         |
| 4   | [Door / Presence Badge](#4-door-presence-badge)         | Button, LED                           | PIR, buzzer                                 | `someoneAtDoor`, `roomOccupied`    | `studioScene`                          |
| 5   | [Plant Pot](#5-plant-pot)                               | Pot, PWM LED                          | DHT22 (+ soil probe) or servo               | `plant/mode`                       | `studioScene`                          |
| 6   | [Noise Meter](#6-noise-meter-library-mode-gauge)        | LEDs, **pot (simulated noise)**       | Servo (needle)                              | `noiseLevel`                       | `studioScene`                          |
| 7   | [Meeting / Availability Gauge](#7-meeting-availability-gauge) | Button, pot                     | Servo                                       | `meeting/mode`                     | `studioScene`                          |
| 8   | [Coffee Corner Counter](#8-coffee-corner-counter)       | Button, LED                           | NeoPixel ring or buzzer                     | `coffee/count`                     | `roomOccupied`, `totem/mode`           |

Topics are written without the class prefix: `co2` means `iotpd/studio/co2`, `lamp/mode` means `iotpd/studio/lamp/mode` (see the [topic contract](intro.md#52-shared-conventions-the-topic-contract)). Every object also publishes its own `<object>/status` (online/offline, with Last Will, Exercise 6) and `<object>/heartbeat` (Exercise 8).

---

## 1. Focus Lamp

*A desk lamp that shows when you are concentrating.*

- **Core Kit:** button (cycles modes), potentiometer (warm light level), PWM LED (the light).
- **Specialized module:** LDR (automatic dimming with daylight) **or** PIR (switches off when the desk is vacated).
- **States (Ex 3):**
    - `OFF` — dark.
    - `FOCUS` — steady light; the potentiometer sets the brightness.
    - `DO_NOT_DISTURB` — slow "breathing" pulse; returns to `FOCUS` after a timeout.
- **Publishes:** `lamp/mode` (`off` · `focus` · `dnd`).
- **Subscribes to:** `studioScene` (`presentation` → dim), `co2` (a short flicker suggests opening the window).
- **Design question:** how do you signal "do not disturb me" to others without disturbing *yourself*?

## 2. Focus Totem

*A small tower on the shared table telling colleagues whether someone can be interrupted.*

- **Core Kit:** button (set your status), potentiometer (duration of the focus session, 15–90 min).
- **Specialized module:** NeoPixel ring — the colour shows the status, the filled arc shows the remaining time.
- **States (Ex 3):**
    - `AVAILABLE` — green.
    - `BUSY` — red arc counting down.
    - `BREAK_SUGGESTED` — amber pulse when the session ends.
- **Publishes:** `totem/mode` (`available` · `busy` · `break`).
- **Subscribes to:** `studioScene` (`focus` → every totem turns red; `presentation` → blue), `noiseLevel`.
- **Design question:** a light seen from across the room versus a light seen from your own seat — who is the totem for?

## 3. Air Quality / Window Monitor

*Sits next to the window and tells when the room needs fresh air.*

- **Core Kit:** button ("I opened the window" acknowledgement), LED (alert), **potentiometer as a simulated CO₂ sensor** (see [below](#simulating-co2-and-noise-with-a-potentiometer)).
- **Specialized modules:** DHT22 / BME280 (real temperature and humidity), piezo buzzer.
- **States (Ex 3):**
    - `GOOD` — LED off.
    - `STUFFY` — slow blink (e.g. `co2` > 1000 ppm).
    - `OPEN_WINDOW` — fast blink and a short chirp (e.g. `co2` > 1400 ppm); the button acknowledges and starts a cool-down period.
- **Publishes:** `co2` (plus `airmonitor/temperature` and `airmonitor/humidity` for the object's own dashboard).
- **Subscribes to:** `roomOccupied` (no alerts in an empty room).
- **Design question:** how many alerts before people start ignoring them (*alarm fatigue*)?

## 4. Door / Presence Badge

*At the studio entrance: notices arrivals and greets them.*

- **Core Kit:** button (visitor "knock"), LED.
- **Specialized modules:** PIR motion sensor, piezo buzzer.
- **States (Ex 3):**
    - `EMPTY` — nobody detected.
    - `SOMEONE_ARRIVED` — greeting chime, LED on for 10 s.
    - `OCCUPIED` — returns to `EMPTY` after N minutes without motion.
- **Publishes:** `someoneAtDoor` (event, not retained), `roomOccupied` (retained).
- **Subscribes to:** `studioScene` (`closed` → "come back later" signal; `presentation` → silent).
- **Design question:** where is the line between a polite greeting and surveillance?

## 5. Plant Pot

*Gives the studio's plant a voice.*

- **Core Kit:** potentiometer (plant type / thirst threshold), PWM LED ("mood").
- **Specialized modules:** DHT22 (air) plus a soil-moisture probe if available, **or** a servo that bends a paper leaf.
- **States (Ex 3):**
    - `HAPPY` — leaf up.
    - `THIRSTY` — leaf half down, LED dims.
    - `CRITICAL` — leaf fully down, LED pulses.
- **Publishes:** `plant/mode` (`happy` · `thirsty` · `critical`) and `plant/soilMoisture` for its own dashboard.
- **Subscribes to:** `studioScene` (`closed` → no alerts at night).
- **Design question:** expressive anthropomorphism versus plain information — which one makes people actually water the plant?

## 6. Noise Meter / "Library Mode" Gauge

*Makes the loudness of the room visible.*

- **Core Kit:** **potentiometer as a simulated microphone** (see [below](#simulating-co2-and-noise-with-a-potentiometer)), LEDs (green / yellow / red bar).
- **Specialized module:** servo (a needle on a printed dial).
- **States (Ex 3):**
    - `QUIET` — green.
    - `LIVELY` — yellow.
    - `TOO_LOUD` — red and a gentle needle wave. Use **hysteresis** (different thresholds to enter and leave a state) so the gauge does not flicker at the boundary; smoothing the signal first helps too (see [Filters](../Iot_new/filters.md)).
- **Publishes:** `noiseLevel` (0–100).
- **Subscribes to:** `studioScene` (`focus` → lower thresholds).
- **Design question:** should a shared object judge people's behaviour? How do you avoid it feeling like policing?

## 7. Meeting / Availability Gauge

*A mechanical dial on the door of the meeting corner.*

- **Core Kit:** button (book / release), potentiometer (booking duration).
- **Specialized module:** servo (needle pointing to FREE / IN USE / ENDING SOON).
- **States (Ex 3):**
    - `FREE` — needle on FREE.
    - `IN_USE` — needle moves with the remaining time.
    - `ENDING_SOON` — needle wiggles during the last 5 minutes, then back to `FREE`.
- **Publishes:** `meeting/mode` (`free` · `inUse` · `endingSoon`).
- **Subscribes to:** `studioScene` (`presentation` → automatically `IN_USE`).
- **Design question:** physical motion versus light — which one attracts attention without being annoying?

## 8. Coffee Corner Counter

*Counts coffees and suggests shared breaks.*

- **Core Kit:** button (one press per coffee), LED.
- **Specialized module:** NeoPixel ring (today's count as a filling circle) or piezo buzzer.
- **States (Ex 3):**
    - `IDLE` — shows today's count.
    - `BREWING` — spinning animation for the brewing time.
    - `BREAK_TIME` — invites a group break when several people are in the room.
- **Publishes:** `coffee/count` (an event counter, useful for the data-driven design exercises 11–12).
- **Subscribes to:** `roomOccupied`, `totem/mode` (no break invitation to people in `busy`).
- **Design question:** what does a number of coffees *mean* — productivity, stress, or social life?

---

## Simulating CO₂ and noise with a potentiometer

Two topics of the contract, `co2` and `noiseLevel`, need sensors that are **not** in the kit: the DHT22 / BME280 measure temperature and humidity but **not CO₂**, and there is no microphone module. Both are replaced by the **potentiometer** of the Core Kit.

This is not just a workaround; it is good practice in prototyping:

- **The sensor is not the design.** What matters is the *behaviour* of the object when the air gets stuffy or the room gets loud. A potentiometer is a "Wizard-of-Oz" sensor: by turning the knob you play the role of the environment.
- **Scenarios become repeatable.** Real CO₂ takes tens of minutes to rise; real noise is unpredictable. With the knob you can stage a scenario ("the room slowly fills up, then someone opens the window") in a few seconds, as many times as needed for **validation**.
- **It works in Wokwi.** Wokwi has a potentiometer but no CO₂ sensor or microphone, so the whole object can be designed and tested in the simulator.
- **The rest of the ecosystem cannot tell the difference.** Other objects only see the messages on `co2` or `noiseLevel`; they do not know (and do not need to know) where the number comes from.

### How to do it

Wire the potentiometer as in [the Wokwi potentiometer example](../Iot_new/simulation.md#a-bit-more-interesting-analog-sensor-namely-a-potentiometer). Map the raw reading (0–4095) to a realistic range, and keep the mapping inside **one function**. If a real sensor is added later, only that function changes.

```cpp
const int POT_PIN = 34;   // ADC-capable pin

// Simulated CO2 sensor: knob fully left = fresh outdoor air, fully right = very stuffy room
int readCo2() {
  return map(analogRead(POT_PIN), 0, 4095, 400, 2000);   // ppm
}

// Simulated microphone: knob fully left = silence, fully right = very loud
int readNoiseLevel() {
  return map(analogRead(POT_PIN), 0, 4095, 0, 100);      // 0–100
}
```

Reference values for CO₂ (useful to choose thresholds):

| CO₂ (ppm)   | Meaning                                  |
| ----------- | ---------------------------------------- |
| ~400        | Outdoor air                              |
| 400–1000    | Good indoor air                          |
| 1000–1400   | Stuffy: concentration starts to drop     |
| > 1400      | Ventilate now                            |

!!! tip "Make the simulation believable"
    Real signals are not perfectly still. To make the simulation closer to reality you can add a little random noise (`+ random(-20, 20)`), or smooth the reading over time so it rises slowly like real CO₂ (e.g. a [moving average](../Iot_new/filters.md#moving-average)). Both are good exercises in non-blocking timing with `millis()`.

!!! note "Using real sensors (optional)"
    Groups who want real measurements can add an **SCD40 / SCD41** (true CO₂, I²C) or an **SGP30 / CCS811** (estimated eCO₂) for the Air Monitor, and an analog microphone module (**MAX4466** or **KY-038**) for the Noise Meter. Thanks to the `readCo2()` / `readNoiseLevel()` functions, switching from the potentiometer to the real sensor does not change the rest of the code. See [an I²C sensor example](../Iot_new/simulation.md#an-i2c-sensor-the-mpu6050-accelerometer) for wiring and libraries, and [Sampling](../Iot_new/sample.md) for how often a microphone must be read.

---

## How the objects form an ecosystem

```
               studioScene (scene dashboard / hub)
                      │
     ┌────────────────┼──────────────────────────────┐
     ▼                ▼                              ▼
 Focus Lamp      Focus Totem ──totem/mode─▶ Coffee Counter
     ▲                ▲                              ▲
     │ co2            │ noiseLevel                   │ roomOccupied
     │                │                              │
 Air Monitor     Noise Meter                  Door Badge
     ▲                                               │
     └──────────────── roomOccupied ─────────────────┘
```

The catalogue is designed so that **every object produces a signal that another object consumes**. This keeps the ecosystem exercises (7–10) from being one-directional, and it makes failures interesting: when the Door Badge goes offline (its `door/status` turns `offline`), the Air Monitor and the Coffee Counter must decide what to do without fresh `roomOccupied` messages (graceful degradation, Exercise 8).

All arrows in the diagram are MQTT topics: one object publishes, the others subscribe. See [MQTT](../Iot_new/simulation.md#mqtt) and [devices talking to each other via publish/subscribe](../Iot_new/backend.md#take-advantage-of-an-ecosystem-of-objects).
