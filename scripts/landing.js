var animatePoints = function() {
    var revealPoint = function() {
         // #7
         $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translateY(0)'
         });
    };
    $.each($('.point'), revealPoint);
};

$(window).load(function() 
{
     // Automatically animate the points on a tall screen where scrolling can't trigger the animation
    if ($(window).height() > 950) {
         animatePoints();
    }
    
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

    
    $(window).scroll(function(event) 
        { 
                console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels"); 
                if ($(window).scrollTop() >= scrollDistance) {
             animatePoints();
            }
        });
});

