/******************************************************************************
 * SPDX-FileCopyrightText: Copyright 2024 LG Electronics Inc.
 * SPDX-License-Identifier: MIT
 *
 * This is an example of linking with bHaptics' gaming vest through the BLE GATT client function of webOS TV.
 *
 * If you want more information about Luna Service API call, then refer this url:
 * https://webostv.developer.lge.com/develop/references/luna-service-introduction#luna-service-api-introduction
 *
 ******************************************************************************/

var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

const Vibration = {
  clear: 0,
  left: 1,
  right: 2,
  front: 3,
  back: 4,
  fall: 5,
  all: 6,
  boost: 7
};

// need to change the MAC address of the device you want to connect to
const targetAddress = "f7:0e:a1:0b:e7:84";
const serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const characteristicUuid = "6e40000a-b5a3-f393-e0a9-e50e24dcca9e";

bkcore.hexgl.BleGattService = function () {
  this.isEnabledHandle;
  this.scanHandle;
  this.connectHandle;
  this.isConnected = false;
  this.vibrateLocation = Vibration.clear;
};

// Check webOS TV's Bluetooth is currently enabled and ready for use.
bkcore.hexgl.BleGattService.prototype.isBleEnabled = function () {
  var self = this;

  self.isEnabledHandle = webOS.service.request(
    "luna://com.webos.service.blegatt",
    {
      method: "isEnabled",
      parameters: { subscribe: true },
      onSuccess: function (inResponse) {
        console.log("Result: " + JSON.stringify(inResponse));
        if (inResponse.isEnabled == true) {
          self.isEnabledHandle.cancel();
          self.scanDevice();
        }
        return true;
      },
      onFailure: function (inError) {
        console.log("[" + inError.errorCode + "]: " + inError.errorText);
        return;
      }
    }
  );
};

// Stop ongoing ble scanning.
bkcore.hexgl.BleGattService.prototype.stopScan = function () {
  var self = this;

  self.scanHandle.cancel();
  var request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "stopScan",
    parameters: {},
    onSuccess: function (inResponse) {
      console.log("Result: " + JSON.stringify(inResponse));
      return true;
    },
    onFailure: function (inError) {
      console.log("[" + inError.errorCode + "]: " + inError.errorText);
      return;
    }
  });
};

// Starts scanning only ble devices.
bkcore.hexgl.BleGattService.prototype.scanDevice = function () {
  var self = this;

  if (this.isConnected) {
    console.log("device is already connected");
    return;
  }

  self.scanHandle = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "startScan",
    parameters: { subscribe: true, scanType: "name" },
    onSuccess: function (inResponse) {
      console.log("Result: " + JSON.stringify(inResponse));
      if (inResponse.devices) {
        for (let i = 0; i < inResponse.devices.length; i++) {
          if (inResponse.devices[i].address === targetAddress) {
            // found the target device
            self.stopScan();
            self.connectDevice();
            break;
          }
        }
        return true;
      }
    },
    onFailure: function (inError) {
      console.log("[" + inError.errorCode + "]: " + inError.errorText);
      return;
    }
  });
};

// Connect to GATT profile on the specified remote device.
bkcore.hexgl.BleGattService.prototype.connectDevice = function () {
  var self = this;

  self.connectHandle = webOS.service.request(
    "luna://com.webos.service.blegatt",
    {
      method: "client/connect",
      parameters: { subscribe: true, address: targetAddress },
      onSuccess: function (inResponse) {
        console.log("Result: " + JSON.stringify(inResponse));
        if (inResponse.values) {
          if (
            inResponse.values.address == targetAddress &&
            inResponse.values.connected == true
          ) {
            // connected to target device
            this.isConnected = true;
            self.discoverServices();
          }
        }
        return true;
      },
      onFailure: function (inError) {
        console.log("[" + inError.errorCode + "]: " + inError.errorText);
        return;
      }
    }
  );
};

// Disconnects an established connection.
bkcore.hexgl.BleGattService.prototype.disconnectDevice = function () {
  var self = this;

  var request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "client/disconnect",
    parameters: { address: targetAddress },
    onSuccess: function (inResponse) {
      console.log("Result: " + JSON.stringify(inResponse));
      self.isConnected = false;
      return true;
    },
    onFailure: function (inError) {
      console.log("[" + inError.errorCode + "]: " + inError.errorText);
      return;
    }
  });
};

// Discovers services offered by a remote device as well as their characteristics and descriptors.
bkcore.hexgl.BleGattService.prototype.discoverServices = function () {
  var request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "client/discoverServices",
    parameters: { address: targetAddress },
    onSuccess: function (inResponse) {
      console.log("Result: " + JSON.stringify(inResponse));
      return true;
    },
    onFailure: function (inError) {
      console.log("[" + inError.errorCode + "]: " + inError.errorText);
      return;
    }
  });
};

// Request vibration to hHaptics' gaming vest using writeCharacteristic
bkcore.hexgl.BleGattService.prototype.createVibration = function (location) {
  var self = this;
  var parameters;

  if (this.vibrateLocation == location) {
    return;
  }

  self.vibrateLocation = location;
  switch (location) {
    case Vibration.clear:
      parameters = {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      };
      break;
    case Vibration.left:
      parameters = {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [
            50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ]
        }
      };
      break;
    case Vibration.right:
      parameters = {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50
          ]
        }
      };
      break;
    case Vibration.front:
      parameters = {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [
            50, 50, 50, 50, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50
          ]
        }
      };
      break;
    case Vibration.back:
      parameters = {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [
            0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 0, 0, 0, 0, 0
          ]
        }
      };
      break;
    case Vibration.fall:
      parameters = {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [
            10, 20, 30, 40, 50, 10, 20, 30, 40, 50, 10, 20, 30, 40, 50, 10, 20,
            30, 40, 50
          ]
        }
      };
      break;
    case Vibration.all:
      parameters = {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [
            50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
            50, 50, 50
          ]
        }
      };
      break;
    case Vibration.boost:
      parameters = {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [
            5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 5, 5, 5, 5, 5
          ]
        }
      };
      self.boostAction();
      break;
    default:
      break;
  }

  var request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "client/writeCharacteristic",
    parameters: parameters,
    onSuccess: function (inResponse) {
      console.log("Result: " + JSON.stringify(inResponse));
      return true;
    },
    onFailure: function (inError) {
      console.log("[" + inError.errorCode + "]: " + inError.errorText);
      return;
    }
  });

  self.timeoutCallbak();
};

// create boost action
bkcore.hexgl.BleGattService.prototype.boostAction = function () {
  var request;
  request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "client/writeCharacteristic",
    parameters: {
      address: targetAddress,
      service: serviceUuid,
      characteristic: characteristicUuid,
      value: {
        bytes: [10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0]
      }
    }
  });

  sleep(20);
  request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "client/writeCharacteristic",
    parameters: {
      address: targetAddress,
      service: serviceUuid,
      characteristic: characteristicUuid,
      value: {
        bytes: [0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0]
      }
    }
  });

  sleep(20);
  request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "client/writeCharacteristic",
    parameters: {
      address: targetAddress,
      service: serviceUuid,
      characteristic: characteristicUuid,
      value: {
        bytes: [0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0]
      }
    }
  });

  sleep(20);
  request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "client/writeCharacteristic",
    parameters: {
      address: targetAddress,
      service: serviceUuid,
      characteristic: characteristicUuid,
      value: {
        bytes: [0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0]
      }
    }
  });

  sleep(20);
  request = webOS.service.request("luna://com.webos.service.blegatt", {
    method: "client/writeCharacteristic",
    parameters: {
      address: targetAddress,
      service: serviceUuid,
      characteristic: characteristicUuid,
      value: {
        bytes: [0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10]
      }
    }
  });
};

bkcore.hexgl.BleGattService.prototype.timeoutCallbak = function () {
  setTimeout(function () {
    var request = webOS.service.request("luna://com.webos.service.blegatt", {
      method: "client/writeCharacteristic",
      parameters: {
        address: targetAddress,
        service: serviceUuid,
        characteristic: characteristicUuid,
        value: {
          bytes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      },
      onSuccess: function (inResponse) {
        console.log("Result: " + JSON.stringify(inResponse));
        return true;
      },
      onFailure: function (inError) {
        console.log("[" + inError.errorCode + "]: " + inError.errorText);
        return;
      }
    });
  }, 200);
};

// help function for sleep
function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}
