/******************************************************************************
 * SPDX-FileCopyrightText: Copyright 2024 LG Electronics Inc.
 * SPDX-License-Identifier: MIT
 *
 * This file is MRCU controller using MRCU motion sensor data (accelerometer)
 ******************************************************************************/

var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

bkcore.hexgl.MrcuController = function () {
  this.mrcuAngleCalculator = new bkcore.hexgl.MrcuAngleCalculator();
  this.x = 0.0;
  this.y = 0.0;
  this.z = 0.0;
};

// When starting MRCU control,
// get and set the acc, gameMode, key object from MrcuService.js,
// check the current status using the acc value and enter key value
bkcore.hexgl.MrcuController.prototype.mrcuControlStart = function (
  acc,
  gameMode,
  key
) {
  // const values are threshold accelerometer value of gravity
  // Below const values are optimized for this game
  const MAX_ACC_LR = 1;
  const MAX_ACC_FB_HAND = 5.5;
  const MAX_ACC_FB_WHEEL = 2;

  // x, y, z are accelerometer values of MRCU motion sensor
  this.x = acc.x;
  this.y = acc.y;
  this.z = acc.z;

  // Game Controller using MRCU motion sensor value
  const mrcuMotionController = (
    accLR, // Determine Left and Right by acc value
    accFB, // Determine Forward and Backward by acc value
    accAngle, // Use with accLR to calculate the angle
    minAccLR, // Turn left or right if it is greater than this value
    maxAccFB // Accelerate if it is smaller than this value
  ) => {
    this.angle = this.mrcuAngleCalculator.calculateAngle(accLR, accAngle);
    key.angle = this.angle;

    if (accFB > maxAccFB) {
      key.forward = false;
      key.backward = false;
      if (accLR >= minAccLR) {
        key.left = true;
        key.right = false;
      }
      if (accLR < minAccLR && accLR > minAccLR * -1) {
        key.right = false;
        key.left = false;
      }
      if (accLR <= minAccLR * -1) {
        key.right = true;
        key.left = false;
      }
    }
    if (accFB <= maxAccFB) {
      key.forward = true;
      if (accLR >= minAccLR) {
        key.left = true;
        key.right = false;
      }
      if (accLR < minAccLR && accLR > minAccLR * -1) {
        key.right = false;
        key.left = false;
      }
      if (accLR <= minAccLR * -1) {
        key.right = true;
        key.left = false;
      }
    }
  };

  // Hand hold game mode
  if (gameMode == 0) {
    mrcuMotionController(this.x, this.y, this.z, MAX_ACC_LR, MAX_ACC_FB_HAND);
  }
  // Steering wheel game mode
  else if (gameMode == 1) {
    mrcuMotionController(
      this.y,
      this.z * -1,
      this.x * -1,
      MAX_ACC_LR,
      MAX_ACC_FB_WHEEL
    );
  }
};
