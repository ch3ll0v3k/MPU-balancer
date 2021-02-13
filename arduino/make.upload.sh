#!/bin/bash

sync
clear

SKETCH=${1:-"./MPU/MPU.ino"}
PORT=${2:-"/dev/ttyUSB0"}
BOARD="arduino:avr:mega:cpu=atmega2560"

# BOARD="arduino:sam:arduino_due_x_dbg"     # DUE (x32) prog port
# BOARD="arduino:avr:nano:cpu=atmega328old" # NANO (old boot loader)
# BOARD="arduino:avr:mega:cpu=atmega2560" # ATmega 2560 (Mega 2560)     
# BOARD="arduino:avr:mega:cpu=atmega1280" # ATmega 1280

# BOARD="arduino:avr:nano:cpu=atmega328old" # NANO (old boot loader)
# PORT=${2:-"/dev/ttyUSB0"}

echo " Using: sketch: ${SKETCH}, device: ${PORT}"

#  Can only pass one of: --upload, --verify, --get-pref, --install-boards, --version, --install-library
ACTTION="--verify";
ACTTION="--upload";

arduino \
$ACTTION \
--board $BOARD \
--preserve-temp-files \
--port $PORT \
$SKETCH

# stty -F /dev/ttyUSB* 9600 raw -clocal -echo
# cat /dev/ttyUSB*

# [ARDUINO-CLI] => https://arduino.github.io/arduino-cli/getting-started/

# arduino-cli core install arduino:avr
# arduino-cli compile --fqbn arduino:avr:nano:cpu=atmega328old <mysketch-directory>
# arduino-cli compile --fqbn arduino:avr:nano <mysketch-directory>
# arduino-cli upload -p /dev/ttyUSB0 --fqbn arduino:avr:nano <mysketch-directory>
# arduino-cli upload -p /dev/ttyUSB0 --fqbn arduino:avr:nano:cpu=atmega328old <mysketch-directory>
# arduino-cli upload -bv arduino:avr:nano:cpu=atmega328old -p /dev/ttyUSB0

# arduino-cli compile -bv arduino:avr:nano:cpu=atmega328old
# arduino-cli upload -bv arduino:avr:nano:cpu=atmega328old -p /dev/ttyUSB0

# stty -F /dev/ttyUSB0 9600 raw -clocal -echo
# cat /dev/ttyUSB0




# PORT=${1:-"/dev/ttyUSB0"}
# SKETCH=$2

# sync
# clear
# arduino \
# --upload \
# --board arduino:avr:nano:cpu=atmega328old \
# --port $PORT \
# --preserve-temp-files \
# $SKETCH
