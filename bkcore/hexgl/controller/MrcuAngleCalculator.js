/******************************************************************************
 * SPDX-FileCopyrightText: Copyright 2024 LG Electronics Inc.
 * SPDX-License-Identifier: MIT
 *
 * This file is MRCU angle calculator using accelerometer value
 ******************************************************************************/

// MRCU angle calculator
var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

bkcore.hexgl.MrcuAngleCalculator = function () {
  this.radians = 0.0;
  this.angle = 0.0;
};

// Calculates the angle by taking the accelerometer value as a variable
bkcore.hexgl.MrcuAngleCalculator.prototype.calculateAngle = function (
  acc1,
  acc2
) {
  this.radians = Math.atan2(acc1, acc2);

  // transfer radian to angle
  let radianToAngle = (this.radians * 180) / Math.PI;
  this.angle = Number(Math.abs(radianToAngle).toFixed(2));

  return this.angle;
};
