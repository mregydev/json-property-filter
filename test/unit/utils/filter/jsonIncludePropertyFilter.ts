/* The MIT License (MIT)
 *
 * Copyright (c) 2017 Cyril Schumacher.fr
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

import { assert } from "chai";
import { JsonIncludePropertyFilter } from "../../../../src/filter/jsonIncludePropertyFilter";

describe("jsonIncludePropertyFilter", () => {
    describe("Array", () => {
        it("should return original array", () => {
            const source = [];
            source["[0].key"] = "value1";
            source["[1].key"] = "value2";

            const filter = new JsonIncludePropertyFilter([]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, source);
        });

        it("should return all properties", () => {
            const source = [];
            source["[0].key"] = "value1";
            source["[0].key.key2"] = "value2";
            source["[0].key.key3[0]"] = "value3";
            source["[0].key.key3[1]"] = "value4";
            source["[1].key"] = "value2";
            source["[1].key.key2"] = "value2";
            source["[1].key.key3[0]"] = "value3";
            source["[1].key.key3[1]"] = "value4";

            const filter = new JsonIncludePropertyFilter(["**"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, source);
        });

        it("should return all properties excepted the 'key2' property", () => {
            const source = [];
            source["[0].key1"] = "value1";
            source["[0].key2"] = "value2";
            source["[1].key1"] = "value1";
            source["[1].key2"] = "value2";

            const expected = [];
            expected["[0].key1"] = "value1";
            expected["[1].key1"] = "value1";

            const filter = new JsonIncludePropertyFilter(["key1"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, expected);
        });

        it("should return the root properties excepted 'key2' property", () => {
            const source = [];
            source["[0].key1.key2"] = "value2";
            source["[0].key1.key3.key4"] = "value3";
            source["[0].key1.key3.key5"] = "value4";
            source["[1].key1.key2"] = "value2";
            source["[1].key1.key3.key4"] = "value3";
            source["[1].key1.key3.key5"] = "value4";

            const expected = [];
            expected["[0].key1.key3.key4"] = "value3";
            expected["[0].key1.key3.key5"] = "value4";
            expected["[1].key1.key3.key4"] = "value3";
            expected["[1].key1.key3.key5"] = "value4";

            const filter = new JsonIncludePropertyFilter(["key1.key3.*"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, expected);
        });

        it("should return array that contains 'key3' property only", () => {
            const source = [];
            source["[0].key1[0].key2"] = "value2";
            source["[0].key1[0].key3"] = "value3";
            source["[0].key1[1].key2"] = "value2";
            source["[0].key1[1].key3"] = "value3";
            source["[1].key1[0].key2"] = "value2";
            source["[1].key1[0].key3"] = "value3";
            source["[1].key1[1].key2"] = "value2";
            source["[1].key1[1].key3"] = "value3";

            const expected = [];
            expected["[0].key1[0].key3"] = "value3";
            expected["[0].key1[1].key3"] = "value3";
            expected["[1].key1[0].key3"] = "value3";
            expected["[1].key1[1].key3"] = "value3";

            const filter = new JsonIncludePropertyFilter(["key1.key3"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, expected);
        });

        it("should return all properties excepted 'key3' property", () => {
            const source = [];
            source["[0]key1"] = "value1";
            source["[0]key2"] = "value2";
            source["[0]key3.key4"] = "value3";
            source["[1]key1"] = "value1";
            source["[1]key2"] = "value2";
            source["[1]key3.key4"] = "value3";

            const expected = [];
            expected["[0]key1"] = "value1";
            expected["[0]key2"] = "value2";
            expected["[1]key1"] = "value1";
            expected["[1]key2"] = "value2";

            const filter = new JsonIncludePropertyFilter(["*"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, expected);
        });
    });

    describe("Object", () => {
        it("should return original array", () => {
            const source = [];
            source["key1"] = "value1";
            source["key2"] = "value2";
            source["key3.key4"] = "value3";

            const filter = new JsonIncludePropertyFilter([]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, source);
        });

        it("should return all properties", () => {
            const source = [];
            source["key1"] = "value";
            source["key2.key3.key4"] = "value3";
            source["key2.key3.key4"] = "value4";

            const filter = new JsonIncludePropertyFilter(["**"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, source);
        });

        it("should return all properties excepted the 'key2' property", () => {
            const source = [];
            source["key1"] = "value1";
            source["key2"] = "value2";

            const expected = [];
            expected["key1"] = "value1";

            const filter = new JsonIncludePropertyFilter(["key1"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, expected);
        });

        it("should return the root properties excepted 'key2' property", () => {
            const source = [];
            source["key1.key2"] = "value2";
            source["key1.key3.key4"] = "value3";
            source["key1.key3.key5"] = "value4";

            const expected = [];
            expected["key1.key3.key4"] = "value3";
            expected["key1.key3.key5"] = "value4";

            const filter = new JsonIncludePropertyFilter(["key1.key3.*"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, expected);
        });

        it("should return array that contains 'key3' property only", () => {
            const source = [];
            source["key1[0].key2"] = "value2";
            source["key1[0].key3"] = "value3";
            source["key1[1].key2"] = "value2";
            source["key1[1].key3"] = "value3";

            const expected = [];
            expected["key1[0].key3"] = "value3";
            expected["key1[1].key3"] = "value3";

            const filter = new JsonIncludePropertyFilter(["key1.key3"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, expected);
        });

        it("should return all properties excepted 'key3' property", () => {
            const source = [];
            source["key1"] = "value1";
            source["key2"] = "value2";
            source["key3.key4"] = "value3";

            const expected = [];
            expected["key1"] = "value1";
            expected["key2"] = "value2";

            const filter = new JsonIncludePropertyFilter(["*"]);
            const filtered = filter.apply(source);

            assert.deepEqual(filtered, expected);
        });
    });
});
