'use strict';
import isUnitlessNumber from './lib/CSSProperty.js';
import hyphenateStyleName from './lib/hyphenateStyleName.js';
const isArray = Array.isArray;
const keys = Object.keys;
// Follows syntax at https://developer.mozilla.org/en-US/docs/Web/CSS/content,
// including multiple space separated values.
const unquotedContentValueRegex = /^(normal|none|(\b(url\([^)]*\)|chapter_counter|attr\([^)]*\)|(no-)?(open|close)-quote|inherit)((\b\s*)|$|\s+))+)$/;
export function buildRule(key, value) {
    if (!isUnitlessNumber[key] && typeof value === 'number') {
        value = '' + value + 'px';
    }
    else if (key === 'content' && !unquotedContentValueRegex.test(value)) {
        value = '\'' + value.replace(/'/g, '\\\'') + '\'';
    }
    return hyphenateStyleName(key) + ': ' + value + '; ';
}
export default function styleToCssString(rules) {
    let result = '';
    if (!rules || keys(rules).length === 0) {
        return result;
    }
    const styleKeys = keys(rules);
    for (let j = 0, l = styleKeys.length; j < l; j++) {
        const styleKey = styleKeys[j];
        const value = rules[styleKey];
        if (isArray(value)) {
            for (let i = 0, len = value.length; i < len; i++) {
                result += buildRule(styleKey, value[i]);
            }
        }
        else {
            result += buildRule(styleKey, value);
        }
    }
    return result.trim();
}
