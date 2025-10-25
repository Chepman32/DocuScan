// Component Prop Types

export type IconName =
  | 'camera'
  | 'flash'
  | 'grid'
  | 'rotate'
  | 'crop'
  | 'filter'
  | 'save'
  | 'share'
  | 'delete'
  | 'folder'
  | 'search'
  | 'add'
  | 'close'
  | 'check'
  | 'edit'
  | 'more'
  | 'scan'
  | 'ocr'
  | 'annotation'
  | 'export'
  | 'settings'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevron-down';

export interface BaseComponentProps {
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Gesture types
export type GestureType =
  | 'tap'
  | 'doubleTap'
  | 'longPress'
  | 'pan'
  | 'pinch'
  | 'drag'
  | 'swipe'
  | 'hold'
  | 'fling'
  | 'scroll'
  | 'hover'
  | 'edgeSwipe';

// Animation hook types
export type AnimationHook =
  | 'onFocusTransition'
  | 'onPressScaleSpring'
  | 'onDismissSwipe'
  | 'onEnterSlide'
  | 'onExitFade';
