export const DISPLAYNAME_PREFIX = 'Blueprint3';
/** A collection of curated prop keys used across our Components which are not valid HTMLElement props. */
const INVALID_PROPS = [
  'active',
  'alignText',
  'containerRef',
  'elementRef',
  'fill',
  'icon',
  'inputRef',
  'intent',
  'inline',
  'large',
  'loading',
  'leftIcon',
  'minimal',
  'onChildrenMount',
  'onRemove',
  'popoverProps',
  'rightElement',
  'rightIcon',
  'round',
  'small',
  'text'
];

/**
 * Typically applied to HTMLElements to filter out blacklisted props. When applied to a Component,
 * can filter props from being passed down to the children. Can also filter by a combined list of
 * supplied prop keys and the blacklist (only appropriate for HTMLElements).
 * @param props The original props object to filter down.
 * @param {string[]} invalidProps If supplied, overwrites the default blacklist.
 * @param {boolean} shouldMerge If true, will merge supplied invalidProps and blacklist together.
 */
export function removeNonHTMLProps(props, invalidProps = INVALID_PROPS, shouldMerge = false) {
  if (shouldMerge) {
    invalidProps = invalidProps.concat(INVALID_PROPS);
  }
  return invalidProps.reduce((prev, curr) => {
    if (prev.hasOwnProperty(curr)) {
      delete prev[curr];
    }
    return prev;
  }, Object.assign({}, props));
}
