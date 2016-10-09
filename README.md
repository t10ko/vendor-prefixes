# JavaScript tiny lib for checking and manipulating with vendor prefixes.

[Vendor prefixes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) are used by browsers to make non standart features.

But they only make problems.  
Here is a short API to handle vendor prefixes.

## Using with bower

```sh
bower install vendor-prefixes
```

# API reference

### VendorPrefixes.versions( value, type )

**versions** make and return vendor prefixed versions of a **value**.
Type is vendor prefixing type.  
Can be **'JS'**, **'JSClass'**, **'CSS'**, , **'const'**, **'event'**.

**JS** is for javascript functions that can have prefixes.
**JSClass** is for javascript classes.
**CSS** is for css properties.
**const** is for javascript class constants.
**event** is for HTML event names.

Here are examples.
```javascript
console.log( VendorPrefixes.versions( 'requestAnimationFrame', 'JS' ) );
console.log( VendorPrefixes.versions( 'MutationObserver', 'JSClass' ) );
console.log( VendorPrefixes.versions( 'transition', 'CSS' ) );
console.log( VendorPrefixes.versions( 'KEYFRAMES_RULE', 'const' ) );
console.log( VendorPrefixes.versions( 'transitionStart', 'event' ) );
```

the only difference of type **event** is that microsofts prefix is other then standart JS functions prefixes.

### VendorPrefixes.try( value, type, helper )

This tries to find a prefix of current system.  
This tries all versions of **type** type of **value** trying to find out which one is supported.  
**helpier** is that helper function which is called for every version and helps this API to find out supports.  
Helper must return a boolean value, which indicates is that version supported or not.

**try** returns object( with version and prefix values ) if a vendor prefixed version of **value** matched, or null.

If vendor prefix version for current system is already found, this will try only *that* vendor prefixed version of **value**.

Examples.
```javascript
//  Try this using webkit.
VendorPrefixes.try( 'requestAnimationFrame', 'JS', function ( version ) {
    return !!window[ version ];
} );
VendorPrefixes.try( 'MutationObserver', 'JSClass', function ( version ) {
    return !!window[ version ];
} );
```

### VendorPrefixes.make( value )

If vendor prefix is found for current system, this will prefix given **value** with that prefix.
```javascript
//  Again, try this using webkit.
VendorPrefixes.try( 'requestAnimationFrame', 'JS', function ( version ) {
    return !!window[ version ];
} );

console.log( VendorPrefixes.make( 'cancelAnimationFrame' ) );
```

If no vendor prefix is found, this will return false.
```javascript
//  Try this without calling 'try' method before it.
console.log( VendorPrefixes.make( 'requestAnimationFrame' ) );
```

### VendorPrefixes.matched( version )

If you tried something on your own and found vendor prefix for current system, give it to this function.
This will save that prefix **version** as current system's default.

```javascript
//  Will print false.
console.log( VendorPrefixes.make( 'requestAnimationFrame' ) );

if( window.webkitCancelAnimationFrame )
    VendorPrefixes.matched( 'webkit' );

//  Will print webkitRequestAnimationFrame.
console.log( VendorPrefixes.make( 'requestAnimationFrame' ) );
```

## Browser support

I haven't used any special functionality of JS, so this is fully cross browser.