import { useEffect, useState } from 'react';
import { GeolocationPosition, Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

interface MyLocation {
  position?: GeolocationPosition;
  error?: Error;
}

/*
  Specialized hook that gives the current location of the user
 */
export const useMyLocation = () => {
  const [state, setState] = useState<MyLocation>({});
  useEffect(watchMyLocation, []);
  return state;

  // the function changes the current location depending on the events from the user interface
  function watchMyLocation() {
    let cancelled = false;
    Geolocation.getCurrentPosition()
      .then(position => updateMyPosition('current', position))
      .catch(error => updateMyPosition('current',undefined, error));
    const callbackId = Geolocation.watchPosition({}, (position, error) => {
      updateMyPosition('watch', position, error);
    });
    return () => {
      cancelled = true;
      Geolocation.clearWatch({ id: callbackId });
    };

    function updateMyPosition(source: string, position?: GeolocationPosition, error: any = undefined) {
      console.log(source, position, error);
      if (!cancelled) {
        setState({ ...state, position: position || state.position, error });
      }
    }
  }
};
