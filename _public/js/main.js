function init() {
    // Activate link for current page.
    activePage();

    // Center objects vertically.
    verticalCenter();

    // Invert navbar color.
    navbarInvert();

    // Enable code highlighting.
    hljs.initHighlightingOnLoad();

    $(window).resize(function(){
        verticalCenter();
    });
}

function activePage() {
    var pages = $('.nav > li > a');
    pages.each(function() {        
        if ($(this).attr('href') == location.pathname) {
            return $(this).parent('li').addClass('active');
        }
    });
}

function verticalCenter() {
    $('[vertical-center]').each(function() {
        var parent = $(this).parent();
        $(this).css({
            position: 'absolute',
            top: (parent.outerHeight()/2 - $(this).outerHeight()/2) + 'px'
        });

        // Display element.
        $(this).removeClass('invisible');
    });
}

function navbarInvert() {
    var invert = $('[navbar-invert]');

    if (invert.length) {
        $('nav').addClass('navbar-invert');
    }
}

$(document).ready(init());