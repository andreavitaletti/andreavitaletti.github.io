# We need an OS

[Giorgio Grisetti's lectures](https://sites.google.com/diag.uniroma1.it/sistemi-operativi-2023-24/home?authuser=0) are an excellent resource. 

**GOAL:** Small experiment (a single sensor). Focus on efficiency, namely doing the things right, i.e., the Engineers approach. Use metrics to measure to what extent your solution satisfies the user requirements.

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQWchkAoJjIzJ13YrlXxhlkcboKTzaVO7nHNC_VP3CjuncwgtcwoADPL27JrAzMtL2-kex8fq-Xfnvf/embed?start=false&loop=false&delayms=3000" frameborder="0" width="1058" height="624" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vR7QxDDAOT5GEActKCZpcNNMpIbEgsB1RBF4B1CeCqJHplpN6Xf51P7MFy_i8_0KmzLAokr5RI0DNaE/embed?start=false&loop=false&delayms=3000" frameborder="0" width="1058" height="624" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

Well, to develop an IoT application as an engineer, we do need a Real-Time Operating System (RTOS). [What is An RTOS?](https://www.freertos.org/about-RTOS.html). 

> Embedded systems often have real time requirements. A real time requirements is one that specifies that the embedded system must respond to a certain event within a strictly defined time (the deadline). A guarantee to meet real time requirements can only be made if the behaviour of the operating system's scheduler can be predicted (and is therefore deterministic). FreeRTOS, achieve determinism by allowing the user to assign a priority to each thread of execution. The scheduler then uses the priority to know which thread of execution to run next. In FreeRTOS, a thread of execution is called a task.

[Here](https://www.freertos.org/implementation/a00002.html) there is a nice explanation of the main features provided by FreeRTOS, namely 

* Multitasking
* Scheduling
* Context Switching
* Real Time Applications
* Real Time Scheduling

[FreeRTOS FAQ - What is This All About?](https://www.freertos.org/FAQWhat.html)

Finally a nice [example](https://www.freertos.org/tutorial/index.html) of the design of a real-time application 

A [book](https://freertos.org/Documentation/161204_Mastering_the_FreeRTOS_Real_Time_Kernel-A_Hands-On_Tutorial_Guide.pdf) on FreeRTOS.


## Development environment

To develop our solution on our ESP32, we need to setup the environment as described [here](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/). A very convenient way is to use docker as explained [here](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-docker-image.html). 

To further simplify the development process, a multi-platform Virtualbox image is available [here](https://drive.google.com/file/d/1qxabmuQreTZzNscvmijvNzvl9Oa0GSGS/view?usp=drive_link). **Next we will focus on this method.** Credentials to work with the virtual machine are root/root and devel/devel and we will connect in ssh as explained below. 

The reference folder for the code and the examples is [https://github.com/espressif/esp-idf.git](https://github.com/espressif/esp-idf.git) which is already available on the virtual machine on 

1. ``` ssh devel@localhost -p 2222 ``` ... the password is devel
2. ``` get_idf ``` ... we set up the development environment
3. ``` cd ~/esp ```
4. ``` cp -r ./esp-idf/examples/get-started/hello_world/ ./workshop/ ``` ... make a copy of a dir in the example in the workshop dir 
5. ``` cd ./workshop/hello_world/ ```
6. ``` idf.py build ``` ... i t takes some time
7. ``` idf.py flash ``` ... be sure the ESP32 is connected to \dev\ttyUSB0 and check it is visible in the virtual machine
8. ``` idf.py monitor ``` ... to exit from the monitor ctrl+T ctrl+X

**NOTE** in some cases you can configure specific parameters running idf.py menuconfig

In the virtual machine you have first to 
``` export LC_ALL=C ```

## Clone only the relevant code 

```
# Create a directory, so Git doesn't get messy, and enter it
mkdir code_from_git && cd code_from_git

# Start a Git repository
git init

# Track repository, do not enter subdirectory
git remote add -f origin https://github.com/andreavitaletti/IoT_short_course

# Enable the tree check feature
git config core.sparseCheckout true

# Create a file in the path: .git/info/sparse-checkout
# That is inside the hidden .git directory that was created
# by running the command: git init
# And inside it enter the name of the sub directory you only want to clone
echo 'src/freertos' >> .git/info/sparse-checkout

## Download with pull, not clone
git pull origin main
```

https://github.com/FreeRTOS/Lab-Project-FreeRTOS-Tutorials

## A quick introduction to tasks

Based on [ESP32 ESP-IDF FreeRTOS Tutorial: Learn to Create Tasks](https://esp32tutorials.com/esp32-esp-idf-freertos-tutorial-create-tasks/). The code is available on our github [repo](https://github.com/andreavitaletti/IoT_short_course/tree/main/src/freertos/task_tutorial)

## The examples of SESSION 2 on FreeRTOS

In this section we will implement the reference examples developed in day2 into FreeRTOS. The idea is to take inspiration from the examples available at [https://github.com/espressif/esp-idf/tree/master/examples](https://github.com/espressif/esp-idf/tree/master/examples) and modify them to get the same behavior of the ones developed in DAY2

* The simplest actuator, namely a [led](https://github.com/espressif/esp-idf/tree/master/examples/get-started/blink)
* The Simplest sensor, namely a [button](https://github.com/espressif/esp-idf/tree/master/examples/peripherals/gpio/generic_gpio)
* A bit more interesting sensor, namely a [potentiometer](https://github.com/espressif/esp-idf/tree/master/examples/peripherals/adc)
* A simple example with [SR04 Ultrasonic Sensor](https://github.com/espressif/esp-idf/tree/master/examples/peripherals/mcpwm/mcpwm_capture_hc_sr04)
* It's time to be connected by [MQTT](https://github.com/espressif/esp-idf/tree/master/examples/protocols/mqtt)
* About the vibration sensor SW-420 ... have a look [here](https://github.com/andreavitaletti/IoT_short_course/tree/main/src/freertos/mcpwm_capture_hc_sw420)

Nice tutorials on the same topics are also available [here](https://esp32tutorials.com/getting-started-tutorial-esp32-esp-idf/)

## Data Streaming in Industrial IoT

* [MQTT](https://mqtt.org/)
* [OPCUA](https://opcfoundation.org/about/opc-technologies/opc-ua/)
* [Apache Kafka](https://kafka.apache.org/)