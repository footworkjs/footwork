module.exports = {
  // Firefox
  "Windows_FireFox_Latest": {
    browserName: "firefox",
    platform: "Windows 10",
    version: '47.0'
  },
  "Windows_FireFox_Latest_1": {
    browserName: "firefox",
    platform: "Windows 10",
    version: '46.0'
  },

  "Linux_Firefox_Latest": {
    browserName: "firefox",
    platform: "Linux",
    version: '45.0'
  },
  "Linux_Firefox_Latest_1": {
    browserName: "firefox",
    platform: "Linux",
    version: '44.0'
  },

  // Chrome
  "Windows_Chrome_Latest": {
    browserName: "chrome",
    platform: "Windows 10",
    version: '51.0'
  },
  "Windows_Chrome_Latest_1": {
    browserName: "chrome",
    platform: "Windows 10",
    version: '50.0'
  },

  // "OSX_Chrome_Latest": {
  //   browserName: "chrome",
  //   platform: "OS X 10.11",
  //   version: '51.0'
  // },
  "OSX_Chrome_Latest_1": {
    browserName: "chrome",
    platform: "OS X 10.11",
    version: '50.0'
  },

  // Safari
  // "OSX_Safari_9": {
  //   browserName: "safari",
  //   platform: "OS X 10.11",
  //   version: '9.0'
  // },
  // "OSX_Safari_8": {
  //   browserName: "safari",
  //   platform: "OS X 10.10",
  //   version: '8.0'
  // },
  "OSX_Safari_7": {
    browserName: "safari",
    platform: "OS X 10.9",
    version: '7.0'
  },
  // "OSX_Safari_6": {
  //   browserName: "safari",
  //   platform: "OS X 10.8",
  //   version: '6.0'
  // },

  // Mobile
  // "IPhone_6": {
  //   appiumVersion:  "1.5.3",
  //   deviceName: "iPhone 6 Simulator",
  //   deviceOrientation: "portrait",
  //   platformVersion: "9.3",
  //   platformName: "iOS",
  //   browserName: "Safari"
  // },
  // "IPhone_5": {
  //   appiumVersion: "1.5.3",
  //   deviceName: "iPhone 5 Simulator",
  //   deviceOrientation: "portrait",
  //   platformVersion: "8.4",
  //   platformName: "iOS",
  //   browserName: "Safari"
  // },

  // Android
  // "Android_S4": {
  //   deviceName: "Samsung Galaxy S4 Emulator",
  //   deviceOrientation: "portrait",
  //   browserName: "Android"
  // },
  // android_5_1:
  //   browserName: android
  //   platform: Linux
  //   version: "5.1"
  "Android_5_1": {
    appiumVersion: "1.5.3",
    deviceName: "Android Emulator",
    deviceType: "phone",
    deviceOrientation: "portrait",
    browserName: "Browser",
    platformVersion: "5.1",
    platformName: "Android"
  }

  // android_4_0:
  //   browserName: android
  //   platform: Linux
  //   version: "4.0"
  //   deviceName: "Android Emulator"

  // Edge
  // "MS_Edge": {
  //   browserName: "edge",
  //   platform: "Windows 10"
  // },

  // IE
  "InternetExplorer_9": {
    browserName: "internet explorer",
    version: "9.0",
    platform: "Windows 7"
  },
  "InternetExplorer_10": {
    browserName: "internet explorer",
    version: "10.0",
    platform: "Windows 8"
  },
  "InternetExplorer_11": {
    browserName: "internet explorer",
    version: "11.103",
    platform: "Windows 10"
  }
};
