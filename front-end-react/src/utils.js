import React from 'react';

const inject = obj => Comp => props => <Comp {...obj} {...props} />;


/**
 * 解析 url 中的 query
 * 输入：url 
 * 输出：对象
 */
function parse_qs(url) {
    let re = /(\w+)=([^&]+)/;

    if (url[0] === '?') {
        url.substr(1)
    }

    let ret = {}
    url.split('&').forEach(arg => {
        let match = re.exec(arg);
        if (match) {
            ret[match[1]] = match[2];
        };
    });

    return ret
}


export { inject, parse_qs };