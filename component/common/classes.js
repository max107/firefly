import { Alignment } from './alignment';
import { Elevation } from './elevation';
import { Intent } from './intent';

// modifiers
export const NS = 'b-';
export const ACTIVE = 'active';
export const ALIGN_LEFT = 'align-left';
export const ALIGN_RIGHT = 'align-right';
export const DARK = 'dark';
export const DISABLED = 'disabled';
export const FILL = 'fill';
export const FIXED = 'fixed';
export const FIXED_TOP = 'fixed-top';
export const INLINE = 'inline';
export const INTERACTIVE = 'interactive';
export const LARGE = 'large';
export const LOADING = 'loading';
export const MINIMAL = 'minimal';
export const MULTILINE = 'multiline';
export const ROUND = 'round';
export const SMALL = 'small';
export const VERTICAL = 'vertical';
export const ELEVATION_0 = elevationClass(Elevation.ZERO);
export const ELEVATION_1 = elevationClass(Elevation.ONE);
export const ELEVATION_2 = elevationClass(Elevation.TWO);
export const ELEVATION_3 = elevationClass(Elevation.THREE);
export const ELEVATION_4 = elevationClass(Elevation.FOUR);
export const INTENT_PRIMARY = intentClass(Intent.PRIMARY);
export const INTENT_SUCCESS = intentClass(Intent.SUCCESS);
export const INTENT_WARNING = intentClass(Intent.WARNING);
export const INTENT_DANGER = intentClass(Intent.DANGER);
export const FOCUS_DISABLED = 'focus-disabled';
// text utilities
export const UI_TEXT = 'ui-text';
export const RUNNING_TEXT = 'running-text';
export const MONOSPACE_TEXT = 'monospace-text';
export const TEXT_LARGE = 'text-large';
export const TEXT_SMALL = 'text-small';
export const TEXT_MUTED = 'text-muted';
export const TEXT_DISABLED = 'text-disabled';
export const TEXT_OVERFLOW_ELLIPSIS = 'text-overflow-ellipsis';
// textual elements
export const BLOCKQUOTE = 'blockquote';
export const CODE = 'code';
export const CODE_BLOCK = 'code-block';
export const HEADING = 'heading';
export const LIST = 'list';
export const LIST_UNSTYLED = 'list-unstyled';
export const RTL = 'rtl';
// components
export const ALERT = 'alert';
export const ALERT_BODY = `${ALERT}-body`;
export const ALERT_CONTENTS = `${ALERT}-contents`;
export const ALERT_FOOTER = `${ALERT}-footer`;
export const BREADCRUMB = 'breadcrumb';
export const BREADCRUMB_CURRENT = `${BREADCRUMB}-current`;
export const BREADCRUMBS = `${BREADCRUMB}s`;
export const BREADCRUMBS_COLLAPSED = `${BREADCRUMB}s-collapsed`;
export const BUTTON = 'button';
export const BUTTON_GROUP = `${BUTTON}-group`;
export const BUTTON_SPINNER = `${BUTTON}-spinner`;
export const BUTTON_TEXT = `${BUTTON}-text`;
export const CALLOUT = 'callout';
export const CALLOUT_ICON = `${CALLOUT}-icon`;
export const CARD = 'card';
export const COLLAPSE = 'collapse';
export const COLLAPSE_BODY = `${COLLAPSE}-body`;
export const COLLAPSIBLE_LIST = 'collapse-list';
export const CONTEXT_MENU = 'context-menu';
export const CONTEXT_MENU_POPOVER_TARGET = `${CONTEXT_MENU}-popover-target`;
export const CONTROL_GROUP = 'control-group';
export const DIALOG = 'dialog';
export const DIALOG_CONTAINER = `${DIALOG}-container`;
export const DIALOG_BODY = `${DIALOG}-body`;
export const DIALOG_CLOSE_BUTTON = `${DIALOG}-close-button`;
export const DIALOG_FOOTER = `${DIALOG}-footer`;
export const DIALOG_FOOTER_ACTIONS = `${DIALOG}-footer-actions`;
export const DIALOG_HEADER = `${DIALOG}-header`;
export const EDITABLE_TEXT = 'editable-text';
export const EDITABLE_TEXT_CONTENT = `${EDITABLE_TEXT}-content`;
export const EDITABLE_TEXT_EDITING = `${EDITABLE_TEXT}-editing`;
export const EDITABLE_TEXT_INPUT = `${EDITABLE_TEXT}-input`;
export const EDITABLE_TEXT_PLACEHOLDER = `${EDITABLE_TEXT}-placeholder`;
export const FLEX_EXPANDER = 'flex-expander';
export const HTML_SELECT = 'html-select';
/** @deprecated prefer `<HTMLSelect>` component */
export const SELECT = 'select';
export const HTML_TABLE = 'html-table';
export const HTML_TABLE_STRIPED = `${HTML_TABLE}-striped`;
export const HTML_TABLE_BORDERED = `${HTML_TABLE}-bordered`;
export const INPUT = 'input';
export const INPUT_GHOST = `${INPUT}-ghost`;
export const INPUT_GROUP = `${INPUT}-group`;
export const INPUT_ACTION = `${INPUT}-action`;
export const CONTROL = 'control';
export const CONTROL_INDICATOR = `${CONTROL}-indicator`;
export const CHECKBOX = 'checkbox';
export const RADIO = 'radio';
export const SWITCH = 'switch';
export const FILE_INPUT = 'file-input';
export const FILE_UPLOAD_INPUT = 'file-upload-input';
export const KEY = 'key';
export const KEY_COMBO = `${KEY}-combo`;
export const MODIFIER_KEY = 'modifier-key';
export const HOTKEY = 'hotkey';
export const HOTKEY_LABEL = `${HOTKEY}-label`;
export const HOTKEY_COLUMN = `${HOTKEY}-column`;
export const HOTKEY_DIALOG = `${HOTKEY}-dialog`;
export const LABEL = 'label';
export const FORM_GROUP = 'form-group';
export const FORM_CONTENT = 'form-content';
export const FORM_HELPER_TEXT = 'form-helper-text';
export const MENU = 'menu';
export const MENU_ITEM = `${MENU}-item`;
export const MENU_ITEM_LABEL = `${MENU_ITEM}-label`;
export const MENU_SUBMENU = 'submenu';
export const MENU_DIVIDER = `${MENU}-divider`;
export const MENU_HEADER = `${MENU}-header`;
export const NAVBAR = 'navbar';
export const NAVBAR_GROUP = `${NAVBAR}-group`;
export const NAVBAR_HEADING = `${NAVBAR}-heading`;
export const NAVBAR_DIVIDER = `${NAVBAR}-divider`;
export const NON_IDEAL_STATE = 'non-ideal-state';
export const NON_IDEAL_STATE_VISUAL = `${NON_IDEAL_STATE}-visual`;
export const NUMERIC_INPUT = 'numeric-input';
export const OVERFLOW_LIST = 'overflow-list';
export const OVERFLOW_LIST_SPACER = `${OVERFLOW_LIST}-spacer`;
export const OVERLAY = 'overlay';
export const OVERLAY_BACKDROP = `${OVERLAY}-backdrop`;
export const OVERLAY_CONTENT = `${OVERLAY}-content`;
export const OVERLAY_INLINE = `${OVERLAY}-inline`;
export const OVERLAY_OPEN = `${OVERLAY}-open`;
export const OVERLAY_SCROLL_CONTAINER = `${OVERLAY}-scroll-container`;
export const PANEL_STACK = 'panel-stack';
export const PANEL_STACK_HEADER = `${PANEL_STACK}-header`;
export const PANEL_STACK_HEADER_BACK = `${PANEL_STACK}-header-back`;
export const PANEL_STACK_VIEW = `${PANEL_STACK}-view`;
export const POPOVER = 'popover';
export const POPOVER_ARROW = `${POPOVER}-arrow`;
export const POPOVER_BACKDROP = `${POPOVER}-backdrop`;
export const POPOVER_CONTENT = `${POPOVER}-content`;
export const POPOVER_CONTENT_SIZING = `${POPOVER_CONTENT}-sizing`;
export const POPOVER_DISMISS = `${POPOVER}-dismiss`;
export const POPOVER_DISMISS_OVERRIDE = `${POPOVER_DISMISS}-override`;
export const POPOVER_OPEN = `${POPOVER}-open`;
export const POPOVER_TARGET = `${POPOVER}-target`;
export const POPOVER_WRAPPER = `${POPOVER}-wrapper`;
export const TRANSITION_CONTAINER = 'transition-container';
export const PROGRESS_BAR = 'progress-bar';
export const PROGRESS_METER = 'progress-meter';
export const PROGRESS_NO_STRIPES = 'no-stripes';
export const PROGRESS_NO_ANIMATION = 'no-animation';
export const PORTAL = 'portal';
export const SKELETON = 'skeleton';
export const SLIDER = 'slider';
export const SLIDER_AXIS = `${SLIDER}-axis`;
export const SLIDER_HANDLE = `${SLIDER}-handle`;
export const SLIDER_LABEL = `${SLIDER}-label`;
export const SLIDER_TRACK = `${SLIDER}-track`;
export const SLIDER_PROGRESS = `${SLIDER}-progress`;
export const START = 'start';
export const END = 'end';
export const SPINNER = 'spinner';
export const SPINNER_HEAD = `${SPINNER}-head`;
export const SPINNER_NO_SPIN = 'no-spin';
export const SPINNER_TRACK = `${SPINNER}-track`;
export const TAB = 'tab';
export const TAB_INDICATOR = `${TAB}-indicator`;
export const TAB_INDICATOR_WRAPPER = `${TAB_INDICATOR}-wrapper`;
export const TAB_LIST = `${TAB}-list`;
export const TAB_PANEL = `${TAB}-panel`;
export const TABS = `${TAB}s`;
export const TAG = 'tag';
export const TAG_REMOVE = `${TAG}-remove`;
export const TAG_INPUT = 'tag-input';
export const TAG_INPUT_ICON = `${TAG_INPUT}-icon`;
export const TAG_INPUT_VALUES = `${TAG_INPUT}-values`;
export const TOAST = 'toast';
export const TOAST_CONTAINER = `${TOAST}-container`;
export const TOAST_MESSAGE = `${TOAST}-message`;
export const TOOLTIP = 'tooltip';
export const TOOLTIP_INDICATOR = `${TOOLTIP}-indicator`;
export const TREE = 'tree';
export const TREE_NODE = 'tree-node';
export const TREE_NODE_CARET = `${TREE_NODE}-caret`;
export const TREE_NODE_CARET_CLOSED = `${TREE_NODE_CARET}-closed`;
export const TREE_NODE_CARET_NONE = `${TREE_NODE_CARET}-none`;
export const TREE_NODE_CARET_OPEN = `${TREE_NODE_CARET}-open`;
export const TREE_NODE_CONTENT = `${TREE_NODE}-content`;
export const TREE_NODE_EXPANDED = `${TREE_NODE}-expanded`;
export const TREE_NODE_ICON = `${TREE_NODE}-icon`;
export const TREE_NODE_LABEL = `${TREE_NODE}-label`;
export const TREE_NODE_LIST = `${TREE_NODE}-list`;
export const TREE_NODE_SECONDARY_LABEL = `${TREE_NODE}-secondary-label`;
export const TREE_NODE_SELECTED = `${TREE_NODE}-selected`;
export const TREE_ROOT = 'tree-root';
export const ICON = 'icon';
export const ICON_STANDARD = `${ICON}-standard`;
export const ICON_LARGE = `${ICON}-large`;

/**
 * Returns the namespace prefix for all Blueprint CSS classes.
 * Customize this namespace at build time with the `process.env.BLUEPRINT_NAMESPACE` environment variable.
 */
export function getClassNamespace() {
  return NS;
}

/** Return CSS class for alignment. */
export function alignmentClass(alignment) {
  switch (alignment) {
    case Alignment.LEFT:
      return ALIGN_LEFT;
    case Alignment.RIGHT:
      return ALIGN_RIGHT;
    default:
      return undefined;
  }
}

export function elevationClass(elevation) {
  if (elevation == null) {
    return undefined;
  }
  return `elevation-${elevation}`;
}

/** Returns CSS class for icon name. */
export function iconClass(iconName) {
  if (iconName == null) {
    return undefined;
  }
  return iconName.indexOf('icon-') === 0 ? iconName : `icon-${iconName}`;
}

/** Return CSS class for intent. */
export function intentClass(intent) {
  if (intent == null || intent === Intent.NONE) {
    return undefined;
  }
  return `intent-${intent.toLowerCase()}`;
}
