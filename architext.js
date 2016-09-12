(function (architext) {
    var architext = architext();

    if (window.jQuery) {
        var $ = jQuery;
        $.architext = function (html) {
            return $(architext(html));
        }
        $.fn.architext = function (html) {
            return this.html(architext(html));
        }
    }

    window.architext = architext;

})(function () {
    var doc = document,
       selReg = /(?:([\w#\.\-\$\*\d]+)((?:\[.+?\]?['"]?\])+)?)/,
       attrReg = /\[([\w#\.\-\$\*\d]+)(?:=?(['"])?(.+?\]?)\2)?\]/,
       nodeIdClassReg = /^([\w\-\d]+)?(?:\*(\d+))?(#[\w\-\$\*\d]+)?(?:\.((?:[\w\-\$\*\d]+(?:\.|$))+))?/,
       numReg = /\*(\d+)/,
       vReg = /(\$+)/g,
       cache = {},
       htmlHooks = {
           html: true,
           innerHTML: true
       }

    function padding(txt, i) {
        var i = i + 1, l = (l = txt.length - i.toString().length) > 0 ? l : 0, pad = "";
        while (l--) pad += "0";
        return pad + i;
    }

    function iteration(str, i) {
        return str.replace(/\*\d+/, "").replace(vReg, function (m) {
            return padding(m, i);
        });
    }

    function makeNodes(sel, attrs, children) {
        var el,
           ele = sel.match(nodeIdClassReg),
           cont = doc.createDocumentFragment(),
           num = ele && ele[2] ? ele[2] : (num = sel.match(numReg) || (attrs && attrs.match(numReg))) ? num[1] : 1,
           multi = (sel.match(vReg) || (attrs && attrs.match(vReg))),
           node = doc.createElement(ele[1] || "div");

        if (multi) {
            for (var i = 0, k = num; i < k; i++) {
                el = node.cloneNode(true);
                if (ele[3]) el.id = iteration(ele[3].replace("#", ""),i);
                if (ele[4]) el.className = iteration(ele[4].replace(/\./g, " "), i)
                if (attrs) setAttributes(iteration(attrs, i), el);
                if (children) el.appendChild(children.cloneNode(true));
                cont.appendChild(el);
            }
        } else {
            if (ele[3]) node.id = ele[3].replace("#", "");
            if (ele[4]) node.className = ele[4].replace(/\./g, " ");
            if (attrs) setAttributes(attrs, node);
            if (children) node.appendChild(children);
            for (var i = 0, k = num; i < k; i++) {
                cont.appendChild(node.cloneNode(true));
            }
        }
        return cont;
    }

    function setAttributes(attrStr, el) {
        var attrs = attrStr.split(attrReg);
        for (var ai = 0, k = attrs.length - 1; ai < k; ai = ai + 4) {
            var attr = attrs[ai + 1], val = attrs[ai + 3];
            if (attr == "text") el.appendChild(doc.createTextNode(val));
            else if (htmlHooks[attr]) el.innerHTML = val;
            else el.setAttribute(attr, val || '');
        }
    }

    function cached(str, el) {
        return (cache[str] || (cache[str] = el)).cloneNode(true);
    }

    function branch(selector, children) {
        var arr = selector.split(selReg), i = arr.length - 2, op, children, sibling, el, els;
        while (i > 0) {
            children = els || children;
            op = arr[i + 1].trim();
            sibling = (op === "+" || op === "~");
            els = makeNodes(arr[i - 1], arr[i], sibling ? undefined : children);
            if (sibling) els.appendChild(children);
            i -= 3;
        }
        return els;
    }

    function nesting(selector) {
        var str = selector, start = 0, open = 0, close = 0, upto = 0, char, i, before, after, elAfter, elBefore, elStr;

        while (i = str.search(/(\(|\))/g) + 1) {
            char = str.charAt(i-1);
            if (char === "(") {
                open++;
                if (!start) start = i;
                upto += i;
            } else {
                close++;
                upto += i;
            }
            if (open === close) {
                before = selector.substring(0, start - 1);
                str = selector.substring(start, upto - 1);
                after = selector.substring(upto, selector.length);

                after = after.match(/^\s*(\+|\~|\>)?\s*(.+)/);
                if (after && after[2]) elAfter = nesting(after[2]);

                elStr = cache[str] ? cache[str].cloneNode(true) : nesting(str);
                if (elAfter) elStr.appendChild(elAfter);

                before = before.match(/(.+)\s*(\+|\~|\>)?\s*$/);
                if (before && before[1]) {
                    if (before[2]) {
                        elBefore = branch(before[1]);
                        return cached(selector, elBefore.appendChild(elStr));
                    } else {
                        elBefore = branch(before[1], elStr);
                        return cached(selector, elBefore);
                    }
                }
                return cached(selector, elStr);
            } else {
                str = str.substring(i, str.length);
            }
        }
        if (cache[selector]) return cache[selector].cloneNode(true);
        return cached(selector, branch(selector));
    }

    function architext(selector) {
        return nesting(selector).childNodes;
    }

    return architext;
});