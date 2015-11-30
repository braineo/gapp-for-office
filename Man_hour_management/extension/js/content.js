//var frame  = document.createElement ("frame");
//frame.src  = chrome.extension.getURL ("Hello_world.htm");
//frame.id = 'inject'

var script = document.createElement("script");
script.src = chrome.extension.getURL("js/lib/jquery.min.js")

// inject jQuery in webpage
document.getElementsByTagName('head')[0].appendChild(script);
//document.body.insertBefore (frame, document.body.firstChild);

//need to put jquery.js before other js in manifest.json in section content_script
$(document).ready(function() {
    $("frameset#MainFrame").eq(0).attr('cols', '300,*');
    $("frameset#MainFrame").eq(0).append($(document.createElement('frameset')).attr({
        'id': 'secFrame',
        'rows': '30%, 70%'
    }));
    $('frame[name="OPERATION"]', top.document).appendTo('#secFrame');
    var src = chrome.extension.getURL("html/timeInput.htm");
    $('#secFrame').append($(document.createElement('frame')).attr({
        'name': 'injectPage',
        'src': src
    }));
});


// receives message from background script
chrome.extension.onMessage.addListener(function(message, sender) {
    console.log("In content_script ");
    if (message.logUrl) {
        var time = $(".InputTxtR[name='StartTime']", top.frames["OPERATION"].document).val();
        console.log(time);
        chrome.runtime.sendMessage({startTime:time}, function(response){
            console.log(response.fine);
        });
    }
});