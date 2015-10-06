var pointsArray = document.getElementsByClassName('point');
 
var animatePoints = function(points) {
    
    var revealPoint = function(j) 
    {
        points[j].style.opacity = 1;
        points[j].style.transform = "scaleX(1) translateY(0)";
        points[j].style.msTransform = "scaleX(1) translateY(0)";
        points[j].style.WebkitTransform = "scaleX(1) translateY(0)";   
    };
                  
    for(var i=0; i< points.length; i++)
    { revealPoint(i); }
};

window.onload = function()
{
     // Automatically animate the points on a tall screen where scrolling can't trigger the animation
     if (window.innerHeight > 950) 
     { animatePoints(pointsArray); }
    
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    window.addEventListener
    ('scroll', function(event) 
            { 
                console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels"); 
                if (document.body.scrollTop >= scrollDistance) 
                { animatePoints(pointsArray); }
            }
    );
}

