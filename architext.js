(function(architext) {
   var architext = architext();

   if (window.jQuery) {
      var $ = jQuery;
      $.architext = function(html) {
         return $(architext(html));
      }
      $.fn.architext = function(html) {
         return this.html(architext(html));
      }
   }

   window.architext = architext;

})(function() {
   var doc = document,
      selReg = /(?:([\w#\.\-\$\*\d]+)((?:\[[^\[\]]+\])+)?)/,
      attrReg = /\[([\w#\.\-\$\*\d]+)(?:=?(['"])?([^\[\]]+)\2)?\]/,
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

   function makeNodes(sel, attrs, children) {
      var el,
         ele = sel.match(nodeIdClassReg),
         cont = doc.createDocumentFragment(),
         num = ele && ele[2] ? ele[2] : (num = sel.match(numReg) || (attrs && attrs.match(numReg))) ? num[1] : 1,
         multi = (sel.match(vReg) || (attrs && attrs.match(vReg))),
         node;

      if (multi) {
         node = doc.createElement(ele[1] || "div");
         if (children) node.appendChild(children);
         for (var i = 0, k = num; i < k; i++) {
            el = node.cloneNode(true);
            if (ele[3]) el.id = ele[3].replace("#", "").replace(/\*\d+/, "").replace(vReg, function(m) {
               return padding(m, i);
            });
            if (ele[4]) el.className = ele[4].replace(/\./g, " ").replace(/\*\d+/, "").replace(vReg, function(m) {
               return padding(m, i);
            });
            if (attrs) setAttributes(attrs.replace(/\*\d+/, "").replace(vReg, function(m) {
               return padding(m, i);
            }), el);
            cont.appendChild(el);
         }
      } else {
         node = doc.createElement(ele[1] || "div");
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
         var attr = attrs[ai + 1],
            val = attrs[ai + 3];
         if (attr == "text") el.appendChild(doc.createTextNode(val));
         else if (htmlHooks[attr]) el.innerHTML = val;
         else el.setAttribute(attr, val || '');
      }
   }

   function architext(selector) {
      if (cache[selector]) return cache[selector].cloneNode(true).childNodes;

      var arr = selector.split(selReg), i = arr.length - 2, op, children, sibling, el, els;
      while (i > 0) {
         children = els;
         op = arr[i + 1].trim();
         sibling = (op === "+" || op === "~");
         els = makeNodes(arr[i - 1], arr[i], sibling ? undefined : children);
         if (sibling) els.appendChild(children);
         i -= 3;
      }

      cache[selector] = els.cloneNode(true);
      return els.childNodes;
   }
   return architext;
});
