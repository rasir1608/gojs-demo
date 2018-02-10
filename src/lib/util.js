/* eslint-disable no-else-return */
/* eslint-disable no-use-before-define */
/* eslint-disable block-scoped-var */
let popperTimer;
export default {
    // 根据id值判定数组中对象是否已经存在
    getObjIndexByKey(arr, obj, key) {
        let i = -1;
        if (arr && arr.length > 0) {
            arr.forEach((element, index) => {
                if (obj[key] === element[key]) {
                    i = index;
                }
            }, this);
        }
        return i;
    },
    // 将周期信息和下一周期时间合并为调度信息
    getDispatchInfo(cycleType, cycleTime, nextTime) {
        if (cycleTime) cycleTime = JSON.parse(cycleTime);
        let dispatchInfo = '';
        switch (cycleType) {
            case 'HOUR':
                dispatchInfo += `每小时${this.strAppendTo(`${cycleTime.minute}`, 2, '0')}分执行，`;
                break;
            case 'DAY':
                dispatchInfo += `每天${this.strAppendTo(`${cycleTime.hour}`, 2, '0')}:${this.strAppendTo(`${cycleTime.minute}`, 2, '0')}执行，`;
                break;
            case 'WEEK':
                dispatchInfo += `每周 ${['日', '一', '二', '三', '四', '五', '六'][cycleTime.day - 1]},${this.strAppendTo(`${cycleTime.hour}`, 2, '0')}:${this.strAppendTo(`${cycleTime.minute}`, 2, '0')}执行，`;
                break;
            case 'MONTH':
                dispatchInfo += `每月${cycleTime.day !== -1 ? `${this.strAppendTo(`${cycleTime.day}`, 2, '0')}号` : '月底'}，${this.strAppendTo(`${cycleTime.hour}`, 2, '0')}:${this.strAppendTo(`${cycleTime.minute}`, 2, '0')}执行，`;
                break;
            case 'ONETIME':
                dispatchInfo += `${cycleTime.year}-${this.strAppendTo(`${cycleTime.month}`, 2, '0')}-${this.strAppendTo(`${cycleTime.day}`, 2, '0')} ${this.strAppendTo(`${cycleTime.hour}`, 2, '0')}:${this.strAppendTo(`${cycleTime.minute}`, 2, '0')}分执行，`;
                break;
            default:
                break;
        }
        if (cycleType !== 'ONETIME' && nextTime) dispatchInfo += `下次执行时间：${this.formatTime(nextTime, 'yyyy-MM-dd HH:mm')},`;

        return dispatchInfo.substr(0, dispatchInfo.length - 1);
    },

    // 时间格式化timeFormat(t)  yyyy-MM-dd HH:mm:ss

    // 时间格式化 dateFormat(format, t) yyyy-MM-dd

    // 时间格式化formatTime(time) yyyy-MM-dd HH:mm
    formatTime(time, format) {
        if (!time) return '';
        if (!(time instanceof Date)) time = new Date(time);
        const year = time.getFullYear();
        const month = (time.getMonth() + 1) < 10 ? `0${(time.getMonth() + 1)}` : (time.getMonth() + 1);
        const date = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate();
        const hours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
        const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
        const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds();
        let formated = '';
        switch (format.trim()) {
            case 'yyyy-MM-dd HH:mm':
                formated = `${year}-${month}-${date} ${hours}:${minutes}`;
                break;
            case 'yyyy-MM-dd HH:mm:ss':
                formated = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
                break;
            case 'yyyy-MM-dd':
                formated = `${year}-${month}-${date}`;
                break;
            case 'yyyy/MM/dd':
                formated = `${year}/${month}/${date}`;
                break;
            case 'HH:mm:ss':
                formated = `${hours}:${minutes}:${seconds}`;
                break;
            case 'HH:mm':
                formated = `${hours}:${minutes}`;
                break;
            default:
                formated = `${year}/${month}/${date}`;
                break;
        }
        return formated;
    },

    // 判断对象是否有属性
    isNotEmptyObject(obj) {
        let len = 0;
        if (obj) len = Object.keys(obj).length;
        return len;
    },
    getComputedStyleValue(node, style) {
      let value = '';
      if (node.currentStyle) {
            value = node.currentStyle[style];
        } else {
            value = window.getComputedStyle(node)[style]; // 支持高级浏览器
        }
      return value;
    },
    // 获取元素与浏览器左边和顶部的距离
    getFixedPosition(node) {
        const offset = this.getFixedOffset(node);
        const scroll = this.getFixedTotalScroll(node);
        return {
            left: offset.left - scroll.left,
            top: offset.top - scroll.top,
        };
    },
    // 获取元素到html左边和顶部的距离
    getFixedOffset(node) {
      const position = this.getComputedStyleValue(node, 'position');
        const offset = {
            left: node.offsetLeft,
            top: node.offsetTop,
        };
        if (position !== 'fixed' && node.offsetParent && node.offsetParent.nodeName !== 'HTML') {
            const parentOffset = this.getFixedOffset(node.offsetParent);
            offset.left += parentOffset.left;
            offset.top += parentOffset.top;
        }
        return offset;
    },
    // 获取元素到html之间所有的滚动距离
    getFixedTotalScroll(node) {
        node = node.parentNode;
        let scroll = {
            left: node.scrollLeft,
            top: node.scrollTop,
        };
        if (node.parentNode.nodeName === 'BODY') {
            if (document.body && document.body.scrollTop && document.body.scrollLeft) {
                scroll = {
                    top: document.body.scrollTop,
                    left: document.body.scrollleft,
                };
            }
            if (document.documentElement && document.documentElement.scrollTop && document.documentElement.scrollLeft) {
                scroll = {
                    top: document.documentElement.scrollTop,
                    left: document.documentElement.scrollleft,
                };
            }
        }
        const position = this.getComputedStyleValue(node, 'position');
        if (node.nodeName !== 'HTML' && position !== 'fixed') {
            const parentScroll = this.getFixedTotalScroll(node);
            scroll.left += parentScroll.left;
            scroll.top += parentScroll.top;
        }
        return scroll;
    },
    // 深度拷贝

    deepCloneObject(obj) {
        if (typeof obj === 'object' && obj !== null) {
            if (obj.constructor === Array) {
                const newArr = [];
                for (let i = 0; i < obj.length; i++) {
                    newArr[i] = this.deepCloneObject(obj[i]);
                }
                return newArr;
            } else {
                const newObj = {};
                Object.keys(obj).forEach((key) => {
                    newObj[key] = this.deepCloneObject(obj[key]);
                });
                return newObj;
            }
        } else {
            return obj;
        }
    },

    createMessage(options) {
        options = options || {};
        const message = options.message;
        let type = options.type;
        const style = options.style;
        const messageNode = document.createElement('div');
        messageNode.className = 'sf-message';
        messageNode.innerHTML = message;
        let messageStyle = {
            padding: '10px 30px 10px 50px',
            color: '#8391a5',
            fontSize: '14px',
            position: 'fixed',
            left: '50%',
            top: '0',
            zIndex: '20000',
            backgroundColor: '#ffffff',
            minWidth: '300px',
            maxWidth: '80%',
            lineHeight: '20px',
            wordBreak: 'break-all',
            boxShadow: '0 0 10px',
            opacity: '0',
        };

        let leftSideColor = '#58B7FF';
        let leftSideClassName = 'iconfont ';
        if (!type) type = 'info';
        switch (type) {
            case 'success':
                leftSideColor = '#13CE66';
                leftSideClassName += 'icon-gou';
                break;
            case 'warning':
                leftSideColor = '#F7BA2A';
                leftSideClassName += 'icon-jinggao';
                break;
            case 'error':
                leftSideColor = '#FF4949';
                leftSideClassName += 'icon-cha';
                break;
            default:
                leftSideColor = '#58B7FF';
                leftSideClassName += 'icon-info';
                break;
        }

        if (style && typeof style === 'object') messageStyle = Object.assign(messageStyle, style);
        Object.keys(messageStyle).forEach((k) => {
            messageNode.style[k] = messageStyle[k];
        });
        document.body.appendChild(messageNode);
        messageNode.style.marginLeft = `-${messageNode.offsetWidth / 2}px`;
        const leftSideNode = document.createElement('div');
        const listSideStyle = {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '40px',
            height: '100%',
            background: leftSideColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#ffffff',
        };
        leftSideNode.className = leftSideClassName;
        Object.keys(listSideStyle).forEach((k) => {
            leftSideNode.style[k] = listSideStyle[k];
        });
        messageNode.appendChild(leftSideNode);
        const closeBtnNode = document.createElement('div');
        const closeBtnStyle = {
            position: 'absolute',
            right: '0',
            top: '0',
            width: '30px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#8391a5',
            fontSize: '14px',
            cursor: 'pointer',
        };
        closeBtnNode.className = 'iconfont icon-cha';
        Object.keys(closeBtnStyle).forEach((k) => {
            closeBtnNode.style[k] = closeBtnStyle[k];
        });
        const timer = setTimeout(() => {
            messageNode.parentNode.removeChild(messageNode);
        }, 4000);
        setTimeout(() => {
            messageNode.style.top = '50px';
            messageNode.style.opacity = '1';
            messageNode.style.transition = 'all 0.3s linear';
            setTimeout(() => {
                messageNode.style.top = '0';
                messageNode.style.opacity = '0';
            }, 3000);
        }, 0);
        if (closeBtnNode.addEventListener) {
            closeBtnNode.addEventListener('click', () => {
                clearInterval(timer);
                messageNode.parentNode.removeChild(messageNode);
            });
        } else if (closeBtnNode.attachEvent) {
            closeBtnNode.attachEvent('onclick', () => {
                clearInterval(timer);
                messageNode.parentNode.removeChild(messageNode);
            });
        }
        messageNode.appendChild(closeBtnNode);
    },
    createAlert(info, title, options) {
        options = options || {};
        const fadeTime = 200;
        // 覆盖层可自定义样式
        const coverNode = document.createElement('div');
        coverNode.className = 'sf-alert-cover';
        let coverStyle = {
            width: '100%',
            height: '100%',
            lineHeight: '30px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            left: '0',
            top: '0',
            zIndex: '1999',
            opacity: '0',
        };
        if (options && options.coverStyle) coverStyle = Object.assign(coverStyle, options.coverStyle);
        Object.keys(coverStyle).forEach((k) => {
            coverNode.style[k] = coverStyle[k];
        }, this);
        document.body.appendChild(coverNode);
        // alert层可自定义样式
        const wrapNode = document.createElement('div');
        let wrapStyle = {
            width: '420px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-210px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            fontSize: '14px',
            textAlign: 'left',
            padding: '20px',
            boxShadow: '0 0 10px',
        };
        if (options && options.wrapStyle) wrapStyle = Object.assign(wrapStyle, options.wrapStyle);
        Object.keys(wrapStyle).forEach((k) => {
            wrapNode.style[k] = wrapStyle[k];
        }, this);
        coverNode.appendChild(wrapNode);
        setTimeout(() => {
            wrapNode.style.marginTop = `-${wrapNode.offsetHeight / 2}px`;
        }, 50);
        // header可自定义样式
        const headerNode = document.createElement('div');
        let headerStyle = {
            width: '100%',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            color: '#666666',
            textAlign: 'left',
            boxSizing: 'border-box',
            padding: '20px',
            paddingBottom: '0',
            paddingRight: '40px',
            position: 'raletive',
            // borderTopLeftRadius: '4px',
            // borderTopRightRadius: '4px',
        };
        if (options && options.headerStyle) headerStyle = Object.assign(headerStyle, options.headerStyle);
        Object.keys(headerStyle).forEach((k) => {
            headerNode.style[k] = headerStyle[k];
        });
        headerNode.innerText = title;
        wrapNode.appendChild(headerNode);
        // 关闭按钮
        const closeBtnNode = document.createElement('div');
        const closeBtnStyle = {
            position: 'absolute',
            right: '20px',
            top: '20px',
            width: '30px',
            height: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#8391a5',
            fontSize: '14px',
            cursor: 'pointer',
        };
        closeBtnNode.className = 'iconfont icon-cha';
        Object.keys(closeBtnStyle).forEach((k) => {
            closeBtnNode.style[k] = closeBtnStyle[k];
        }, this);

        const cancelCallback = function () {
            removeCover();
        };
        if (closeBtnNode.addEventListener) {
            closeBtnNode.addEventListener('click', cancelCallback);
            if (options.cancelCallback) closeBtnNode.addEventListener('click', options.cancelCallback);
            else if (options.confirmCallback) closeBtnNode.addEventListener('click', options.confirmCallback);
        } else if (closeBtnNode.attachEvent) {
            closeBtnNode.attachEvent('onclick', cancelCallback);
            if (options.cancelCallback) closeBtnNode.attachEvent('click', options.cancelCallback);
            else if (options.confirmCallback) closeBtnNode.attachEvent('onclick', options.confirmCallback);
        }

        headerNode.appendChild(closeBtnNode);
        // body可自定义样式
        const bodyNode = document.createElement('div');
        let bodyStyle = {
            width: '100%',
            backgroundColor: '#ffffff',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'left',
            boxSizing: 'border-box',
            padding: '30px 20px',
        };
        if (options && options.bodyStyle) bodyStyle = Object.assign(bodyStyle, options.bodyStyle);
        Object.keys(bodyStyle).forEach((k) => {
            bodyNode.style[k] = bodyStyle[k];
        }, this);
        bodyNode.innerText = info;
        wrapNode.appendChild(bodyNode);
        // footer可自定义样式
        const footerNode = document.createElement('div');
        let footerStyle = {
            width: '100%',
            backgroundColor: '#ffffff',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'right',
            boxSizing: 'border-box',
            padding: '20px',
            paddingTop: '0',
            // borderBottomLeftRadius: '4px',
            // borderBottomRightRadius: '4px',
        };
        if (options && options.footerStyle) footerStyle = Object.assign(footerStyle, options.footerStyle);
        Object.keys(footerStyle).forEach((k) => {
            footerNode.style[k] = footerStyle[k];
        }, this);
        wrapNode.appendChild(footerNode);
        // 确定按钮
        const confirmButton = document.createElement('button');
        let confirmButtonStyle = {
            backgroundColor: '#20a0ff',
            padding: '0 20px',
            fontSize: '14px',
            color: '#ffffff',
            border: '0',
            borderRadius: '4px',
            lineHeight: '34px',
        };
        if (options && options.confirmButtonStyle) confirmButtonStyle = Object.assign(confirmButtonStyle, options.confirmButtonStyle);
        Object.keys(confirmButtonStyle).forEach((k) => {
            confirmButton.style[k] = confirmButtonStyle[k];
        }, this);
        confirmButton.innerText = options.confirmButtonText || '确定';
        const confirmCallback = function () {
            removeCover();
        };
        if (confirmButton.addEventListener) {
            confirmButton.addEventListener('click', confirmCallback);
            if (options.confirmCallback) confirmButton.addEventListener('click', options.confirmCallback);
        } else if (confirmButton.attachEvent) {
            confirmButton.attachEvent('onclick', confirmCallback);
            if (options.confirmCallback) confirmButton.attachEvent('onclick', options.confirmCallback);
        }
        footerNode.appendChild(confirmButton);
        // 取消按钮
        if (options.cancelable) {
            const cancelButton = document.createElement('button');
            let cancelButtonStyle = {
                backgroundColor: '#20a0ff',
                padding: '0 20px',
                fontSize: '14px',
                color: '#ffffff',
                marginRight: '20px',
            };
            if (options && options.cancelButtonStyle) cancelButtonStyle = Object.assign(cancelButtonStyle, options.cancelButtonStyle);
            Object.keys(cancelButtonStyle).forEach((k) => {
                cancelButton.style[k] = cancelButtonStyle[k];
            });
            cancelButton.innerText = options.cancelButtonText || '取消';
            if (cancelButton.addEventListener) {
                cancelButton.addEventListener('click', cancelCallback);
                if (options.cancelCallback) cancelButton.addEventListener('click', options.cancelCallback);
            } else if (cancelButton.attachEvent) {
                cancelButton.attachEvent('onclick', cancelCallback);
                if (options.cancelCallback) cancelButton.attachEvent('onclick', options.cancelCallback);
            }
            footerNode.appendChild(cancelButton);
        }
        addCover();

        function addCover() {
            setTimeout(() => {
                coverNode.style.opacity = '1';
                coverNode.style.transition = `all ${fadeTime / 1000}s linear`;
                if (window.addEventListener) {
                    window.addEventListener('keydown', cancelAlert);
                } else if (window.attachEvent) {
                    window.attachEvent('onkeydown', cancelAlert);
                }
            }, 0);
        }

        function removeCover() {
            coverNode.style.opacity = '0';
            setTimeout(() => {
                coverNode.parentNode.removeChild(coverNode);
                if (window.removeEventListener) window.removeEventListener('keydown', cancelAlert);
                else if (window.detachEvent) window.detachEvent('onkeydown', cancelAlert);
            }, fadeTime);
        }

        function cancelAlert(e) {
            e = e || window.event;
            if (e.keyCode === 27) {
                removeCover();
            }
        }
    },
    createPopper(depsNode, text, style) {
        let popperNode = document.getElementById('sf-bdp-popper');
        let popperExist = true;
        if (!popperNode) {
            popperNode = document.createElement('div');
            popperNode.setAttribute('id', 'sf-bdp-popper');
            popperExist = false;
        }
        popperNode.innerHTML = text;
        popperNode.className = 'sf-popper';
        const baseStyle = {
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#2d2f33',
            color: '#ffffff',
            fontSize: '12px',
            zIndex: '2002',
            position: 'fixed',
            opacity: '0',
            transition: 'opacity .2s linear',
            display: 'block',
        };
        let popperStyle = baseStyle;
        if (style) popperStyle = Object.assign(baseStyle, style);
        Object.keys(popperStyle).forEach((key) => {
            popperNode.style[key] = popperStyle[key];
        }, this);
        document.body.appendChild(popperNode);
        const depsPos = this.getFixedPosition(depsNode);
        setTimeout(() => {
            popperNode.style.left = `${depsPos.left + ((depsNode.offsetWidth - popperNode.offsetWidth) / 2)}px`;
            popperNode.style.top = `${depsPos.top - depsNode.offsetHeight - 15}px`;
            popperNode.style.opacity = '1';
        }, 0);
        if (!popperExist) {
            if (popperNode.addEventListener) {
                popperNode.addEventListener('mouseover', () => {
                    if (popperTimer) {
                        clearTimeout(popperTimer);
                        popperNode.style.opacity = '1';
                    }
                });
                popperNode.addEventListener('mouseout', () => {
                    if (popperTimer) clearTimeout(popperTimer);
                    popperTimer = setTimeout(() => {
                        popperNode.style.opacity = '0';
                        popperTimer = setTimeout(() => {
                            popperNode.style.display = 'none';
                        }, 300);
                    }, 1000);
                });
            } else if (popperNode.attachEvent) {
                popperNode.addEventListener('onmouseover', () => {
                    if (popperTimer) {
                        clearTimeout(popperTimer);
                        popperNode.style.opacity = '1';
                    }
                });
                popperNode.addEventListener('onmouseout', () => {
                    if (popperTimer) clearTimeout(popperTimer);
                    popperTimer = setTimeout(() => {
                        popperNode.style.opacity = '0';
                        popperTimer = setTimeout(() => {
                            popperNode.style.display = 'none';
                        }, 300);
                    }, 1000);
                });
            }
        }
        if (popperExist && popperTimer) {
            clearTimeout(popperTimer);
        }
        popperTimer = setTimeout(() => {
            popperNode.style.opacity = '0';
            popperTimer = setTimeout(() => {
                popperNode.style.display = 'none';
            }, 300);
        }, 1000);
    },
    // 获取字符串长度（汉字算两个字符，字母数字算一个）
    getStringLen(val) {
        return val.length;
    },
    checkValueLen(val, limit) {
        let returnVal = val;
        if (this.getStringLen(val) >= limit) {
            this.createMessage({
                message: `最多只能输入${limit}个字节`,
                type: 'error',
            });
            let times = 1;
            let total = this.getStringLen(val);
            while (total > 1) {
                total /= 10;
                times++;
            }
            let maxI = 0;
            /* Math.pow(10, i - 1); */
            for (let i = times; i > 0; i--) {
                const tens = 10 ** (i - 1);
                while (this.getStringLen(val.substring(0, maxI)) < limit) maxI += tens;
                if (i - 1 !== 0) maxI -= tens;
            }
            if (this.getStringLen(val.substring(0, maxI)) > limit) maxI--;
            returnVal = val.substring(0, maxI);
        }
        return returnVal;
    },
    deleCookies() {
        const myDate = new Date();
        myDate.setTime(-1000); // 设置时间
        const data = document.cookie;
        const dataArray = data.split(';');
        for (let i = 0; i < dataArray.length; i++) {
            const varName = dataArray[i].split('=');
            document.cookie = `${varName[0]}=''; expires=${myDate.toGMTString()}`;
        }
        const domain = document.domain.replace(/^\w*\./, '');
        document.cookie = `_TOKEN_KEY_='';domain=${domain}`;
    },
    sava2LocalStorage(name, item) {
        if (typeof item === 'object') localStorage.setItem(`sch_${name}`, JSON.stringify(item));
    },
    get4mLocalStorage(name) {
        const item = localStorage.getItem(`sch_${name}`);
        let value = '';
        try {
            value = JSON.parse(item);
        } catch (e) {
            value = item;
        }
        return value;
    },
    remove4mLocalStorage(name) {
        localStorage.removeItem(`sch_${name}`);
    },
    strAppendTo(str, num, appendStr, isAfter) {
        if (str.length > num) return str;
        let formatStr = str;
        if (isAfter) {
            for (let i = 0; i < num - str.length; i++) {
                formatStr += appendStr;
            }
        } else {
            for (let i = 0; i < num - str.length; i++) {
                formatStr = appendStr + formatStr;
            }
        }
        return formatStr;
    },
    hasValue(varible, kind) {
        let flag = 0;
        switch (kind) {
            case 'number':
                if (typeof varible === 'number') flag = 1;
                break;
            case 'string':
                if (typeof varible === 'string' && varible !== '') flag = 1;
                break;
            default:
                if (varible || varible === 0 || typeof varible === 'boolean') flag = 1;
                break;
        }
        return flag;
    },
};
