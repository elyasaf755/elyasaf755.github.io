const responsive = {
    0:{
        items:1,
        loop:true
    },
    560:{
        items:2,
        loop:true
    },
    960:{
        items:3,
        loop:true
    }
}

$(document).ready(function(){
    $nav = $('.nav'); //nav variable = .nav element
    $toggleCollapse = $('.toggle-collapse');

    /* click event on toggle menue */
    $toggleCollapse.click(function(){
        $nav.toggleClass('collapse')
    })

    // owl-carousel for blog
    $('.owl-carousel').owlCarousel({
        loop:true,
        autoplay:true,
        autoplayTimeout:3000,
        nav:true,
        navText:[$('.owl-navigation .owl-nav-prev'), $('.owl-navigation .owl-nav-next')],
        responsive: responsive
    });

    // Click to scroll up
    $('.move-up span').click(function(){
        $('html, body').animate({
            scrollTop:0
        }, 1000);
    })

    // Animate On Scroll instance
    AOS.init()

});