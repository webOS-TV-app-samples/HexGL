/******************************************************************************
 * SPDX-FileCopyrightText: Copyright 2024 LG Electronics Inc.
 * SPDX-License-Identifier: MIT
 *
 * This file is about Luna Service APIs of mrcu service.
 * API url : https://webostv.developer.lge.com/develop/references/magic-remote#getsensordata
 * TODO : new mrcu sensor api guide url
 *
 * If you want more information about Luna Service API call, then refer this url:
 * https://webostv.developer.lge.com/develop/references/luna-service-introduction#luna-service-api-introduction
 *
 ******************************************************************************/

// List of MRCU Service API request function
var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

// const value is sensor data interval that is optimized with this game
const SENSOR_DATA_INTERVAL = 10;

bkcore.hexgl.MrcuService = function () {
  // isGettingData : MRCU motion sensor data is subscribed or not
  this.isGettingData = false;

  // isCursorVisible : state of cursor visible on TV
  this.isCursorVisible = true;

  // 0 == Handhold, 1 == Steering wheel
  this.gameMode = null;

  this.key = {};
  this.mrcuControl = new bkcore.hexgl.MrcuController();
};

bkcore.hexgl.MrcuService.prototype.init = function ({ gameMode, key }) {
  this.gameMode = gameMode;
  this.key = key;
};

// API request to get the accelerometer values with subscription
bkcore.hexgl.MrcuService.prototype.getSensorEventData = function () {
  var self = this;

  webOS.service.request("luna://com.webos.service.mrcu", {
    method: "sensor2/getSensorEventData",
    parameters: { sensorType: "accelerometer", subscribe: true },
    onSuccess: function (inResponse) {
      if (inResponse.subscribed) {
        self.isGettingData = true;
        self.setSensorInterval();
        console.log("Subscription Enabled");
      }
      self.mrcuControl.mrcuControlStart(
        inResponse.accelerometer,
        self.gameMode,
        self.key
      );
      return true;
    },
    onFailure: function (inError) {
      console.log("Failed to get sensor data");
      console.log("[" + inError.errorCode + "]: " + inError.errorText);
      return;
    }
  });
};

// API request to cancel the currently active subscription
bkcore.hexgl.MrcuService.prototype.cancelSensorDataSubscribe = function () {
  var self = this;

  if (this.isGettingData) {
    webOS.service.request("luna://com.webos.service.mrcu", {
      method: "sensor2/cancelSensorDataSubscribe",
      parameters: {},
      onSuccess: function () {
        self.isGettingData = false;
        console.log("Succeed to cancel subscription");
        return true;
      },
      onFailure: function (inError) {
        console.log("Failed to cancel subscription " + inError.errorText);
        console.log("[" + inError.errorCode + "]: " + inError.errorText);
        return;
      }
    });
  }
};

// API request to set the sensor interval value you want as a parameter
bkcore.hexgl.MrcuService.prototype.setSensorInterval = function () {
  webOS.service.request("luna://com.webos.service.mrcu", {
    method: "sensor2/setSensorInterval",
    parameters: { interval: SENSOR_DATA_INTERVAL },
    onSuccess: function () {
      console.log("Sensor Interval Value sets to ", SENSOR_DATA_INTERVAL);
      return true;
    },
    onFailure: function (inError) {
      console.log("Failed to set sensor interval data");
      console.log("[" + inError.errorCode + "]: " + inError.errorText);
      return;
    }
  });
};

// Function for toggle Cursor hide / show
bkcore.hexgl.MrcuService.prototype.toggleCursorDisplay = function () {
  this.isCursorVisible = !this.isCursorVisible;
  if (this.isCursorVisible) {
    // webOSSystem.setCursor() method sets the custom cursor shape for the app.
    // Set the cursor to blank using blank cursor image.
    window.webOSSystem.setCursor("./assets/cursor_blank_image.png");
  } else {
    // Restore to default cursor state.
    window.webOSSystem.setCursor("default");
  }
};
