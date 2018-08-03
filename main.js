var code = [
  '// Ooh, a visitor. Hold on a second, please! I\'ll get the elves moving.\n',
  'document.title = "Hi :)";\n',
  'document.getElementById( "codeIn" ).style.width = "100%";\n',
  'document.getElementById( "codeIn" ).rows = "8";\n',
  'document.getElementById( "codeIn" ).style.resize = "none";\n',
  'document.getElementById( "codeIn" ).style.fontSize = "12px";\n',
  'document.getElementById( "codeIn" ).classList.add( "w3-half" );\n',
  'document.getElementById( "codeIn" ).classList.add( "w3-black" );\n',
  '// Much easier to see as a terminal; okay..here we go..\n',
  'document.getElementById( "containerL" ).classList.add( "w3-container" );\n',
  'document.getElementById( "containerL" ).classList.add( "w3-padding" );\n',
  'document.getElementById( "containerL" ).classList.add( "w3-half" );\n',
  'elem = document.createElement( "b" );\n',
  'document.getElementById( "containerL" ).appendChild( elem );\n',
  'elem.appendChild( document.createTextNode( "Hi :) I\'m Tom" ));\n',
  'elem.classList.add( "w3-large" );\n',
  'elem = document.createElement( "p" );\n',
  'document.getElementById( "containerL" ).appendChild( elem );\n',
  'elem.appendChild( document.createTextNode( "I enjoy computer programming, including building simple web pages like this." ));\n',
  'elem.classList.remove( "w3-text-white" );\n',
  'elem.classList.add( "w3-small" );\n',
  'elem.classList.add( "w3-padding" );\n',
  'elem.classList.add( "w3-border" );\n',
  'elem.style.fontWeight = "bold";\n',

  'elem = document.createElement( "b" );\n',
  'document.getElementById( "containerR" ).appendChild( elem );\n',
  'elem.appendChild( document.createTextNode( "Some of my projects" ));\n',
  'elem.classList.add( "w3-large" );\n',

  'elem = document.createElement( "ul" );\n',
  'document.getElementById( "containerR" ).appendChild( elem );\n',

  /*
  *  Project links
  */

  'item = document.createElement( "li" );\n',
  'elem.appendChild( item );\n',
  'link = document.createElement( "a" );\n',
  'item.appendChild( link );\n',
  'link.appendChild( document.createTextNode( "ReliefValve" ));\n',
  'link.href="https://github.com/l3laze/ReliefValve";\n',
  'link.target="_blank";\n',
  'item.style.display = "inline";\n',
  'item.style[ "margin-right" ] = "1rem";\n',

  'item = document.createElement( "li" );\n',
  'elem.appendChild( item );\n',
  'link = document.createElement( "a" );\n',
  'item.appendChild( link );\n',
  'link.appendChild( document.createTextNode( "lil-repl" ));\n',
  'link.href="https://github.com/l3laze/lil-repl";\n',
  'link.target="_blank";\n',
  'item.style.display = "inline";\n',
  'item.style[ "margin-right" ] = "1rem";\n',

  'item = document.createElement( "li" );\n',
  'elem.appendChild( item );\n',
  'link = document.createElement( "a" );\n',
  'item.appendChild( link );\n',
  'link.appendChild( document.createTextNode( "Doccomment" ));\n',
  'link.href="https://github.com/l3laze/Doccomment";\n',
  'link.target="_blank";\n',
  'item.style.display = "inline";\n',

  'item = document.createElement( "br" );\n',
  'elem.appendChild( item );\n',
  'item.style.display = "inline";\n',

  'item = document.createElement( "li" );\n',
  'elem.appendChild( item );\n',
  'link = document.createElement( "a" );\n',
  'item.appendChild( link );\n',
  'link.appendChild( document.createTextNode( "This page" ));\n',
  'link.href="https://l3laze.github.io";\n',
  'link.target="_blank";\n',
  'item.style.display = "inline";\n',

  /*
  *  EOF project links
  */


  'elem.style[ "list-style-type" ] = "none";\n',
  'elem.style[ "margin-left" ] = "-2.85rem";\n',
  'elem.style[ "margin-bottom" ] = "-0.85rem";\n',
  'elem.classList.add( "w3-medium" );\n',
  'document.getElementById( "containerR" ).classList.add( "w3-container" );\n',
  'document.getElementById( "containerR" ).classList.add( "w3-padding" );\n',
  'document.getElementById( "containerR" ).classList.add( "w3-half" );\n',

  '// This page was partially inspired by Tristan McCullen\'s "Me" project @ https://code.sololearn.com/WqjnZwxCjq7N/#js\n',
  '// I\'ve also always wanted to do something like this (aka legal insanity).'
],
  elem,
  link,
  item,
  icon,
  timer,
  lineIndex = 0,
  charIndex = 0,
  isComment = false,
  skipped = false,
  tyDef = 60,
  ttDef = 1500,
  typingTime = 60,
  thinkingTime = 1500,
  playing = false;

function typeCode( control ) {
  if (skipped === false ) {
    var ta = document.getElementById( "codeIn" );
    var chars = code[ lineIndex ].split( /.*?/g );
    if( chars[ 0 ] + chars[ 1 ] === "//" ) {
      isComment = true;
    }
    ta.scrollTop = ta.scrollHeight;
    ta.value += chars[ charIndex++ ];
    if( charIndex === chars.length ) {
      if( ! isComment ) {
        eval( code[ lineIndex ]);
      }
      if( lineIndex === code.length - 1 ) {
        console.log( "Done!" );
        skipped = true;
      }
      else {
        lineIndex++;
        charIndex = 0;
        if( playing === true ) timer = window.setTimeout( "typeCode()", ( isComment ? thinkingTime : typingTime ));
        isComment = false;
      }
    }
    else {
      if( playing === true ) timer = window.setTimeout( "typeCode()", typingTime );
    }
  }
}

function skipCoding() {
  playing = false;
  if( skipped === false ) {
    skipped = true;
    window.clearTimeout( timer );
    var ta = document.getElementById( "codeIn" );
    var chars = code[ lineIndex ].split( /.*?/g );
    var restOfLine = code[ lineIndex ].substring( charIndex, code[ lineIndex ].length );
    ta.value += restOfLine;
    eval( code[ lineIndex ]);
    for( ++lineIndex; lineIndex < code.length; lineIndex++ ) {
      ta.value += code[ lineIndex ];
      eval( code[ lineIndex ]);
    }
    ta.scrollTop = ta.scrollHeight;
  }
}

function mediaControl( which ) {
  window.clearTimeout( timer );

  if( which === "ff" ) {
    if( playing === true ) {
      typingTime = typingTime / 1.25;
      thinkingTime = thinkingTime / 1.25;
      if( typingTime < 0.1 ) typingTime = 0.1;
      if( thinkingTime < 0.1 ) thinkingTime = 0.1;
      typeCode( document.getElementById( "codeIn" ));
    }
    else {
      playing = true;
      typeCode( document.getElementById( "codeIn" ));
    }
  }
  else if( which === "play" ) {
    typingTime = tyDef;
    thinkingTime = ttDef;
    playing = true;
    typeCode( document.getElementById( "codeIn" ));
  }
  else if( which === "pause" ) {
    playing = false;
  }
}

window.addEventListener( "DOMContentLoaded", function() {
  playing = true;
  typeCode( document.getElementById( "codeIn" ));
});
