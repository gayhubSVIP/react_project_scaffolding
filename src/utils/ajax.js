import env from '../env';

// 服务器地址
let serverUrl = env.serverUrl;
// 全局请求头
const headers = {
    // mode: 'no-cors',
};
// 全局请求参数
const ajaxData = {};
// 全局状态处理方法
let statusHandler = null;
// 全局结果处理方法
let resultHandler = null;
/**
 * encode 字符串
 * @param  {String} value 需要转码的字符串
 * @return {String} 转码结果
 */
function encode(value) {
    return String(value)
        .replace(/[^ !'()~\*]/g, encodeURIComponent)
        .replace(/ /g, '+')
        .replace(/[!'()~\*]/g, ch => `%${ch.charCodeAt().toString(16).slice(-2).toUpperCase()}`); // eslint-disable-line max-len, newline-per-chained-call
}
/**
 * 将请求对象换成字符串
 * @param  {Object} obj 请求对象
 * @return {String} 请求字符串
 */
function encodeObj(obj) {
    if (!obj) {
        return '';
    }
    const params = [];
    Object.keys(obj).forEach(key => {
        let value = obj[key];
        if (value === null || value === undefined) {
            value = '';
        }
        params.push(`${encode(key)}=${encode(value)}`);
    });
    return params.join('&').replace(/%20/g, '+');
}
/**
 * 将请求对象换成 "x-www-form-urlencoded" 类型字符串
 * @param  {Object} obj 请求对象
 * @return {String} 请求字符串
 */
function encodeForm(obj) {
    function append(newObj, key, value) {
        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            Object.keys(value).forEach(k => {
                append(newObj, `${key}[${k}]`, value[k]);
            });
            return newObj;
        }
        newObj[key] = value;
        return newObj;
    }
    return encodeObj(Object.keys(obj).reduce(
        (newObj, key) => append(newObj, key, obj[key]), {},
    ));
}
/**
 * 获取请求的 headers
 * @param  {Object} _headers 合并之前的请求头
 * @return {Object} 合并“全局请求头”之后的请求头
 */
function getHeaders(_headers = {}) {
    const keys = Object.keys(headers);
    let i = keys.length;
    while (i--) {
        _headers[keys[i]] = headers[keys[i]];
    }
    return _headers;
}
/**
 * 获取请求的数据
 * @param  {Object} _ajaxData 合并之前的请求数据
 * @return {Object} 合并“全局data”之后的data
 */
function getAjaxData(_ajaxData = {}) {
    const keys = Object.keys(ajaxData);
    let i = keys.length;
    while (i--) {
        _ajaxData[keys[i]] = ajaxData[keys[i]];
    }
    return _ajaxData;
}
/**
 * 检查请求的返回状态码
 * @param  {Object} response 服务器响应结果
 * @return {Object} 正常的响应结果
 */
function checkStatus(response) {
    const status = response.status;
    if (status >= 200 && status < 300) {
        return response;
    }
    if (typeof statusHandler === 'function') {
        statusHandler(status, response);
    }
    throw new Error(response.statusText);
}
/**
 * 将服务器相应结果转换为json
 * @param  {Object} response 服务器响应结果
 * @return {[type]} JSON数据
 */
function parseJSON(response) {
    return response.json().then(null, ex => { // 转换JSON失败
        if (typeof statusHandler === 'function') {
            statusHandler(500, response);
        }
        return Promise.reject(ex);
    });
}
/**
 * 请求失败回调函数
 * @param  {Object} ex 失败信息
 * @return {Object} 失败的Promise
 */
function errorCallback(ex) {
    // throw new Error(ex);
    return Promise.reject(ex);
}
/**
 * 请求成功回调函数
 * @param  {Object} result 服务器返回结果
 * @return {Object} 正常的数据 或者 失败的Promise
 */
function successCallback(result) {
    if (typeof resultHandler !== 'function' || resultHandler(result)) {
        return result;
    }
    return Promise.reject(result);
}
/**
 *
 *
 *
 * 设置服务器地址
 * @param {String} url 服务器地址
 */
export function setServerUrl(url) {
    if (typeof url === 'string') {
        serverUrl = url;
    }
}
/**
 * 添加全局请求头
 * @param  {String} name  请求头名称
 * @param  {String} value 请求头内容
 */
export function appendHeaders(name, value) {
    if (name) {
        headers[name] = value;
    }
}
/**
 * 移除全局请求头
 * @param  {String} name 请求头名称
 */
export function removeHeaders(name) {
    delete headers[name];
}
/**
 * 添加全局请求数据
 * @param  {String} name  请求数据名称
 * @param  {String} value 请求数据内容
 */
export function appendAjaxData(name, value) {
    if (name) {
        ajaxData[name] = value;
    }
}
/**
 * 移除全局请求数据
 * @param  {String} name 请求数据名称
 */
export function removeAjaxData(name) {
    delete ajaxData[name];
}
/**
 * 设置状态处理方法
 * @param  {Function} handler 处理方法
 */
export function setStatusHandler(handler) {
    if (typeof handler === 'function') {
        statusHandler = handler;
    }
}
/**
 * 设置结果处理方法
 * @param  {Function} handler 处理方法，返回 true 则表示正常结果
 */
export function setResultHandler(handler) {
    if (typeof handler === 'function') {
        resultHandler = handler;
    }
}
/**
 * Get请求
 * @param  {String} url  路径
 * @param  {Object} params 参数
 * @return {Promise} 请求Promise
 */
export function get(url, params) {
    const options = {
        credentials: 'same-origin',
        headers: getHeaders(),
    };
    let queryString = encodeObj(getAjaxData(params));
    if (queryString) {
        if (url.indexOf('?') === -1) {
            queryString = `?${queryString}`;
        } else {
            queryString = `&${queryString}`;
        }
    }
    return fetch(`${serverUrl}${url}${queryString}`, options)
        .then(checkStatus)
        .then(parseJSON)
        .catch(errorCallback);
}
/**
 * Get请求（返回JSON）
 * @param  {String} url  路径
 * @param  {Object} params 参数
 * @return {Promise} 请求Promise
 */
export function getJSON(url, params) {
    const options = {
        credentials: 'same-origin',
        headers: getHeaders(),
    };
    let queryString = encodeObj(getAjaxData(params));
    if (queryString) {
        if (url.indexOf('?') === -1) {
            queryString = `?${queryString}`;
        } else {
            queryString = `&${queryString}`;
        }
    }
    return fetch(`${serverUrl}${url}${queryString}`, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(successCallback)
        .catch(errorCallback);
}
/**
 * Post请求
 * @param  {String} url  路径
 * @param  {Object} data 参数
 * @return {Promise} 请求Promise
 */
export function post(url, data) {
    const options = {
        credentials: 'same-origin',
        method: 'post',
        headers: getHeaders({
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        }),
        body: encodeForm(getAjaxData(data)),
    };
    return fetch(`${serverUrl}${url}`, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(successCallback)
        .catch(errorCallback);
}
/**
 * Post请求（发送formdata）
 * @param  {String} url    路径
 * @param  {FormData} formdata 参数
 * @return {Promise} 请求Promise
 */
export function postForm(url, formdata) {
    const options = {
        credentials: 'same-origin',
        method: 'post',
        headers: getHeaders(),
        body: formdata,
    };
    const data = getAjaxData({});
    Object.keys(data).forEach(d => {
        formdata.append(d, data[d]);
    });
    return fetch(`${serverUrl}${url}`, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(successCallback)
        .catch(errorCallback);
}
/**
 * Post请求（发送json）
 * @param  {String} url  路径
 * @param  {Object} json 参数
 * @return {Promise} 请求Promise
 */
export function postJSON(url, json) {
    const options = {
        credentials: 'same-origin',
        method: 'POST',
        headers: getHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(getAjaxData(json)),
    };
    return fetch(`${serverUrl}${url}`, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(successCallback)
        .catch(errorCallback);
}
