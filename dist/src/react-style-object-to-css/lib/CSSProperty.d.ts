/**
 * CSS properties which accept numbers but are not in units of "px".
 */
declare const isUnitlessNumber: {
    boxFlex: boolean;
    boxFlexGroup: boolean;
    columnCount: boolean;
    flex: boolean;
    flexGrow: boolean;
    flexPositive: boolean;
    flexShrink: boolean;
    flexNegative: boolean;
    fontWeight: boolean;
    lineClamp: boolean;
    lineHeight: boolean;
    opacity: boolean;
    order: boolean;
    orphans: boolean;
    widows: boolean;
    zIndex: boolean;
    zoom: boolean;
    fillOpacity: boolean;
    strokeDashoffset: boolean;
    strokeOpacity: boolean;
    strokeWidth: boolean;
};
export default isUnitlessNumber;
