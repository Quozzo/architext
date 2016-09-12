# architext

***architext*** is used to build HTML with CSS selectors. There are no dependancies, libraries or frameworks used, it's a completely standalone function. The returned value is a collection of DOM nodes.

[View Live Demo](https://quozzo.github.io/architext/)

Turn this
```js
architext('div p');
```
into this
```html
<div>
    <p></p>
</div>
```

###Add IDs, classes and attributes.

To add an ID or a class.
```js
architext('div#foo p.intro');
```
returns
```html
<div id='foo'>
    <p class='intro'></p>
</div>
```
Add attributes with the square brackets. The `"` or `'` can be used or omitted.
```js
architext('div#foo a.bar[text="Hello World"][href=http://www.google.com]');
```
returns
```html
<div id='foo'>
    <a class='bar' href='http://www.google.com'>Hello World</a>
</div>
```
Omitting the element when assigning an ID or class will assume you want a div element.
```js
architext('#foo .lorem.ipsum');
```
returns
```html
<div id='foo'>
    <div class='lorem ipsum'></div>
</div>
```

###Creating multiple elements

Use the multiplyer to create multiple elements.
```js
architext('ul li*3');
```
returns
```html
<ul>
    <li></li>
    <li></li>
    <li></li>
</ul>
```
Use the `$` symbol to include the iterator number.
```js
architext('ul li*3[text="List $"]');
```
returns
```html
<ul>
    <li>List 1</li>
    <li>List 2</li>
    <li>List 3</li>
</ul>
```
The $ symbol can be used anywhere in the current element. Multiple $ symbols add extra padding.
```js
architext('ul li*3.item-$$[text=List $]');
```
returns
```html
<ul>
    <li class='item-01'>List 1</li>
    <li class='item-02'>List 2</li>
    <li class='item-03'>List 3</li>
</ul>
```
*Note: The iterator number cannot be used on the elements children*

The multiplier can be used on any element in the chain.
```js
architext('table tr*3 td*5');
```
returns
```html
<table>
    <tr>
        <td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
        <td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
        <td></td><td></td><td></td><td></td><td></td>
    </tr>
</table>
```

###Create Siblings

Create siblings using either the `+` or `~` symbol.
```js
architext('ul li*2 a + img');
```
returns
```html
<ul>
    <li>
        <a></a>
        <img>
    </li>
    <li>
        <a></a>
        <img>
    </li>
</ul>
```

###Nest multiple branches with groups.
```js
architext("div (ul li*3[text=List $]) + (div p[text=Paragraph] img) + div a[text=Google][href=http://google.com]");
```
returns
```html
<div>
    <ul>
        <li>List 1</li>
        <li>List 2</li>
        <li>List 3</li>
    </ul>
    <div>
        <p>
            Paragraph
            <img>
        </p>
    </div>
    <div>
        <a href='http://google.com'>Google</a>
    </div>
</div>
```
No limit to the nesting.
```js
architext("div (ul li*3[text=List $]) + (div*3 (h3[text=Heading] + a[href=http://google.com] img[src=https://services.github.com/kit/images/github-icon.jpg][height=50px] + span[text=I'm a link]) + p (i[text=some italic] b[text= and bold text.]) span[text= something else] ) + footer div");
```
returns
```html
<div>
    <ul>
        <li>List 1</li>
        <li>List 2</li>
        <li>List 3</li>
    </ul>
    <div>
        <h3>Heading</h3>
        <a href='http://google.com'>
            <img src='https://services.github.com/kit/images/github-icon.jpg' height='50px' />
            <span>I'm a Link</span>
        </a>
        <p>
            <i>
                Some Italic
                <b> and bold text.</b>
            </i>
            <span>Something else</span>
        </p>
    </div>
    <footer>
        <div></div>
    </footer>
```

###Custom element and attributes

architext also supports custom attributes and elements
```js
architext('custom-element[data-foo=bar]');
```
returns
```html
<custom-element data-foo='bar'></custom-element>
```

###jQuery support
If jQuery is detected then architext can be used as an extension of jQuery.
```js
$.architext("div p img");
```
The HTML will be wrapped in jQuery allowing the use of all it's methods.
```js
$.architext("div p img").appendTo("#foo");
```
architext can also be used as a plugin of jQuery.
```js
$('#foo').architext("div img + a").find('img').next();
```
