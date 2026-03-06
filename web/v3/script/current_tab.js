
$("div#main-container section:first-child ul li").on('click',function(){
    current_tab = $("div#main-container section:first-child ul li").index($(this));
});
    
$("div#main-container section:first-child").tabs({ active: current_tab });

