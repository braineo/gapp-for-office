//var frame  = document.createElement ("frame");
//frame.src  = chrome.extension.getURL ("Hello_world.htm");
//frame.id = 'inject'

var script = document.createElement("script");
script.src = chrome.extension.getURL("js/jquery.min.js")

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
    var src = chrome.extension.getURL("html/Hello_world.htm");
    $('#secFrame').append($(document.createElement('frame')).attr({
        'name': 'injectPage',
        'src': src
    }));

    var port = chrome.runtime.connect();

    window.addEventListener("keyup", function(event) {
      // We only accept messages from ourselves
      if (event.source != window)
        return;

      if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        port.postMessage(event.data.text);
      }
    }, false);
});
