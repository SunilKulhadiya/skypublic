{
    "expo": {
      "name": "skypublicschool",
      "slug": "skypublicschool",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/logoBn.png",
      "userInterfaceStyle": "light",
      "splash": {
        "image": "./assets/skyLogo.jpeg",
        "resizeMode": "contain",
        "backgroundColor": "#4270CB"
      },
  
      "plugins": [
        [
          "expo-notifications",
          {
            "icon": "./assets/logoBn.png",
            "color": "#ffffff"
          }
        ]
      ],
  
      "assetBundlePatterns": [
        "**/*"
      ],
      "ios": {
        "supportsTablet": true
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/logoBn.png",
          "backgroundColor": "#ffffff"
        },
        "package": "com.skandsolution.skypublicschool"
      },
      "web": {
        "favicon": "./assets/favicon.png"
      },
      "extra": {
        "eas": {
          "projectId": "a60854c4-aa22-4a57-9d08-be2e68c588b1"
        }
      },
      "owner": "skandsolution"
    }
  }
  