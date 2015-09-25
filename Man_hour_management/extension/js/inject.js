//var frame  = document.createElement ("frame");
//frame.src  = chrome.extension.getURL ("Hello_world.htm");
//frame.id = 'inject'

var script = document.createElement("script");
script.src = chrome.extension.getURL("jquery.min.js")

// inject jQuery in webpage
document.getElementsByTagName('head')[0].appendChild(script);
//document.body.insertBefore (frame, document.body.firstChild);

//need to put jquery.js before other js in manifest.json in section content_script
$(document).ready(function(){
    $("frameset#MainFrame").eq(0).attr('cols','300,*');
    $("frameset#MainFrame").eq(0).append($(document.createElement('frameset')).attr({'id': 'secFrame','rows':'50%, 50%'}))
    $('frame[name="OPERATION"]', top.document).appendTo('#secFrame')
    var src = chrome.extension.getURL ("Hello_world.htm");
    $('#secFrame').append($(document.createElement('frame')).attr({'id':'injectPage', 'src':src}))
});