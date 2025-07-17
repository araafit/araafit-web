import React from "react";

/* ---------------------------------------------------- */

export type UseSwitchType = {
    isOn: () => void;
    isOff: () => void;
    toggleSwitch: () => void;
    switchValue: boolean;
  };

/**
 * he useBoolean hook returns a stateful boolean value and a UseBooleanType object.
 *
 * @param init boolean
 * @returns UseSwitchShape
 */
export function useSwitch(init?: boolean): UseSwitchType {
  const [state, setState] = React.useState(init ? init : false);

  return {
    isOn: () => setState(true),
    isOff: () => setState(false),
    toggleSwitch: () => setState(!state),
    switchValue: state,
  };
}