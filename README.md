General description
===================

After calling a particular function thousands of times (with the exact same arguments), a local variable in the function has a value of 'undefined' even though it is declared and assigned.

Reproduction
============

The [attached zip file](assets) contains a page which reproduces this bug on Safari Version 8.0.8 (10600.8.9) running on OS X 10.10.5. Load the page in a new tab (one which never had the JS console open), and hit the "Trigger Bug" button. After the button's title changes to "Got Bug :)", open the console. You should see an exception backtrace to code which clearly should not have failed. I was able to reproduce the bug using Safari Version 8.0.8 (10600.8.9) on two different machines, both running OS X 10.10.5. Note that if you load the page, open the console, and then refresh the page, the bug no longer reproduces in that tab. I am not sure why this is so.

I was not able to reproduce this bug in r183714 (2015-05-02 14:46:17 GMT), nor in r189964 (2015-09-18 07:40:20 GMT).  Since the former of those was a relatively old release, I am guessing Safari has all the JS engine updates that r183714 had.  If this is the case, then there is some other reason the bug doesn't reproduce in the nightlies.  It may be a problem with my reproduction code, meaning that the bug could still exist in the nightlies (we just don't know how to trigger it).  The bug also does not reproduce in El Capitan--I suspect for the same reason it does not produce in the nightlies.  I am hoping that you can use my reproduction in Safari to find the actual underlying bug, then see if that bug is in the nightlies.

Outcome of the bug
==================

The full reproduction code is rather intricate, but I will illustrate the problem by showing the code which falls victim to the bug:

```js
var usableHeight = height - SCRAMBLE_PADDING*2;
var usableY = SCRAMBLE_PADDING;
if ('number' !== typeof usableHeight || isNaN(usableHeight)) {
    console.log('usableHeight is', usableHeight, 'math is', height-SCRAMBLE_PADDING*2);
    throw new Error('invalid usableHeight: ' + usableHeight);
} ...
```

This prints "usableHeight is undefined math is 610" to the console. Clearly, it should print "usableHeight is 610 math is 610". In the very least, usableHeight should have the same value as the result of the math expression to which it was assigned.

Other notes
==========

I believe that this bug has to do with function inlining. After the bug has occurred once in a tab, it is possible to see it again from the JS console. However, calling the buggy function directly from the JS console does not result in the bug. Nevertheless, calling the function which calls the buggy function from the JS console *does* result in the bug. Thus, it seems that the problem is with an optimized form of the parent function, which has an inlined version of the buggy function.

Also, a jsFiddle page which reproduces the bug can be found at [http://jsfiddle.net/gbt6gjao/1](http://jsfiddle.net/gbt6gjao/1).