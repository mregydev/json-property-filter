/* The MIT License (MIT)
 *
 * Copyright (c) 2016 Cyril Schumacher.fr
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import serializeToArray from "./serializer/serializeToArray";
import serializeToObject from "./serializer/serializeToObject";
import JsonExcludePropertyFilter from "./filter/jsonExcludePropertyFilter";
import JsonIncludePropertyFilter from "./filter/jsonIncludePropertyFilter";

/**
 * Filter class to include or exclude elements from a JSON object or array.
 * @class
 * @version 1.2.0
 * @example
 * var filter = new JsonPropertyFilter(["**"]);
 * var filtered = filter.apply({key: "value"});
 */
export class JsonPropertyFilter {
    private static DEFAULT_INCLUDE_SYMBOL = /^()[^+-]/g;
    private static EXCLUDE_SYMBOL = /^(\-)/g;
    private static FILTER_SEPARATOR = ",";
    private static INCLUDE_SYMBOL = /^(\+)/g;

    private _excludeFilters: Array<string>;
    private _includeFilters: Array<string>;

    /**
     * Constructor.
     * @constructors
     * @param {string|string[]} filters Filters.
     * @param {string} separator A separator for filters.
     */
    public constructor(filters?: string | Array<string>, separator?: string) {
        if (filters) {
            this.setExcludeFilters(filters, separator);
            this.setIncludeFilters(filters, separator);
        }
    }

    /**
     * Gets exclude filters
     * @return {string[]} The exclude filters.
     */
    public get excludeFilters() {
        return this._excludeFilters;
    }

    /**
     * Gets exclude filters
     * @return {string[]} The exclude filters.
     */
    public get includeFilters() {
        return this._includeFilters;
    }

    /**
     * Apply filter on a JSON object.
     * @param {Object|Object[]} source A JSON object.
     * @return {Object} The filtered JSON object or array.
     */
    public apply(source: Object | Array<Object>): Object | Array<Object> {
        const keys = serializeToArray(source);

        let filtered = new Array<string>();
        filtered = this._applyInclude(keys);
        filtered = this._applyExcludeFilters(filtered);

        return serializeToObject(filtered);
    }

    /**
     * Sets exclude filters.
     * @param {string|string[]} filters Filters.
     * @param {string} separator A separator for filters.
     * @throws {TypeError} Throws if: 'filters' is not string type or Array; 'separator' is null or is not string type.
     */
    public setExcludeFilters(filters: string | Array<string>, separator?: string) {
        this._assertFilters(filters);
        this._assertSeparator(separator);

        const formattedProperties = this._formatProperties(filters, separator);
        const excludeSymbols = [JsonPropertyFilter.EXCLUDE_SYMBOL];
        this._excludeFilters = this._extractProperties(formattedProperties, excludeSymbols);
    }

    /**
     * Sets include filters.
     * @param {string|string[]} filters Filters.
     * @param {string} separator A separator for filters.
     * @throws {TypeError} Throws if: 'filters' is not string type or Array; 'separator' is null or is not string type.
     */
    public setIncludeFilters(filters: string | Array<string>, separator?: string) {
        this._assertFilters(filters);
        this._assertSeparator(separator);

        const formattedProperties = this._formatProperties(filters, separator);
        const includeSymbols = [JsonPropertyFilter.INCLUDE_SYMBOL, JsonPropertyFilter.DEFAULT_INCLUDE_SYMBOL];
        this._includeFilters = this._extractProperties(formattedProperties, includeSymbols);
    }

    private _applyInclude(source: Array<string>): Array<string> {
        const include = new JsonIncludePropertyFilter(this._includeFilters);
        return include.apply(source);
    }

    private _applyExcludeFilters(source: Array<string>): Array<string> {
        const exclude = new JsonExcludePropertyFilter(this._excludeFilters);
        return exclude.apply(source);
    }

    private _assertFilters(filters: string | Array<string>) {
        if (!Array.isArray(filters) && (typeof filters !== "string")) {
            throw new TypeError("Parameter 'filters' is not a string or array type.");
        }
    }

    private _assertSeparator(separator?: string) {
        if (separator && (separator !== "string")) {
            throw new TypeError("Parameter 'separator' is not a string type.");
        }
    }

    private _extractProperties(properties: Array<string>, symbols: Array<RegExp>): Array<string> {
        let extract = new Array<string>();

        for (let property of properties) {
            const formattedProperty = this._extractProperty(property, symbols);

            if (formattedProperty) {
                extract.push(formattedProperty);
            }
        }

        return extract;
    }

    private _extractProperty(property: string, symbols: Array<RegExp>): string {
        for (const symbol of symbols) {
            const matches = symbol.exec(property);
            symbol.lastIndex = 0;

            if (matches) {
                const start = matches[1];

                if (start.length) {
                    return property.substring(start.length);
                } else {
                    return property;
                }
            }
        }

        return undefined;
    }

    private _formatProperties(properties: string | Array<string>, separator?: string): Array<string> {
        if (typeof properties === "string") {
            const separatorFilters = separator || JsonPropertyFilter.FILTER_SEPARATOR;
            return properties.split(separatorFilters);
        } else {
            return properties;
        }
    }
}
