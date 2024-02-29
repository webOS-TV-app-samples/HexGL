# HexGL

Source code of [HexGL](http://hexgl.bkcore.com), the futuristic HTML5 racing game by [Thibaut Despoulain](http://bkcore.com)

## Branches

- **[Master](https://github.com/BKcore/HexGL)** - Public release (stable).

## License

Unless specified in the file, HexGL's code and resources are now licensed under the _MIT License_.

## Installation

    cd ~/
    git clone git://github.com/BKcore/HexGL.git
    cd HexGL
    python -m SimpleHTTPServer
    chromium index.html

To use full size textures, swap the two textures/ and textures.full/ directories.

## Note

The development of HexGL is in a hiatus for now until I find some time and interest to work on it again.
That said, feel free to post issues, patches, or anything to make the game better and I'll gladly review and merge them.

=========

# HexGL by LG Electronics

## License

Unless specified in the file, modified by LGE code and resources are now licensed under the _MIT License_.

## Description

You can play the game using LG TV MRCU(Magic Remote Control Unit)<br/>
<br/>
There are two ways:<br/>
Handhold mode, which uses the MRCU in the direction of the screen,<br/>
and Steering Wheel mode, which uses the MRCU parallel to the screen and rotates it like a steering wheel.<br/>

### Handhold Mode

<img src="./assets/help-mrcu0.png" alt="help-mrcu0" width="720px" /><br/>

### Steering Wheel Mode

<img src="./assets/help-mrcu1.png" alt="help-mrcu1" width="720px" /><br/>

## Requirements

- webOS24 latest version and higher
- MRCU pairing

## How to Use the Samples

### Clone the Repository

Clone the repository and cd into the cloned directory.

```
git clone https://github.com/webOS-TV-app-samples/HexGL.git
cd com.game.app.hexgl
```

### Sample Code modified by LGE

The **'service'** and **'controller'** folders under **'bkcore > hexgl'** contain sample codes.<br/>

Like following example, marked as **'Modified by LGE'**, is revision code for sample code by the LGE.<br/>

```
/******************** Modified by LGE ***********************/
// Create MrcuService instance
this.mrcuService = new bkcore.hexgl.MrcuService();
/************************************************************/
```

### App Package & Install

Package this project and install it on TV.

https://webostv.developer.lge.com/develop/tools/cli-dev-guide#ares-package</br>
https://webostv.developer.lge.com/develop/tools/cli-dev-guide#ares-setup-device</br>
https://webostv.developer.lge.com/develop/tools/cli-dev-guide#ares-install</br>

When creating a package file (.ipk), use the '--no-minify' option of the ares-package command to omit the minifying task.

https://webostv.developer.lge.com/develop/tools/cli-dev-guide#package-the-web-app-without-minifying

## Luna Servcie API - MRCU Service

If you want to see details about the MRCU Service API, please refer to this url. <br />

Magic-Remote : https://webostv.developer.lge.com/develop/references/magic-remote<br/>
Ble-Gatt : https://webostv.developer.lge.com/develop/references/ble-gatt<br/>