import {React, useRef } from 'react';
import * as Updates from 'expo-updates';

export default async function ReloadApp () {

    try {
        // const update = await Updates.checkForUpdateAsync();
  
        // if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        //}
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        alert(`Error fetching latest Expo update: ${error}`);
      }
  
}