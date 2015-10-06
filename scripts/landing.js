var animatePoints = function() 
{
    var points = document.getElementsByClassName('point');
                  
    for(var i=0; i< points.length; i++)
    { 
         var revealPoint = function(j) 
        {
            points[j].style.opacity = 1;
            points[j].style.transform = "scaleX(1) translateY(0)";
            points[j].style.msTransform = "scaleX(1) translateY(0)";
            points[j].style.WebkitTransform = "scaleX(1) translateY(0)";   
        };
        
        revealPoint(i);
    }
};

