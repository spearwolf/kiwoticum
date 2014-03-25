#!/bin/bash
#------------------
# File: ackjs.sh
# Author: Wolfger Schramm <wolfger@spearwolf.de>
# Created: 01/13/13 11:58:37 CET

ack --invert-file-match -G '(kiwoticum\.js|old_stuff)' --js $*
