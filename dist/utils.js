import reactToCSS from 'react-style-object-to-css';
export function processGenerator(generator) {
    const processedGenerator = generator.replace(/<\/?[^>]+>/g, match => {
        const element = match.slice(0, -1);
        if (/^[A-Z]/.test(match.slice(1, -1))) {
            const name = element.split(' ')[0].slice(1);
            const attributes = element.split(' ').slice(1);
            return `<emmy-${name.toLowerCase()} ${attributes.join(' ')}>`;
        }
        else if (/^[A-Z]/.test(match.slice(2, -2))) {
            const name = element.split(' ')[0].slice(2);
            const attributes = element.split(' ').slice(1);
            return `</emmy-${name.toLowerCase()} ${attributes.join(' ')}>`;
        }
        return match;
    });
    return processedGenerator.replace(/<emmy-[^>]+\/>/g, match => {
        const name = match.slice(6, -2);
        return `<emmy-${name}></emmy-${name}>`;
    });
}
export function parseCSS(cssString) {
    const styleObj = {};
    cssString.split('').forEach((declaration) => {
        const [property, value] = declaration.split(':');
        if (property && value) {
            styleObj[property.trim()] = value.trim();
        }
    });
    return styleObj;
}
export function createInlineStyle(cssString) {
    if (typeof cssString !== 'string')
        return reactToCSS(cssString).trim();
    const styleObj = parseCSS(cssString);
    let inlineStyle = '';
    for (const property in styleObj) {
        if (styleObj.hasOwnProperty(property)) {
            inlineStyle += `${property}: ${styleObj[property]} `;
        }
    }
    return inlineStyle.trim();
}
export function vanillaElement(element) {
    if (/^[A-Z]/.test(element)) {
        element = 'emmy-' + element.toLowerCase();
    }
    return element;
}
export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function uncapitalizeFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
export const Emmy = {};
export const loadGlobalEmmy = (obj) => {
    Object.entries(obj).forEach(([key, value]) => {
        Emmy[key] = value;
    });
};
export const html = String.raw;
export const javascript = String.raw;
export const routerClassNames = 'flex flex-col justify-center items-center space-y-3 text-center w-full h-fit box-border';
