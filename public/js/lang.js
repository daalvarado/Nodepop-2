const i18n = require("./lib/i18nConfigure")();

$('.navLang').click(function(event){
    console.log('button pressed');
    console.log(event);
    console.log(this);
    $(this).toggleClass('navLang--active');
    i18n.locale=this.id;
});


